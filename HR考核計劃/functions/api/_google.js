// 共用模組：用 Google 服務帳戶（Service Account）存取 Google Sheets API
// 純 Cloudflare（Web Crypto 簽 JWT 換 token），不需要 Apps Script。
// 需要的環境變數：
//   GOOGLE_CLIENT_EMAIL  服務帳戶 email（xxx@xxx.iam.gserviceaccount.com）
//   GOOGLE_PRIVATE_KEY   服務帳戶私鑰（-----BEGIN PRIVATE KEY----- ... 那一大段）
//   DATA_SHEET_ID        新表「季緣HR系統_資料庫」的 ID（可省略，預設如下）
export const DEFAULT_SHEET_ID = "1MBtq1J4jiCc9_7VdfXKMMkSoR4aJvCsSPNVQ66C5eHs";

let _tok = null, _exp = 0;

function b64url(bytes) {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlStr(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
// 容錯清理私鑰：處理「整段 JSON、多帶引號、\n 字面、Windows 換行」等常見貼錯
function cleanKey(raw) {
  let s = String(raw == null ? "" : raw).trim();
  if (s.charAt(0) === "{") { try { s = JSON.parse(s).private_key || s; } catch (e) {} }
  else if (s.indexOf('"private_key"') >= 0) { const m = s.match(/"private_key"\s*:\s*"([^"]+)"/); if (m) s = m[1]; }
  s = s.replace(/^\s*["']|["']\s*$/g, "");
  s = s.replace(/\\r/g, "").replace(/\\n/g, "\n");
  return s;
}
function pemToBuf(pem) {
  const b64 = pem.replace(/-----BEGIN [^-]+-----/, "").replace(/-----END [^-]+-----/, "").replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function getToken(env) {
  if (_tok && Date.now() < _exp) return _tok;
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: env.GOOGLE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, iat: now,
  };
  const unsigned = b64urlStr(JSON.stringify(header)) + "." + b64urlStr(JSON.stringify(claim));
  const keyBuf = pemToBuf(cleanKey(env.GOOGLE_PRIVATE_KEY));
  const key = await crypto.subtle.importKey("pkcs8", keyBuf, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = unsigned + "." + b64url(sig);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + jwt,
  });
  const j = await res.json();
  if (!j.access_token) throw new Error("token error: " + JSON.stringify(j));
  _tok = j.access_token; _exp = Date.now() + 3500 * 1000;
  return _tok;
}

export function sheetId(env) { return env.DATA_SHEET_ID || DEFAULT_SHEET_ID; }

export async function readRange(env, range) {
  const t = await getToken(env);
  const id = sheetId(env);
  const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: "Bearer " + t } });
  const j = await r.json();
  return j.values || [];
}

// 確保分頁存在（不存在就自動建立），避免 append 因分頁未建而靜靜失敗
const _knownTabs = new Set();
export async function ensureSheet(env, title) {
  if (!title || _knownTabs.has(title)) return;
  const t = await getToken(env);
  const id = sheetId(env);
  const meta = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}?fields=sheets.properties.title`,
    { headers: { Authorization: "Bearer " + t } })).json();
  const titles = (meta.sheets || []).map(s => s.properties && s.properties.title).filter(Boolean);
  titles.forEach(x => _knownTabs.add(x));
  if (!titles.includes(title)) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}:batchUpdate`,
      { method: "POST", headers: { Authorization: "Bearer " + t, "Content-Type": "application/json" },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title } } }] }) });
    // 寫一列標題佔住第 1 列，讓資料從第 2 列開始（讀取端都是從 A2 起）
    const header = HEADERS[title] || ["自動建立"];
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(title + "!A1")}?valueInputOption=RAW`,
      { method: "PUT", headers: { Authorization: "Bearer " + t, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [header] }) });
    _knownTabs.add(title);
  }
}
// 各分頁標題（自動建立時寫入第 1 列）
const HEADERS = {
  "新人考核": ["時間", "工號", "姓名", "門市", "職稱", "分數", "通過", "等級", "評語", "考核日", "更新時間", "要學飲品"],
  "GHP": ["時間", "工號", "門市", "姓名", "值"],
  "技能評核": ["時間", "門市", "主管", "工號", "技能", "等級"],
  "班別": ["時間", "工號", "早", "中", "晚"],
  "新人自報": ["時間", "工號", "自報9碼", "姓名", "門市"],
};

export async function appendRows(env, range, rows) {
  const tab = String(range).split("!")[0].replace(/^'|'$/g, "");   // 從 "新人考核!A1" 取出分頁名
  await ensureSheet(env, tab);                                     // 沒有就自動建立
  const t = await getToken(env);
  const id = sheetId(env);
  const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: { Authorization: "Bearer " + t, "Content-Type": "application/json" }, body: JSON.stringify({ values: rows }) });
  return r.json();
}

export function json(o, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
