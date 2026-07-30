// POST /api/eval → 新增一筆新人考核（append 到「新人考核」分頁）
import { appendRows, json } from "./_google.js";
export async function onRequest({ request, env }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const b = await request.json();
    const now = new Date().toISOString();
    await appendRows(env, "新人考核!A1", [[
      now, b.id || "", b.name || "", b.store || "", b.job || "",
      b.sc || "", b.pass ? 1 : 0, JSON.stringify(b.levels || {}), b.memo || "", b.date || "", b.updated || "",
    ]]);
    return json({ ok: true });
  } catch (e) { return json({ ok: false, msg: String(e) }); }
}
