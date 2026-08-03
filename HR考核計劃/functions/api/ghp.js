// POST /api/ghp → 店經理確認新人已看 GHP 宣導影片，append 到「GHP」分頁
// 欄位：時間, 員工ID, 門市, 姓名, 值(1/0)
import { appendRows, json } from "./_google.js";
export async function onRequest({ request, env }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const b = await request.json();
    const now = new Date().toISOString();
    await appendRows(env, "GHP!A1", [[now, String(b.id || ""), String(b.store || ""), String(b.name || ""), b.done ? 1 : 0]]);
    return json({ ok: true });
  } catch (e) { return json({ ok: false, msg: String(e) }); }
}
