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
    const values = roster.filter(r => String(r[1] || "").trim() !== "").map(r => {
      const row = r.slice(0, 16); while (row.length < 16) row.push("");
      row[16] = (map[String(r[0] || "").trim()] || {}).v || "";
      return row;
    });
    return json({ values });
  } catch (e) { return json({ error: String(e), values: [] }); }
}
