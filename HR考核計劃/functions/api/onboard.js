// GET /api/onboard?id=&name=&store= → 該員最新一筆新人考核（技能評核帶入用）
import { readRange, json } from "./_google.js";
export async function onRequest({ request, env }) {
  try {
    const u = new URL(request.url);
    const id = (u.searchParams.get("id") || "").trim();
    const name = (u.searchParams.get("name") || "").trim();
    const store = (u.searchParams.get("store") || "").trim();
    const rows = await readRange(env, "新人考核!A2:K"); // 時間,員工編號,姓名,門市,職位,總分,通過,等級JSON,評語,考核日,修改時間
    let best = null;
    rows.forEach(r => {
      const match = id ? String(r[1]).trim() === id : (String(r[2]).trim() === name && String(r[3]).trim() === store);
      if (!match) return;
      const t = Date.parse(r[0]) || 0;
      if (!best || t > best._t) {
        let lv = {}; try { lv = JSON.parse(r[7] || "{}"); } catch (e) {}
        best = { levels: lv, sc: r[5], pass: (r[6] == 1), date: r[9] || r[0], updated: r[10] || r[0], _t: t };
      }
    });
    if (best) delete best._t;
    return json(best);
  } catch (e) { return json({ error: String(e) }); }
}
