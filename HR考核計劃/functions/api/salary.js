// GET /api/salary → 讀「薪資」分頁，回傳每人薪資（給 manager 卡片顯示與建議加薪）
// 分頁欄位（貼上 HR 匯出的薪資表即可）：
//   A 工號 | B 姓名 | C 單位 | D 本薪 | E 伙食津貼 | F 時薪 | G 差勤獎金 | H 積分獎金 | I 職級職等獎金 | ... | O 薪資類別
import { readRange, json } from "./_google.js";
export async function onRequest({ env }) {
  try {
    let rows = [];
    try { rows = await readRange(env, "薪資!A1:O400"); } catch (e) { return json({ salary: [] }); }
    const num = v => { if (v === "" || v == null) return null; const n = Number(String(v).replace(/[, ]/g, "")); return isNaN(n) ? null : n; };
    const out = [];
    rows.forEach(r => {
      const id = String(r[0] || "").trim();
      if (!id || id === "工號" || id === "作業時間") return;   // 跳過標題/metadata
      out.push({
        id, name: String(r[1] || "").trim(), store: String(r[2] || "").trim(),
        base: num(r[3]), food: num(r[4]), hourly: num(r[5]), bonus: num(r[8]),
        type: String(r[14] || "").trim()
      });
    });
    return json({ salary: out });
  } catch (e) { return json({ error: String(e), salary: [] }); }
}
