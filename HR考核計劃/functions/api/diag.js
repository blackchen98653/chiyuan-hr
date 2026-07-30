// GET /api/diag → 安全診斷：只回報環境變數狀態，不洩漏私鑰內容（用完可刪）
export async function onRequest({ env }) {
  const k = env.GOOGLE_PRIVATE_KEY || "";
  const info = {
    hasClientEmail: !!env.GOOGLE_CLIENT_EMAIL,
    clientEmailTail: (env.GOOGLE_CLIENT_EMAIL || "").slice(-28),
    keyPresent: !!k,
    keyLength: k.length,
    startsWithBegin: k.trimStart().startsWith("-----BEGIN"),
    endsWithEnd: k.trimEnd().endsWith("-----") || k.trimEnd().endsWith("-----\\n"),
    hasEscapedBackslashN: k.indexOf("\\n") >= 0,
    hasRealNewline: k.indexOf("\n") >= 0,
    dataSheetTail: (env.DATA_SHEET_ID || "").slice(-6),
    codeHasCleanKey: true, // 這個檔存在＝新程式有部署到
  };
  return new Response(JSON.stringify(info, null, 2), { headers: { "content-type": "application/json; charset=utf-8" } });
}
