// POST /api/checkin → 新人自報（待核對）append 到「新人自報」分頁；讀取時取每人最新一筆
import { appendRows, json } from "./_google.js";
export async function onRequest({ request, env }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const b = await request.json();
    const now = new Date().toISOString();
    const self = (b.self || []).map(x => (x ? 1 : 0)).join("");
    await appendRows(env, "新人自報!A1", [[now, b.id || "", self, b.name || "", b.store || ""]]);
    return json({ ok: true });
  } catch (e) { return json({ ok: false, msg: String(e) }); }
}
