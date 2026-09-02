// GET /api/evals → 讀「新人考核」分頁，回傳每人「最新一筆」考核（給 manager / HR 跨裝置同步）
// 欄位：A時間 B工號 C姓名 D門市 E職稱 F分數 G通過(1/0) H等級JSON I評語 J考核日 K更新時間 L要學飲品(1/0)
import { readRange, json } from "./_google.js";
export async function onRequest({ env }) {
  try {
    let rows = [];
    try { rows = await readRange(env, "新人考核!A2:L"); } catch (e) { return json({ evals: [] }); }
    const parse = s => { try { return JSON.parse(s || "{}"); } catch (e) { return {}; } };
    const latest = {};
    rows.forEach(r => {
      const id = String(r[1] || "").trim(), name = String(r[2] || "").trim(), store = String(r[3] || "").trim();
      if (!name && !id) return;
      const key = id || (name + "|" + store);
      const t = Math.max(Date.parse(r[10] || "") || 0, Date.parse(r[9] || "") || 0, Date.parse(r[0] || "") || 0);
      if (latest[key] == null || t >= latest[key]._t) {
        latest[key] = {
          _t: t, id, name, store, job: String(r[4] || ""),
          sc: r[5], pass: (String(r[6]) === "1" || r[6] === 1),
          levels: parse(r[7]), memo: String(r[8] || ""),
          date: String(r[9] || ""), updated: String(r[10] || ""),
          drinkOn: (String(r[11]) === "1" || r[11] === 1)
        };
      }
    });
    return json({ evals: Object.values(latest) });
  } catch (e) { return json({ error: String(e), evals: [] }); }
}
