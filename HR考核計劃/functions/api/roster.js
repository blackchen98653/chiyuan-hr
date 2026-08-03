// GET /api/roster → 讀新表「名冊」分頁（IMPORTRANGE 鏡射大表）＋ join 新人自報
import { readRange, json } from "./_google.js";
export async function onRequest({ env }) {
  try {
    const roster = await readRange(env, "名冊!A2:P");
    const selfRows = await readRange(env, "新人自報!A2:E"); // 時間,員工ID,自報9碼,姓名,門市
    const map = {};
    selfRows.forEach(r => {
      const id = String(r[1] || "").trim(); const t = Date.parse(r[0]) || 0;
      if (id && (!map[id] || t >= map[id].t)) map[id] = { t, v: String(r[2] || "") };
    });
    // GHP 宣導影片確認（分頁可能尚未建立 → 讀取失敗不影響名冊）
    const ghpMap = {};
    try {
      const ghpRows = await readRange(env, "GHP!A2:E"); // 時間,員工ID,門市,姓名,值
      ghpRows.forEach(r => {
        const t = Date.parse(r[0]) || 0;
        const id = String(r[1] || "").trim();
        const key = id || (String(r[3] || "").trim() + "|" + String(r[2] || "").trim());
        if (!key) return;
        if (!ghpMap[key] || t >= ghpMap[key].t) ghpMap[key] = { t, v: String(r[4] || "").trim() };
      });
    } catch (e) { /* GHP 分頁不存在時忽略 */ }
    const values = roster.filter(r => String(r[1] || "").trim() !== "").map(r => {
      const row = r.slice(0, 16); while (row.length < 16) row.push("");
      const id = String(r[0] || "").trim(), nm = String(r[1] || "").trim(), st = String(r[3] || "").trim();
      row[16] = (map[id] || {}).v || "";
      row[17] = ((id && ghpMap[id]) || ghpMap[nm + "|" + st] || {}).v || "";
      return row;
    });
    return json({ values });
  } catch (e) { return json({ error: String(e), values: [] }); }
}
