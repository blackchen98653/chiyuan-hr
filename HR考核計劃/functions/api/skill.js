// POST /api/skill → 技能評核（含班別）append 到「技能評核」「班別」分頁；讀取時取每人每項最新
import { appendRows, json } from "./_google.js";
export async function onRequest({ request, env }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const b = await request.json();
    const now = new Date().toISOString();
    const skillRows = [];
    const evals = b.evals || {};
    Object.keys(evals).forEach(emp => {
      const e = evals[emp] || {};
      Object.keys(e).forEach(sk => skillRows.push([now, b.store || "", b.manager || "", emp, sk, e[sk]]));
    });
    if (skillRows.length) await appendRows(env, "技能評核!A1", skillRows);
    const shiftRows = [];
    const shifts = b.shifts || {};
    Object.keys(shifts).forEach(emp => {
      const s = shifts[emp] || {};
      shiftRows.push([now, emp, s.morning ? 1 : 0, s.mid ? 1 : 0, s.night ? 1 : 0]);
    });
    if (shiftRows.length) await appendRows(env, "班別!A1", shiftRows);
    return json({ ok: true });
  } catch (e) { return json({ ok: false, msg: String(e) }); }
}
