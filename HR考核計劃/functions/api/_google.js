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
  const keyBuf = pemToBuf((env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"));
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

export async function appendRows(env, range, rows) {
  const t = await getToken(env);
  const id = sheetId(env);
  const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: { Authorization: "Bearer " + t, "Content-Type": "application/json" }, body: JSON.stringify({ values: rows }) });
  return r.json();
}

export function json(o, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
