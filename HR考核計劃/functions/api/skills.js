// GET /api/skills → 全體最新技能評核 + 班別（給 HR 總覽 / 技能評核載入）
import { readRange, json } from "./_google.js";
export async function onRequest({ env }) {
  try {
    const evals = {}, times = {}, empTime = {};
    const rows = await readRange(env, "技能評核!A2:F"); // 時間,門市,主管,員工ID,技能,等級
    rows.forEach(r => {
      const t = Date.parse(r[0]) || 0, emp = String(r[3] || "").trim(), sk = String(r[4] || "").trim(), lv = String(r[5] || "").trim();
      if (!emp || !sk) return;
      const key = emp + "|" + sk;
      if (times[key] == null || t >= times[key]) { times[key] = t; (evals[emp] = evals[emp] || {})[sk] = lv; }
      if (empTime[emp] == null || t > empTime[emp]) empTime[emp] = t;   // 每人最後評核時間
    });
    const shifts = {}, stime = {};
    const srows = await readRange(env, "班別!A2:E"); // 時間,員工ID,早,中,晚
    srows.forEach(r => {
      const t = Date.parse(r[0]) || 0, emp = String(r[1] || "").trim();
      if (!emp) return;
      if (stime[emp] == null || t >= stime[emp]) {
        stime[emp] = t;
        shifts[emp] = { morning: r[2] == 1, mid: r[3] == 1, night: r[4] == 1 };
      }
    });
    return json({ evals, shifts, times: empTime });
  } catch (e) { return json({ error: String(e), evals: {}, shifts: {}, times: {} }); }
}
