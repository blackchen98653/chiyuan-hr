/* =====================================================================
   季緣 CHIYUAN · HR 新人流程系統 — 共用資料層 (config.js)
   ---------------------------------------------------------------------
   ★ 拿到 Google Sheets 金鑰後，只需修改本檔最上方的 CONFIG。
     其他頁面 (index / manager / hr) 都透過 window.CHIYUAN 取資料。
   ===================================================================== */
window.CHIYUAN = (function () {
"use strict";

/* ========== 1. API 設定（拿到金鑰後改這裡） ========================= */
const CONFIG = {
  // false = 用下方樣本名冊預覽；true = 走雲端（Cloudflare Functions + Google 服務帳戶）
  USE_CLOUD: true,
  API_BASE: "/api",   // 前端只呼叫自己的 /api/*，後端用服務帳戶讀寫 Google Sheets
};

/* ========== 2. 門市清單 ============================================ */
const STORES = {
  "北市":  ["小巨蛋店","師大店","松江店","忠孝店","內湖店","台北車站店","大安店","光華店","民權店"],
  "新北市":["頂溪店","板橋店"],
  "中區":  ["一中店","逢甲店"],
};
const ALL_STORES = Object.values(STORES).flat();

/* ========== 3. 店經理門市密碼（上線前填） ========================== */
/* 例：{ "一中店":"cy1234", "逢甲店":"fj5678" }
   留空的門市 = 測試模式，免密碼直接進入。HR 總覽頁不設密碼。 */
const STORE_PW = {};

/* ========== 4. 報到 Checklist 定義 ================================ */
const CHECKLIST = {
  ABBR: ["資料","健保","健檢","存摺","契約","制服","Apollo","環境","排班"],
  FULL: ["完成填寫員工資料(Fillout)","健保要投保嗎？","繳交供膳人員健檢","繳交存摺影本（兆豐）","簽署勞動契約",
         "領取制服／帽子／圍裙","下載 Apollo 人資系統並通知人資開通權限","認識工作環境","排班"],
  // 新人端顯示用（含說明）；最後一項為資訊列，不可勾選
  ITEMS: [
    {t:"完成填寫員工資料(Fillout)", d:""},
    {t:"健保要投保嗎？", d:"要或不要都要跟店經理說；正職一律投保"},
    {t:"繳交供膳人員健檢（一年效期）", d:"到職三個月內繳交｜A肝、傷寒、胸腔 X 光"},
    {t:"繳交存摺影本（兆豐）", d:"非兆豐每次轉帳扣手續費 $15"},
    {t:"簽署勞動契約", d:""},
    {t:"領取制服／帽子／圍裙", d:"離職後需洗淨歸還"},
    {t:"下載 Apollo 人資系統並通知人資開通權限", d:""},
    {t:"認識工作環境", d:""},
    {t:"排班", d:""},
    {t:"新進人員訓練計畫表", d:"到職後一～三個月內", info:true, tag:"由店經理考核"}
  ],
};

/* ========== 5. 考核項目 icons ==================================== */
const ICONS = {
  product:'<path d="M11.4 3.8H4.4v7l9.4 9.4 7-7z"/><circle cx="8.1" cy="8.1" r="1.3"/>',
  delivery:'<path d="M5.4 8.4h13.2l-1 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z"/><path d="M9 8.4V6.6a3 3 0 0 1 6 0v1.8"/><path d="M9.6 12.6h4.8"/>',
  speed:'<circle cx="12" cy="13.6" r="7.3"/><path d="M12 9.8v4l2.6 1.6"/><path d="M9.7 3.4h4.6M12 3.4v2.9"/>',
  quality:'<circle cx="12" cy="12" r="8.4"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/>',
  safety:'<path d="M12 3.4 19 6v5.6c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6z"/><path d="M12 9.5v5M9.5 12h5"/>',
  complaint:'<path d="M4.6 14.2v-2a7.4 7.4 0 0 1 14.8 0v2"/><rect x="2.9" y="13.4" width="3.7" height="5.5" rx="1.6"/><rect x="17.4" y="13.4" width="3.7" height="5.5" rx="1.6"/>',
  attire:'<path d="M8.5 4 12 6.6 15.5 4 20 6.6V11h-2.6v9H6.6v-9H4V6.6z"/>',
  attitude:'<circle cx="12" cy="12" r="8.5"/><path d="M8.4 14.2s1.3 1.7 3.6 1.7 3.6-1.7 3.6-1.7"/><path d="M9.2 9.6h.01M14.8 9.6h.01"/>',
  counter:'<rect x="3.2" y="7.5" width="17.6" height="12.5" rx="2.2"/><path d="M7.5 7.5V5.6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1.9"/><path d="M7.6 12.2h8.8M7.6 16h5.4"/>',
  phrases:'<path d="M20.5 11.6a6.6 6.6 0 0 1-6.6 6.6H8.6L4.2 21.4v-5.1a6.6 6.6 0 0 1 4.4-11.5h5.3a6.6 6.6 0 0 1 6.6 6.8z"/><path d="M8.6 10h7M8.6 13.4h4.6"/>',
  prep:'<path d="M3.2 8 12 3.8 20.8 8 12 12.2z"/><path d="M3.2 8v8.2L12 20.4l8.8-4.2V8"/><path d="M12 12.2v8.2"/>',
  tea:'<path d="M4.8 9.8h10.6v5.1a5 5 0 0 1-5 5H9.8a5 5 0 0 1-5-5z"/><path d="M15.4 11h2.2a2.4 2.4 0 0 1 0 4.8h-2.2"/><path d="M8.2 6.6c0-1 1-1.4 1-2.4M11.8 6.6c0-1 1-1.4 1-2.4"/><path d="M4.4 20.9h11.4"/>',
  drink:'<path d="M6.2 7.8h11.6l-1.3 12.1a2 2 0 0 1-2 1.8H9.5a2 2 0 0 1-2-1.8z"/><path d="M4.4 5.6h15.2"/><circle cx="10.2" cy="16.4" r=".9"/><circle cx="13.8" cy="17.8" r=".9"/><circle cx="13.4" cy="13.6" r=".9"/>',
  clean:'<path d="M11.8 3.2 13.5 7.4 17.8 9l-4.3 1.7-1.7 4.2-1.7-4.2L5.8 9l4.3-1.6z"/><path d="M17.8 14.6l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9z"/>',
  form:'<rect x="5.2" y="4.2" width="13.6" height="16.6" rx="2.2"/><path d="M9.4 4.2V3h5.2v1.2"/><path d="M9 10h6M9 13.6h6M9 17.2h3.4"/>',
};
const EVAL_ITEMS = [
  {key:"attire",sec:"前場",name:"服儀確認",w:5,icon:"attire",
    lv:["未符合","常需提醒","偶有疏漏","每日符合","無懈可擊"],
    desc:[
      "服裝儀容合標準（衣服、名牌、褲子、鞋子、圍裙、頭髮、指甲、飾品）。",
      "站姿與行為舉止良好。",
    ]},
  {key:"attitude",sec:"前場",name:"服務態度",w:10,icon:"attitude",
    lv:["態度冷淡","需人提醒","有禮回應","主動關心","顧客稱讚"],
    desc:["語氣舒適、態度真誠有禮，展現足夠耐心，主動觀察顧客狀態需求。"]},
  {key:"counter",sec:"前場",name:"櫃檯點餐與收銀操作",w:12,icon:"counter",
    lv:["未接觸","需人協助","可獨立","快速正確","能帶新人"],
    desc:[
      "熟悉 POS 點餐、介紹、顧客互動、收銀結帳、接洽外送單、會員權益。",
      "定期清點零錢鈔票、熟悉發票作廢方式。",
      "點餐引導流暢，讓顧客感受舒適。",
    ]},
  {key:"phrases",sec:"前場",name:"服務三用語",w:10,icon:"phrases",
    lv:["不會說","需人提示","三句齊全","自然流暢","無懈可擊"],
    desc:[
      {l:"招呼用語",t:"「您好，今天想喝什麼呢？」（字字正確）"},
      {l:"等待用語",t:"「不好意思，飲品需要再稍等一下喔！」"},
      {l:"出餐用語",t:"「(號碼)，(先生/小姐)您的飲品好了喔！久等了謝謝！」"},
    ]},
  {key:"product",sec:"前場",name:"產品知識",w:6,icon:"product",
    lv:["不熟悉","需人提示","能說明","主動推薦","如數家珍"],
    desc:[
      "主動介紹產品；對產品夠熟悉並能清楚傳達給顧客。",
      {l:"介紹用語",t:"「季緣是以臺灣精品茶為主打，使用等級好的臺灣茶且沒有加香精香料，提供真實的在地原味，結合水果、奶類為不同系列，看您想喝什麼系列可以介紹比較詳細。」"},
    ]},
  {key:"complaint",sec:"前場",name:"客訴處理",w:5,icon:"complaint",
    lv:["不會處理","需人協助","可獨立","應對得宜","化解自如"],
    desc:[
      {l:"1 接受問題",t:"以友好的態度接受並聆聽顧客的問題，確保顧客感受到被重視。"},
      {l:"2 理解問題",t:"仔細聆聽顧客的問題，確保充分理解問題的內容和原因，可以透過主動提問來確認理解。"},
      {l:"3 道歉表達",t:"無論問題的原因是什麼，都應該以誠懇的態度向顧客道歉，表達對顧客不便的歉意。"},
      {l:"4 解決問題",t:"根據問題的性質和顧客的需求，積極採取行動解決問題，例如重新製作飲品、更換產品、提供折扣或補償等。"},
      {l:"5 專業解答",t:"如果顧客提出的問題需要專業知識來解答，應該提供準確和專業的解答，並避免使用不確定或含糊的回答。"},
      {l:"6 跟進與關懷",t:"解決問題後主動跟進，確保顧客對解決方案滿意，並表達對顧客的感謝和關懷，以提升顧客滿意度。"},
      {l:"7 記錄與反饋",t:"記錄顧客提出的問題和解決方案，並及時向 SM 反饋，以便日後避免類似問題發生，並記錄於管理人日誌當中。"},
      {l:"8 學習和改進",t:"從問題處理的過程中學習，不斷改進與提升服務水準，並將本次學習經驗分享給至少一位同店同仁。"},
    ]},
  {key:"delivery",sec:"前場",name:"外送",w:3,icon:"delivery",
    lv:["未接觸","需人協助","可獨立"],
    desc:[
      "親切、有效率、精準回覆外送訂單（電話／Line）。",
      "獨立完成外送服務並做售後線上關心。",
    ]},
  {key:"prep",sec:"後場",name:"備料",w:10,icon:"prep",
    lv:["未接觸","需人協助","可獨立","品質穩定","能帶新人"],
    desc:["煮茶、茶凍、珍珠、厚奶、奶蓋、黑糖、冬瓜茶等製備流程。"]},
  {key:"tea",sec:"後場",name:"泡茶",w:10,ftOnly:true,icon:"tea",
    lv:["未接觸","需人協助","可獨立","品質穩定","駕輕就熟"],
    desc:["符合品質要求、試喝、即時掌握庫存。"]},
  {key:"drinkmix",sec:"後場",name:"製作飲品",w:10,optional:true,icon:"drink",
    lv:["未接觸","需人協助","可獨立","品質穩定","全品項熟練"],
    desc:[
      "1. 調製台灣精品茶（純茶）。",
      "2. 調製鮮奶茶、奶蓋系列飲品（奶茶、鮮乳）。",
      "3. 調製水果茶系列飲品。",
      "4. 調製無咖啡因系列飲品（冬瓜茶黑糖珍珠鮮奶）。",
    ]},
  {key:"drink",sec:"後場",name:"飲品製作效率",w:6,optional:true,icon:"speed",
    lv:["未接觸","需人協助","可獨立","接近達標","達標穩定"],
    desc:[
      {l:"效率與速度",t:"非現打或加熱飲品，需達成平均 1 分鐘／杯之製作速度。"},
      {l:"品質堅持",t:"嚴格遵循製作比例與流程，外觀、口感及溫度皆需符合標準。"},
      {l:"溝通回報",t:"後場忙碌時，第一時間告知前場，確保出杯節奏。"},
    ]},
  {key:"quality",sec:"後場",name:"品質確保",w:10,icon:"quality",
    lv:["未達標","需人提醒","可獨立","品質穩定","主動把關"],
    desc:[
      {l:"1 備料品質",t:"製作之備料符合公司要求之品質。隨時掌握物料狀態，適時補充物料，避免供應不足。"},
      {l:"2 飲品標準",t:"正確遵循飲品製作比例與流程，並能熟記飲品比例。製作之飲品符合公司要求之外觀、口感及溫度標準。"},
      {l:"3 效期檢查",t:"定期檢查備料與茶品品質與保存期限，確保新鮮度。"},
      {l:"4 庫存掌握",t:"對於門店物料庫存量即時掌握，主動提醒店經理叫貨。"},
    ]},
  {key:"clean",sec:"後場",name:"設備清潔與維護",w:10,icon:"clean",
    lv:["未接觸","需人協助","可獨立","確實無漏","主動維護"],
    desc:[
      "清潔消毒確實完成、封膜機更換、打熱機清潔、沖洗工具無殘留物。",
      "保持作業區之整潔。",
      "正確使用早晚班清單和清潔流程表保養設備。",
    ]},
  {key:"safety",sec:"後場",name:"安全操作",w:4,icon:"safety",
    lv:["常忽略","需人提醒","確實遵守","主動維持","以身作則"],
    desc:[
      "1. 遵循食品安全衛生規範，包括戴口罩、手套。",
      "2. 避免危險行為，以安全方式按流程使用器具。",
    ]},
  {key:"form",sec:"後場",name:"門店表單認識填寫",w:5,icon:"form",
    lv:["未接觸","需人協助","可獨立","正確完整","主動提醒"],
    desc:["清潔計劃表、廁所清潔紀錄表、溫度紀錄表、餐飲衛生自主管理檢查表、水質機器保養紀錄、物料茶量管理表。"]},
];

/* ========== 6. 計分規則 =========================================== */
const PASS = 70;                                   // 及格分
const LEVELS = ["未接觸","需協助","可獨立","熟練","精熟"];   // 預設等級（項目未自訂時）
const RATIO  = [0, 0.40, 0.75, 0.90, 1.00];        // 五級：全「可獨立」= 75 分
const RATIO3 = [0, 0.60, 1.00];                    // 三級項目專用
const labelsOf = it => it.lv || LEVELS;
const ratioOf  = it => labelsOf(it).length === 3 ? RATIO3 : RATIO;

// 依職位／是否學飲品，篩出本次要評的項目
function activeItems(job, drinkOn){
  return EVAL_ITEMS.filter(it => {
    if (it.ftOnly && job !== "FT") return false;   // 泡茶：正職才評
    if (it.optional && !drinkOn)   return false;   // 製作飲品：有學才評
    return true;
  });
}
// 有效配分：整數且加總 100
function effWeights(job, drinkOn){
  const act = activeItems(job, drinkOn);
  const sum = act.reduce((a,it)=>a+it.w, 0);
  const raw = act.map(it=>({key:it.key, v:it.w/sum*100}));
  const out = {}; let used = 0;
  raw.forEach(r=>{ out[r.key]=Math.floor(r.v); used+=out[r.key]; });
  raw.map(r=>({key:r.key, f:r.v-Math.floor(r.v)}))
     .sort((a,b)=>b.f-a.f).slice(0, 100-used)
     .forEach(r=> out[r.key]++);
  return out;
}
function score(levels, job, drinkOn){
  const w = effWeights(job, drinkOn);
  let earned = 0;
  activeItems(job, drinkOn).forEach(it=>{
    const lv = levels[it.key];
    if (lv != null) earned += ratioOf(it)[lv] * w[it.key];
  });
  return Math.round(earned);
}

/* ========== 7. 名冊樣本（USE_CLOUD=false 時使用） ================= */
const SAMPLE_PEOPLE = [
  {id:"CY002",name:"曾峪嫻",store:"一中店",job:"FT",join:new Date("2025-12-16"),drinkOn:false,passed:false,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP004",name:"劉洧洧",store:"一中店",job:"PT",join:new Date("2025-12-26"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP016",name:"林羿均",store:"一中店",job:"PT",join:new Date("2026-01-12"),drinkOn:false,passed:false,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CY016",name:"施盈君",store:"一中店",job:"FT",join:new Date("2026-01-19"),drinkOn:false,passed:false,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP011",name:"鄭凱文",store:"一中店",job:"PT",join:new Date("2026-01-26"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CY013",name:"賴思萱",store:"一中店",job:"FT",join:new Date("2026-03-01"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP024",name:"許潔妤",store:"一中店",job:"PT",join:new Date("2026-03-24"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CY014",name:"李澤如",store:"一中店",job:"FT",join:new Date("2026-03-28"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP034",name:"陳宜貞",store:"一中店",job:"PT",join:new Date("2026-04-21"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP035",name:"顏伊娃",store:"一中店",job:"PT",join:new Date("2026-04-23"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CY020",name:"林鈺埕",store:"一中店",job:"FT",join:new Date("2026-05-25"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CY010",name:"樊庭縥",store:"一中店",job:"FT",join:new Date("2025-12-29"),drinkOn:false,passed:true,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0098",name:"吳沛瑜",store:"光華店",job:"PT",join:new Date("2026-02-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0099",name:"劉禾銨",store:"光華店",job:"PT",join:new Date("2026-02-03"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0110",name:"楊婷筑",store:"光華店",job:"PT",join:new Date("2026-03-16"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0065",name:"蔡毅霖",store:"光華店",job:"PT",join:new Date("2026-05-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0066",name:"劉盈媗",store:"光華店",job:"PT",join:new Date("2026-05-04"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0134",name:"楊蕙鴻",store:"光華店",job:"PT",join:new Date("2026-05-25"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0139",name:"周慧",store:"光華店",job:"PT",join:new Date("2026-06-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0149",name:"簡榕妤",store:"光華店",job:"FT",join:new Date("2026-06-08"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0154",name:"蔡宸睿",store:"光華店",job:"PT",join:new Date("2026-06-17"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0169",name:"紀懿庭",store:"光華店",job:"PT",join:new Date("2026-07-03"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0176",name:"林煒絜",store:"光華店",job:"PT",join:new Date("2026-07-09"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0179",name:"陳奕安",store:"光華店",job:"PT",join:new Date("2026-07-14"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0181",name:"陳儷心",store:"光華店",job:"PT",join:new Date("2026-07-15"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CY0026",name:"陳欣",store:"光華店",job:"FT",join:new Date("2025-04-18"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0058",name:"古雅筑",store:"光華店",job:"FT",join:new Date("2025-09-15"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0119",name:"楊佳臻",store:"內湖店",job:"PT",join:new Date("2026-04-08"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0120",name:"邱品翰",store:"內湖店",job:"PT",join:new Date("2026-04-09"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0153",name:"林誼婕",store:"內湖店",job:"PT",join:new Date("2026-06-16"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0163",name:"李秉縈",store:"內湖店",job:"PT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0165",name:"鄭淳羽",store:"內湖店",job:"PT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0170",name:"李佳恩",store:"內湖店",job:"PT",join:new Date("2026-07-04"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CY0013",name:"郭家忻",store:"內湖店",job:"FT",join:new Date("2024-06-01"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0046",name:"楊景翔",store:"內湖店",job:"PT",join:new Date("2025-07-01"),drinkOn:false,passed:true,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CY0033",name:"周祖安",store:"內湖店",job:"FT",join:new Date("2025-07-28"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0036",name:"陳欣慧",store:"內湖店",job:"FT",join:new Date("2025-08-01"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0062",name:"蕭承昀",store:"內湖店",job:"PT",join:new Date("2025-08-16"),drinkOn:false,passed:true,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0072",name:"彭銘琛",store:"內湖店",job:"PT",join:new Date("2025-09-15"),drinkOn:false,passed:true,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0047",name:"陳泰宇",store:"內湖店",job:"FT",join:new Date("2025-11-14"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0084",name:"何芷嫻",store:"台北車站店",job:"PT",join:new Date("2025-11-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0052",name:"廖珮玲",store:"台北車站店",job:"FT",join:new Date("2026-02-01"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0097",name:"周羚榕",store:"台北車站店",job:"PT",join:new Date("2026-02-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0111",name:"吳欣宸",store:"台北車站店",job:"PT",join:new Date("2026-03-24"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0127",name:"黃琦恩",store:"台北車站店",job:"PT",join:new Date("2026-05-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0131",name:"林湘庭",store:"台北車站店",job:"PT",join:new Date("2026-05-15"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0135",name:"夏晨嘉",store:"台北車站店",job:"PT",join:new Date("2026-05-26"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0147",name:"廖怡涵",store:"台北車站店",job:"PT",join:new Date("2026-06-08"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0158",name:"葉芯彤",store:"台北車站店",job:"PT",join:new Date("2026-06-22"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0159",name:"劉宜瑋",store:"台北車站店",job:"PT",join:new Date("2026-06-24"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0161",name:"黃思語",store:"台北車站店",job:"PT",join:new Date("2026-06-27"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0162",name:"賴采妤",store:"台北車站店",job:"PT",join:new Date("2026-06-29"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0011",name:"許鳴顯",store:"台北車站店",job:"FT",join:new Date("2023-09-01"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0060",name:"林沅翰",store:"大安店",job:"FT",join:new Date("2026-03-01"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0108",name:"楊子萱",store:"大安店",job:"PT",join:new Date("2026-03-15"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0114",name:"林育任",store:"大安店",job:"PT",join:new Date("2026-04-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0122",name:"王若庭",store:"大安店",job:"PT",join:new Date("2026-04-20"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0123",name:"沈欣怡",store:"大安店",job:"FT",join:new Date("2026-04-22"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0124",name:"李佳芸",store:"大安店",job:"PT",join:new Date("2026-05-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0125",name:"周子禾",store:"大安店",job:"PT",join:new Date("2026-05-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0136",name:"鄭翊綸",store:"大安店",job:"PT",join:new Date("2026-06-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0155",name:"杜盈瑩",store:"大安店",job:"PT",join:new Date("2026-06-19"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0167",name:"顏秉宏",store:"大安店",job:"PT",join:new Date("2026-07-02"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0183",name:"蘇靖婷",store:"大安店",job:"PT",join:new Date("2026-07-16"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CY0044",name:"陳德州",store:"大安店",job:"FT",join:new Date("2025-03-15"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0061",name:"謝和均",store:"小巨蛋店",job:"FT",join:new Date("2026-03-16"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0132",name:"張潔雯",store:"小巨蛋店",job:"PT",join:new Date("2026-05-19"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0144",name:"余嘉恩",store:"小巨蛋店",job:"PT",join:new Date("2026-06-03"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0148",name:"林家祥",store:"小巨蛋店",job:"PT",join:new Date("2026-06-09"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0152",name:"曾咨語",store:"小巨蛋店",job:"PT",join:new Date("2026-06-15"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0160",name:"許又晨",store:"小巨蛋店",job:"PT",join:new Date("2026-06-27"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0076",name:"徐韻涵",store:"小巨蛋店",job:"FT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0164",name:"許晴雯",store:"小巨蛋店",job:"PT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0013",name:"曾毓庭",store:"小巨蛋店",job:"FT",join:new Date("2024-06-30"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0024",name:"劉亭妤",store:"小巨蛋店",job:"FT",join:new Date("2025-03-01"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0032",name:"陳宥錚",store:"小巨蛋店",job:"PT",join:new Date("2025-04-21"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0043",name:"陳美蓉",store:"小巨蛋店",job:"PT",join:new Date("2025-07-01"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0044",name:"洪欣妤",store:"小巨蛋店",job:"PT",join:new Date("2025-07-01"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0083",name:"李孟瑾",store:"師大店",job:"PT",join:new Date("2025-11-12"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0115",name:"陳建安",store:"師大店",job:"PT",join:new Date("2026-04-01"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0116",name:"陳彥伶",store:"師大店",job:"PT",join:new Date("2026-04-01"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0117",name:"孟軒如",store:"師大店",job:"PT",join:new Date("2026-04-09"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0069",name:"魏世珈",store:"師大店",job:"PT",join:new Date("2026-05-23"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0016",name:"鄭采茹",store:"師大店",job:"FT",join:new Date("2024-07-28"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0023",name:"林律綺",store:"師大店",job:"FT",join:new Date("2025-02-01"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0028",name:"林星潓",store:"師大店",job:"PT",join:new Date("2025-03-08"),drinkOn:false,passed:true,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0034",name:"林雨潓",store:"師大店",job:"PT",join:new Date("2025-05-03"),drinkOn:false,passed:true,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0067",name:"房靈希",store:"師大店",job:"PT",join:new Date("2025-09-04"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0049",name:"張林珊",store:"師大店",job:"FT",join:new Date("2025-12-24"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0088",name:"吳芸嬪",store:"忠孝店",job:"PT",join:new Date("2025-12-11"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0093",name:"魏孜穎",store:"忠孝店",job:"PT",join:new Date("2026-02-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0140",name:"吳姍妃",store:"忠孝店",job:"PT",join:new Date("2026-06-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0175",name:"梁姵奇",store:"忠孝店",job:"PT",join:new Date("2026-07-09"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CY0010",name:"葉思敏",store:"忠孝店",job:"PT",join:new Date("2023-02-10"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0012",name:"潘麒鈞",store:"忠孝店",job:"FT",join:new Date("2024-03-01"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0057",name:"游秉洋",store:"忠孝店",job:"FT",join:new Date("2025-03-10"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0034",name:"洪恩",store:"忠孝店",job:"FT",join:new Date("2025-07-11"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0035",name:"陳宏瑋",store:"忠孝店",job:"FT",join:new Date("2025-07-11"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0058",name:"劉珮嫻",store:"忠孝店",job:"PT",join:new Date("2025-08-01"),drinkOn:false,passed:true,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0074",name:"周姍儒",store:"忠孝店",job:"PT",join:new Date("2025-09-13"),drinkOn:false,passed:true,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0073",name:"林晏羽",store:"忠孝店",job:"PT",join:new Date("2025-09-15"),drinkOn:false,passed:true,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0091",name:"楊廷云",store:"松江店",job:"PT",join:new Date("2026-01-02"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0063",name:"陳緣廷",store:"松江店",job:"FT",join:new Date("2026-04-01"),drinkOn:false,passed:false,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0129",name:"邱厚榮",store:"松江店",job:"PT",join:new Date("2026-05-04"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0142",name:"林佳萱",store:"松江店",job:"PT",join:new Date("2026-06-02"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0146",name:"簡立晴",store:"松江店",job:"PT",join:new Date("2026-06-06"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0077",name:"劉俊宏",store:"松江店",job:"FT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0166",name:"黃偉傑",store:"松江店",job:"PT",join:new Date("2026-07-02"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CY0078",name:"粘芸溶",store:"松江店",job:"FT",join:new Date("2026-07-05"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0079",name:"鄧清鴻",store:"松江店",job:"FT",join:new Date("2026-07-06"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0171",name:"陳濬宏",store:"松江店",job:"PT",join:new Date("2026-07-06"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0173",name:"張耆銨",store:"松江店",job:"PT",join:new Date("2026-07-06"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0174",name:"童梓洋",store:"松江店",job:"PT",join:new Date("2026-07-08"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0178",name:"吳宥詰",store:"松江店",job:"PT",join:new Date("2026-07-12"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0186",name:"林慧嫺",store:"松江店",job:"PT",join:new Date("2026-07-18"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0187",name:"王翔永",store:"松江店",job:"PT",join:new Date("2026-07-20"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0188",name:"鄧普兒",store:"松江店",job:"PT",join:new Date("2026-07-22"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0031",name:"李姿慧",store:"松江店",job:"FT",join:new Date("2025-05-11"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0069",name:"劉允哲",store:"松江店",job:"FT",join:new Date("2025-07-01"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0037",name:"葉姿妤",store:"松江店",job:"FT",join:new Date("2025-08-08"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0039",name:"陳欣雅",store:"松江店",job:"FT",join:new Date("2025-08-27"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0056",name:"黃鼎閣",store:"松江店",job:"PT",join:new Date("2025-12-02"),drinkOn:false,passed:true,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0018",name:"魏語緗",store:"板橋店",job:"PT",join:new Date("2024-08-07"),drinkOn:false,passed:true,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0022",name:"曾耀正",store:"板橋店",job:"FT",join:new Date("2024-09-16"),drinkOn:false,passed:true,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0049",name:"楊晴安",store:"板橋店",job:"PT",join:new Date("2025-07-09"),drinkOn:false,passed:true,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CY0017",name:"劉又瑄",store:"板橋店",job:"FT",join:new Date("2024-09-16"),drinkOn:false,passed:true,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CY001",name:"魏妘卉",store:"逢甲店",job:"FT",join:new Date("2025-12-16"),drinkOn:false,passed:false,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP008",name:"吳羽軒",store:"逢甲店",job:"PT",join:new Date("2025-12-29"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP009",name:"黃冠庭",store:"逢甲店",job:"PT",join:new Date("2026-01-11"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP010",name:"黃金鳳",store:"逢甲店",job:"PT",join:new Date("2026-01-15"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP012",name:"樊宜婷",store:"逢甲店",job:"PT",join:new Date("2026-01-29"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP013",name:"陳佩靖",store:"逢甲店",job:"PT",join:new Date("2026-02-01"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP019",name:"陳俞聿",store:"逢甲店",job:"PT",join:new Date("2026-03-02"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CY015",name:"馮繼嫻",store:"逢甲店",job:"FT",join:new Date("2026-03-06"),drinkOn:false,passed:false,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CYP030",name:"孫郁閔",store:"逢甲店",job:"PT",join:new Date("2026-04-02"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP033",name:"曹瑜真",store:"逢甲店",job:"PT",join:new Date("2026-04-13"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP036",name:"劉俞廷",store:"逢甲店",job:"PT",join:new Date("2026-04-24"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP041",name:"蕭承祥",store:"逢甲店",job:"PT",join:new Date("2026-05-09"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP043",name:"盧盈蓁",store:"逢甲店",job:"PT",join:new Date("2026-05-20"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP044",name:"詹雅鈞",store:"逢甲店",job:"PT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP007",name:"李孟瑾",store:"逢甲店",job:"PT",join:new Date("2026-07-02"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:false,ld:false},eval:null},
  {id:"CYP045",name:"賴彥君",store:"逢甲店",job:"PT",join:new Date("2026-07-06"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CY022",name:"潘怡君",store:"逢甲店",job:"FT",join:new Date("2026-07-15"),drinkOn:false,passed:false,chk:{hb:false,jk:false,cz:true,ld:false},eval:null},
  {id:"CY003",name:"謝婷楓",store:"逢甲店",job:"FT",join:new Date("2025-12-16"),drinkOn:false,passed:true,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CY004",name:"楊守仁",store:"逢甲店",job:"FT",join:new Date("2025-12-16"),drinkOn:false,passed:true,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CY005",name:"張欣恩",store:"逢甲店",job:"FT",join:new Date("2026-01-01"),drinkOn:false,passed:true,chk:{hb:false,jk:true,cz:true,ld:false},eval:null},
  {id:"CY0062",name:"蕭品純",store:"頂溪店",job:"FT",join:new Date("2026-03-17"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CYP0128",name:"陳以洵",store:"頂溪店",job:"PT",join:new Date("2026-05-02"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0138",name:"賴怡頴",store:"頂溪店",job:"PT",join:new Date("2026-06-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0143",name:"莊淑涵",store:"頂溪店",job:"PT",join:new Date("2026-06-02"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0150",name:"林子熙",store:"頂溪店",job:"PT",join:new Date("2026-06-13"),drinkOn:false,passed:false,chk:{hb:"na",jk:true,cz:true,ld:false},eval:null},
  {id:"CY0072",name:"鍾沛瀅",store:"頂溪店",job:"FT",join:new Date("2026-06-15"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0073",name:"吳珮語",store:"頂溪店",job:"FT",join:new Date("2026-06-22"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CY0074",name:"黃濬宇",store:"頂溪店",job:"FT",join:new Date("2026-06-23"),drinkOn:false,passed:false,chk:{hb:true,jk:false,cz:true,ld:false},eval:null},
  {id:"CYP0168",name:"周祐民",store:"頂溪店",job:"PT",join:new Date("2026-07-01"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0172",name:"陳睿峰",store:"頂溪店",job:"PT",join:new Date("2026-07-06"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CYP0184",name:"黃歆倫",store:"頂溪店",job:"PT",join:new Date("2026-07-18"),drinkOn:false,passed:false,chk:{hb:"na",jk:false,cz:false,ld:false},eval:null},
  {id:"CY0004",name:"吳春音",store:"頂溪店",job:"FT",join:new Date("2020-10-01"),drinkOn:false,passed:true,chk:{hb:true,jk:true,cz:true,ld:false},eval:null}
];

/* ========== 9. 技能評核共用資料（與 skills.html 共用，單一來源） ========== */
const SKILLS = (function(){
const SKILL_GROUPS = {
  foh:    {label:'前場服務', short:'前場', color:'#E8832A', bg:'rgba(232,131,42,.06)',  border:'rgba(232,131,42,.3)',  skills:['order','intro','delivery','complaint','tidying','closing']},
  drinks: {label:'飲品製作', short:'飲品', color:'#2E6FD8', bg:'rgba(46,111,216,.06)',  border:'rgba(46,111,216,.3)',  skills:['labeling','machine','drink','milktea','workstation']},
  boh:    {label:'後場備料', short:'後場', color:'#16A76A', bg:'rgba(22,167,106,.06)',  border:'rgba(22,167,106,.3)',  skills:['brewing','ingredient','foodsafe']},
  smt:    {label:'SMT 進階', short:'SMT',  color:'#7C5CD3', bg:'rgba(124,92,211,.06)',  border:'rgba(124,92,211,.3)',  skills:['frontline','inventory','ordering','crisis','review','supervision','producttest']},
  sm:     {label:'SM 店長',  short:'SM',   color:'#D94040', bg:'rgba(217,64,64,.06)',   border:'rgba(217,64,64,.3)',   skills:['training','staffmgmt','finance','recruiting','hr','sched','sysop']}
};
const SKILL_LABELS = {
  order:'點餐',intro:'介紹',delivery:'外送',complaint:'客訴',tidying:'佈置打掃',closing:'收班結帳',
  labeling:'貼標分類',machine:'智能機',drink:'果茶製作',milktea:'純(奶)茶製作',workstation:'工作站清潔',
  brewing:'煮茶作業',ingredient:'配料製作',foodsafe:'食品安全',
  frontline:'前場應變',inventory:'庫存管理',ordering:'盤點下單',crisis:'危機管理',review:'評論回覆',supervision:'督導稽核',producttest:'飲品/物料測試',
  training:'新人訓練',staffmgmt:'員工管理',finance:'財務表',recruiting:'招募面試',hr:'人事作業',sched:'人力排班',sysop:'系統權限'
};
const SKILL_ICONS = {
  order:'📋',intro:'💬',delivery:'🛵',complaint:'🙇',tidying:'🧹',closing:'🧾',
  labeling:'🏷️',machine:'🤖',drink:'🧋',milktea:'🥛',workstation:'✨',
  brewing:'🫖',ingredient:'🥣',foodsafe:'🛡️',
  frontline:'⚡',inventory:'📦',ordering:'📝',crisis:'⚠️',review:'⭐',supervision:'🔍',producttest:'🧪',
  training:'🎓',staffmgmt:'👥',finance:'💰',recruiting:'🎯',hr:'📊',sched:'📅',sysop:'🔧'
};
const ONBOARD_TO_SKILL = {
  counter:  ['order', 'closing'],      // 櫃檯點餐與收銀操作 → 點餐＋收班結帳
  product:  ['intro'],                 // 產品知識 → 介紹
  delivery: ['delivery'],              // 外送 → 外送
  complaint:['complaint'],             // 客訴處理 → 客訴
  drinkmix: ['drink', 'milktea'],      // 製作飲品 → 果茶製作＋純(奶)茶製作
  drink:    ['machine'],               // 飲品製作效率 → 智能機
  prep:     ['ingredient'],            // 備料 → 配料製作
  tea:      ['brewing'],               // 泡茶 → 煮茶作業
  safety:   ['foodsafe'],              // 安全操作 → 食品安全
  clean:    ['workstation']            // 設備清潔與維護 → 工作站清潔
  // 服儀確認/服務態度/服務三用語/品質確保/門店表單 → SM 無對應，不帶入
};
const ONBOARD_LEVEL_TO_SM = ['rusty', 'basic', 'normal', 'skilled', 'expert'];
const EVALUABLE_STORES = ['小巨蛋店','師大店','松江店','忠孝店','內湖店','台北車站店','大安店','光華店','民權店','板橋店','頂溪店','一中店','逢甲店'];
const EMPLOYEES = [
  // 小巨蛋店
  {id:'CY0024',name:'劉亭妤',store:'小巨蛋店',role:'店經理'},
  {id:'CY0057',name:'游秉洋',store:'忠孝店',role:'正職門店人員'}, // 7/1 由小巨蛋轉入
  {id:'CY0061',name:'謝和均',store:'小巨蛋店',role:'正職門店人員'},
  {id:'CYP0013',name:'曾毓庭',store:'小巨蛋店',role:'儲備店經理'}, // 修正:雲端為儲備店經理
  // 陳宥錚 CYP0032 已離職 2026/07/25
  {id:'CYP0043',name:'陳美蓉',store:'小巨蛋店',role:'兼職人員'},
  {id:'CYP0044',name:'洪欣妤',store:'小巨蛋店',role:'兼職人員'},
  {id:'CYP0132',name:'張潔雯',store:'小巨蛋店',role:'兼職人員'},
  {id:'CYP0144',name:'余嘉恩',store:'小巨蛋店',role:'兼職人員'},
  {id:'CYP0148',name:'林家祥',store:'小巨蛋店',role:'兼職人員'},
  // 曾咨語 CYP0152 已離職 2026/07/25
  {id:'LWZ01',name:'林威佐',store:'小巨蛋店',role:'兼職人員'}, // 大表已清空到職日
  {id:'CYP0164',name:'許晴雯',store:'小巨蛋店',role:'兼職人員'}, // 7/1 入職
  {id:'CY0076',name:'徐韻涵',store:'小巨蛋店',role:'正職門店人員'}, // 7/1 到職
  // 唐嘉薇 CY0075 已離職 7/13
  {id:'CYP0160',name:'許又晨',store:'小巨蛋店',role:'兼職人員'}, // 6/27 工號分配

  // 師大店
  {id:'CY0016',name:'鄭采茹',store:'師大店',role:'正職門店人員'},
  {id:'CY0023',name:'林律綺',store:'師大店',role:'店經理'},
  {id:'CY0049',name:'張林珊',store:'師大店',role:'儲備店經理'},
  {id:'CY0069',name:'魏世珈',store:'師大店',role:'兼職人員'},
  // 謝宸洧 CY0068 已離職 6/29
  {id:'CYP0028',name:'林星潓',store:'師大店',role:'兼職人員'},
  {id:'CYP0034',name:'林雨潓',store:'師大店',role:'兼職人員'},
  // 吳如芸 CYP0039 已離職 6/30
  {id:'CYP0067',name:'房靈希',store:'師大店',role:'兼職人員'},
  {id:'CYP0083',name:'李孟瑾',store:'師大店',role:'兼職人員'},
  {id:'CYP0115',name:'陳建安',store:'師大店',role:'兼職人員'},
  {id:'CYP0116',name:'陳彥伶',store:'師大店',role:'兼職人員'},
  {id:'CYP0117',name:'孟軒如',store:'師大店',role:'兼職人員'},

  // 松江店
  // 黃旻渝 CY0025 已離職 6/25
  {id:'CY0031',name:'李姿慧',store:'松江店',role:'店經理'},
  {id:'CY0037',name:'葉姿妤',store:'松江店',role:'正職門店人員'},
  {id:'CY0039',name:'陳欣雅',store:'留停松江',role:'正職門店人員'}, // 留停至7/31
  {id:'CY0063',name:'陳緣廷',store:'松江店',role:'儲備店經理'}, // 修正:雲端為儲備店經理
  {id:'CYP0069',name:'劉允哲',store:'松江店',role:'儲備店經理'}, // 修正:雲端店別為松江(原小巨蛋)、儲備店經理
  {id:'CYP0056',name:'黃鼎閣',store:'松江店',role:'兼職人員'},
  {id:'CYP0174',name:'童梓洋',store:'松江店',role:'兼職人員'}, // 7/8 到職,新加入
  {id:'CYP0091',name:'楊廷云',store:'松江店',role:'兼職人員'},
  // 王歆語 CYP0112 已離職 6/27
  {id:'CYP0129',name:'邱厚榮',store:'松江店',role:'兼職人員'},
  {id:'CYP0142',name:'林佳萱',store:'松江店',role:'兼職人員'},
  {id:'CYP0146',name:'簡立晴',store:'松江店',role:'兼職人員'},
  // 高萱芸 CYP0151 已離職 6/15
  {id:'CY0077',name:'劉俊宏',store:'松江店',role:'正職門店人員'}, // 7/1 入職
  {id:'CY0078',name:'粘芸溶',store:'松江店',role:'正職門店人員'}, // 7/22 雲端發正式工號(原JYJ01)
  {id:'CYP0166',name:'黃偉傑',store:'松江店',role:'兼職人員'}, // 7月新進,7/22 雲端發正式工號(原HWJ01)
  {id:'CY0079',name:'鄧清鴻',store:'松江店',role:'正職門店人員'}, // 7月新進,8月去民權,7/22 雲端發正式工號(原DCH01)
  {id:'CY0080',name:'王凱為',store:'松江店',role:'正職門店人員'}, // 7/27到職,8月去民權
  {id:'CYP0171',name:'陳濬宏',store:'松江店',role:'兼職人員'}, // 7月新進,7/22 雲端發正式工號(原CJH01)
  {id:'CYP0173',name:'張耆銨',store:'松江店',role:'兼職人員'}, // 7月新進,7/22 雲端發正式工號(原CQA01)
  {id:'CYP0178',name:'吳宥詰',store:'松江店',role:'兼職人員'}, // 7/12 到職,新加入
  // 王韋欽 WWQ01/CYP0177 已離職 7/18(曠職)
  {id:'CYP0170',name:'李佳恩',store:'內湖店',role:'兼職人員'}, // 7月新進,7/22 雲端發正式工號(原LJE01)
  {id:'CYP0181',name:'陳儷心',store:'光華店',role:'兼職人員'}, // 原CLX01(臨時id),雲端發正式工號CYP0181

  // 忠孝店
  {id:'CY0004',name:'吳春音',store:'頂溪店',role:'儲備店經理'}, // 7月編制歸頂溪,人在忠孝
  {id:'CY0010',name:'葉思敏',store:'忠孝店',role:'兼職人員'},
  {id:'CY0012',name:'潘麒鈞',store:'忠孝店',role:'店經理'},
  {id:'CY0034',name:'洪恩',store:'忠孝店',role:'正職門店人員'},
  {id:'CY0035',name:'陳宏瑋',store:'忠孝店',role:'儲備店經理'}, // 修正:雲端為忠孝店
  // 李睿憲 CY0071 已離職 6/24
  {id:'CYP0058',name:'劉珮嫻',store:'忠孝店',role:'兼職人員'},
  {id:'CYP0073',name:'林晏羽',store:'忠孝店',role:'兼職人員'},
  {id:'CYP0074',name:'周姍儒',store:'忠孝店',role:'兼職人員'},
  // 陳映伃 CYP0085 已離職 6/30
  {id:'CYP0088',name:'吳芸嬪',store:'忠孝店',role:'兼職人員'},
  {id:'CYP0093',name:'魏孜穎',store:'忠孝店',role:'兼職人員'},
  // 賈佳旻 CYP0096 已離職 6/30
  {id:'CYP0140',name:'吳姍妃',store:'忠孝店',role:'兼職人員'},
  {id:'CYP0175',name:'梁姵奇',store:'忠孝店',role:'兼職人員'}, // 7/9 到職,新加入

  // 內湖店
  {id:'CY0013',name:'郭家忻',store:'內湖店',role:'店經理'},
  {id:'CY0033',name:'周祖安',store:'內湖店',role:'正職門店人員'},
  {id:'CY0036',name:'陳欣慧',store:'內湖店',role:'儲備店經理'},
  {id:'CY0047',name:'陳泰宇',store:'內湖店',role:'儲備店經理'},
  // 方淇銘 CY0067 已離職 6/30
  {id:'CYP0046',name:'楊景翔',store:'內湖店',role:'兼職人員'},
  {id:'CYP0062',name:'蕭承昀',store:'內湖店',role:'兼職人員'},
  {id:'CYP0072',name:'彭銘琛',store:'內湖店',role:'兼職人員'},
  {id:'CYP0119',name:'楊佳臻',store:'內湖店',role:'兼職人員'},
  {id:'CYP0120',name:'邱品翰',store:'內湖店',role:'兼職人員'},
  {id:'CYP0153',name:'林誼婕',store:'內湖店',role:'兼職人員'},
  // 鄭浩志 CYP0156 已離職 6/29
  {id:'CYP0165',name:'鄭淳羽',store:'內湖店',role:'兼職人員'}, // 7/1 入職
  {id:'CYP0163',name:'李秉縈',store:'內湖店',role:'兼職人員'}, // 7/1 入職

  // 大安店
  {id:'CY0044',name:'陳德州',store:'大安店',role:'店經理'},
  {id:'CY0060',name:'林沅翰',store:'大安店',role:'儲備店經理'}, // 修正:雲端為儲備店經理
  // 廖品瑄 CY0070 已離職 6/23
  {id:'CYP0108',name:'楊子萱',store:'大安店',role:'兼職人員'},
  {id:'CYP0114',name:'林育任',store:'大安店',role:'兼職人員'},
  {id:'CYP0122',name:'王若庭',store:'大安店',role:'兼職人員'},
  {id:'CYP0123',name:'沈欣怡',store:'大安店',role:'正職門店人員'}, // 7/1 轉正
  {id:'CYP0124',name:'李佳芸',store:'大安店',role:'兼職人員'},
  {id:'CYP0125',name:'周子禾',store:'大安店',role:'兼職人員'}, // 由小巨蛋轉
  {id:'CYP0128',name:'陳以洵',store:'頂溪店',role:'兼職人員'}, // 7月編制歸頂溪,人在大安
  {id:'CYP0136',name:'鄭翊綸',store:'大安店',role:'兼職人員'},
  // 范台燕 CYP0137 已離職 6/14
  {id:'CYP0138',name:'賴怡頴',store:'頂溪店',role:'兼職人員'}, // 7月編制歸頂溪,人在大安
  {id:'CYP0143',name:'莊淑涵',store:'頂溪店',role:'兼職人員'}, // 7月編制歸頂溪,人在大安
  {id:'CYP0155',name:'杜盈瑩',store:'大安店',role:'兼職人員'},
  {id:'CYP0167',name:'顏秉宏',store:'大安店',role:'兼職人員'}, // 7/2 到職,新加入
  // 曾楚雯 CYP0157 已離職 6/24

  // 光華店
  {id:'CY0026',name:'陳欣',store:'光華店',role:'店經理'},
  {id:'CY0058',name:'古雅筑',store:'光華店',role:'儲備店經理'},
  {id:'CY0065',name:'蔡毅霖',store:'光華店',role:'兼職人員'},
  {id:'CY0066',name:'劉盈媗',store:'光華店',role:'兼職人員'},
  {id:'CYP0098',name:'吳沛瑜',store:'光華店',role:'兼職人員'},
  // 劉禾銨 CYP0099 已離職 7/9
  {id:'CYP0110',name:'楊婷筑',store:'光華店',role:'兼職人員'},
  // 楊蕙鴻 CYP0134 已離職 7/25
  {id:'CYP0139',name:'周慧',store:'光華店',role:'兼職人員'},
  {id:'CYP0149',name:'簡榕妤',store:'光華店',role:'正職門店人員'}, // 8月後再轉頂溪
  {id:'CYP0150',name:'林子熙',store:'頂溪店',role:'兼職人員'}, // 7/1 回頂溪
  {id:'CYP0154',name:'蔡宸睿',store:'光華店',role:'兼職人員'},
  {id:'CYP0169',name:'紀懿庭',store:'光華店',role:'兼職人員'}, // 光華新增,7/22 雲端發正式工號(原CYK01)
  {id:'CYP0176',name:'林煒絜',store:'光華店',role:'兼職人員'}, // 7/9 到職,新加入
  {id:'CYP0179',name:'陳奕安',store:'光華店',role:'兼職人員'}, // 7/14 到職,新加入

  // 台北車站店
  {id:'CY0011',name:'許鳴顯',store:'台北車站店',role:'店經理'},
  {id:'CY0052',name:'廖珮玲',store:'台北車站店',role:'正職門店人員'},
  {id:'CY0062',name:'蕭品純',store:'頂溪店',role:'正職門店人員'}, // 7月編制歸頂溪
  {id:'CYP0084',name:'何芷嫻',store:'台北車站店',role:'兼職人員'},
  {id:'CYP0097',name:'周羚榕',store:'台北車站店',role:'兼職人員'},
  {id:'CYP0111',name:'吳欣宸',store:'台北車站店',role:'兼職人員'},
  // 林筱蝶 CYP0126 已離職 7/22
  {id:'CYP0127',name:'黃琦恩',store:'台北車站店',role:'兼職人員'},
  {id:'CYP0131',name:'林湘庭',store:'台北車站店',role:'兼職人員'},
  {id:'CYP0135',name:'夏晨嘉',store:'台北車站店',role:'兼職人員'},
  {id:'CYP0147',name:'廖怡涵',store:'台北車站店',role:'兼職人員'},
  {id:'CYP0158',name:'葉芯彤',store:'台北車站店',role:'兼職人員'}, // 7/22 雲端發正式工號(原YX01)
  {id:'CYP0159',name:'劉宜瑋',store:'台北車站店',role:'兼職人員'}, // 6/24 工號 CYP0159
  {id:'CYP0161',name:'黃思語',store:'台北車站店',role:'兼職人員'}, // 6/27 入職,未滿18
  {id:'CYP0162',name:'賴采妤',store:'台北車站店',role:'兼職人員'}, // 7/22 雲端發正式工號(原LCY01)

  // 板橋店 (BQ前綴為加盟店員工臨時ID,與戰情室同步以姓名配對)
  {id:'CY0022',name:'曾耀正',store:'板橋店',role:'店經理'},
  {id:'CY0017',name:'劉又瑄',store:'病假板橋',role:'儲備店經理'},
  {id:'CYP0018',name:'魏語緗',store:'板橋店',role:'兼職人員'},
  {id:'CYP0049',name:'楊晴安',store:'板橋店',role:'兼職人員'},
  {id:'BQ001',name:'唐卉妤',store:'板橋店',role:'正職門店人員'},
  {id:'BQ002',name:'陳智勝',store:'板橋店',role:'正職門店人員'},
  {id:'BQ003',name:'陳韻如',store:'板橋店',role:'儲備店經理'},
  {id:'BQ004',name:'林彥均',store:'板橋店',role:'兼職人員'},
  {id:'BQ005',name:'徐婕芸',store:'板橋店',role:'兼職人員'},
  {id:'BQ006',name:'童欣妮',store:'板橋店',role:'兼職人員'},
  {id:'BQ007',name:'董庭諭',store:'板橋店',role:'兼職人員'},
  {id:'BQ008',name:'張芷瑜',store:'板橋店',role:'兼職人員'},
  {id:'BQ009',name:'陳心羽',store:'板橋店',role:'兼職人員'},
  {id:'BQ010',name:'李宥縈',store:'板橋店',role:'兼職人員'},
  {id:'BQ011',name:'黃怡慧',store:'板橋店',role:'兼職人員'},
  {id:'BQ012',name:'黃詣烜',store:'板橋店',role:'兼職人員'},
  {id:'BQ013',name:'莊美欣',store:'板橋店',role:'兼職人員'},
  {id:'BQ014',name:'戚中芸',store:'板橋店',role:'兼職人員'},

  // 逢甲店
  {id:'CY001',name:'魏妘卉',store:'逢甲店',role:'店經理'},
  {id:'CY003',name:'謝婷楓',store:'逢甲店',role:'儲備店經理'},
  {id:'CY004',name:'楊守仁',store:'逢甲店',role:'儲備店經理'},
  {id:'CY015',name:'馮繼嫻',store:'逢甲店',role:'正職門店人員'},
  {id:'CYP008',name:'吳羽軒',store:'逢甲店',role:'兼職人員'},
  {id:'CYP009',name:'黃冠庭',store:'逢甲店',role:'兼職人員'},
  {id:'CYP010',name:'黃金鳳',store:'逢甲店',role:'兼職人員'},
  {id:'CYP012',name:'樊宜婷',store:'逢甲店',role:'兼職人員'},
  {id:'CYP013F',name:'陳佩靖',store:'逢甲店',role:'兼職人員'},
  {id:'CYP019F',name:'陳俞聿',store:'逢甲店',role:'兼職人員'},
  {id:'CYP030',name:'孫郁閔',store:'逢甲店',role:'兼職人員'},
  {id:'CYP033',name:'曹瑜真',store:'逢甲店',role:'兼職人員'},
  {id:'CYP036',name:'劉俞廷',store:'逢甲店',role:'兼職人員'},
  {id:'FJ001',name:'蕭承祥',store:'逢甲店',role:'兼職人員'},
  {id:'FJ002',name:'張欣恩',store:'逢甲店',role:'正職門店人員'}, // 6月從一中調逢甲
  {id:'FJ003',name:'蔡侑衡',store:'逢甲店',role:'正職門店人員'},
  {id:'FJ004',name:'盧盈蓁',store:'逢甲店',role:'兼職人員'},

  // 一中店
  {id:'CY010',name:'樊庭縥',store:'一中店',role:'儲備店經理'}, // 6月從逢甲調一中
  {id:'YC001',name:'曾峪嫻',store:'一中店',role:'店經理'},
  {id:'YC002',name:'李澤如',store:'一中店',role:'正職門店人員'},
  {id:'YC003',name:'施盈君',store:'一中店',role:'正職門店人員'},
  {id:'YC004',name:'賴思萱',store:'一中店',role:'正職門店人員'},
  {id:'YC005',name:'林鈺埕',store:'一中店',role:'正職門店人員'},
  {id:'YC006',name:'鄭凱文',store:'一中店',role:'兼職人員'},
  {id:'YC007',name:'林羿均',store:'一中店',role:'兼職人員'},
  {id:'YC008',name:'許潔妤',store:'一中店',role:'兼職人員'},
  {id:'YC009',name:'劉洧洧',store:'一中店',role:'兼職人員'},
  {id:'YC010',name:'李億圓',store:'一中店',role:'兼職人員'},
  {id:'YC011',name:'陳宜貞',store:'一中店',role:'兼職人員'},
  {id:'YC012',name:'顏伊娃',store:'一中店',role:'兼職人員'},

  // 頂溪店 (新店, 6月開幕)
  {id:'CY0072',name:'鍾沛瀅',store:'頂溪店',role:'正職門店人員'}, // 7月編制頂溪,人在大安
  {id:'CYP0172',name:'陳睿峰',store:'頂溪店',role:'兼職人員'}, // 7/22 雲端發正式工號(原DX001)
  {id:'CYP0168',name:'周祐民',store:'頂溪店',role:'兼職人員'}, // 7/22 雲端發正式工號(原DX002)
  // 張功弦 DX003 已取消報到 — 移除
  {id:'CY0073',name:'吳珮語',store:'頂溪店',role:'正職門店人員'}, // 雲端發新工號
  {id:'CY0074',name:'黃濬宇',store:'頂溪店',role:'正職門店人員'} // 7月編制頂溪,人在大安
];
const LEVELS = {
  rusty:   {label:'未接觸', short:'未', color:'#C0392B', weight:0.0},
  basic:   {label:'需協助', short:'需', color:'#C88B00', weight:0.4},
  normal:  {label:'可獨立', short:'獨', color:'#2E6FD8', weight:0.75},
  skilled: {label:'熟練',   short:'熟', color:'#3E9A6A', weight:0.9},
  expert:  {label:'精熟',   short:'精', color:'#16A76A', weight:1.0}
};
const LEVEL_ORDER = ['rusty','basic','normal','skilled','expert'];
const SUPERVISOR_CODE = '9527';
const STORE_CODES = {
  '小巨蛋店':'twn001',
  '師大店':'twn003',
  '松江店':'twn005',
  '忠孝店':'twn007',
  '內湖店':'twn009',
  '板橋店':'twn0011',
  '逢甲店':'twn0013',
  '台北車站店':'twn0015',
  '一中店':'twn0017',
  '光華店':'twn0019',
  '大安店':'twn0021',
  '頂溪店':'twn0023'
};
  const ALL_SKILL_KEYS = Object.keys(SKILL_LABELS);
  return { GROUPS:SKILL_GROUPS, LABELS:SKILL_LABELS, ICONS:SKILL_ICONS,
    ONBOARD_TO_SKILL, ONBOARD_LEVEL_TO_SM, EVALUABLE_STORES, EMPLOYEES,
    LEVELS, LEVEL_ORDER, ALL_KEYS:ALL_SKILL_KEYS, STORE_CODES, SUPERVISOR_CODE };
})();

/* ========== 8. 雲端讀寫介面 (DataAPI) ============================
   所有頁面只透過這裡取／存資料。之後接雲端，只改這一段即可。
   ---------------------------------------------------------------
   雲端名冊(名冊分頁)預設欄位順序（可依你的實際表格調整 personFromRow）：
   對應「☆營運部管理大表」實際欄位（0 起算）：
     0 工號 | 1 姓名 | 2 到職日 | 3 所屬單位(門市) | 4 職稱
     5 健保 | 6 存摺 | 7 健檢 | 8 健檢日 | 9 勞動契約 | 10 組織文化課
     11 新人護照發放 | 12 新人護照考核(通過試用期)=新考 | 13 季緣人考核 | 14 推薦人 | 15 面試者
     16 新人自報(由系統從新表 join 進來，9碼0/1；顯示待核對)
   =============================================================== */
// 全形英數 → 半形（大表用 Ｖ／Ｘ／Ｏ 等全形字）
function normVX(v){ return String(v==null?"":v).trim().replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(c){ return String.fromCharCode(c.charCodeAt(0)-0xFEE0); }); }
// 一般欄位（存摺/健檢/契約）：V 開頭(含「V(中信)」)算已完成
function toBool(v){ const s=normVX(v).toLowerCase();
  if(s===""||s==="x"||s==="0"||s==="false"||s==="o") return false;
  if(s.indexOf("免")>=0||s==="na") return "na";
  return s.charAt(0)==="v"||s.indexOf("✓")>=0||s.indexOf("是")>=0||s==="y"||s==="1"||s==="true"; }
// 健保：Ｖ=投保(true)、Ｘ=免/不投保(na)、空=未處理(false)
function hbVal(v){ const s=normVX(v).toUpperCase(); if(s==="") return false; if(s.charAt(0)==="V") return true; if(s.charAt(0)==="X") return "na"; return false; }
// 新人護照考核（通過試用期）：V/日期=通過；空白、Ｏ、未、Ｘ=未通過
function isPass(v){ const s=normVX(v).toUpperCase(); if(s===""||s==="O"||/未|X|✗/.test(s)) return false; return true; }

// 雲端一列 → 人員物件（欄位對不上時來這裡改）
function personFromRow(r){
  return {
    id:   r[0]||"",
    name:(r[1]||"").trim(),
    join: r[2] ? new Date(r[2]) : new Date(),
    store:(r[3]||"").trim(),
    role: String(r[4]||"").trim(),   // 職稱（店經理/儲備店經理/正職門店人員/兼職人員…）
    job: (String(r[4]).indexOf("兼")>=0 || String(r[4]).toUpperCase()==="PT") ? "PT" : "FT",
    chk: { hb:hbVal(r[5]), cz:toBool(r[6]), jk:toBool(r[7]), ld:toBool(r[9]) },  // 健保/存摺/健檢/契約
    hbDate: (r[8]!=null?String(r[8]).trim():""),  // 健檢日（大表第 8 欄）
    passed: isPass(r[12]),          // 新人護照考核（通過試用期）
    selfReport: parseSelf(r[16]),   // 新人自報（系統從新表 join）
    ghp: (String(r[17]||"").trim()==="1"),  // GHP 宣導影片：店經理確認（雲端 GHP 分頁 join）
    drinkOn:false, eval:null,
  };
}
// K 欄自報：接受 "010100000" 或 JSON 陣列，回傳 9 格布林或 null
function parseSelf(v){
  if(v==null||v==="") return null;
  try{ const a=JSON.parse(v); if(Array.isArray(a)) return a.map(Boolean); }catch(e){}
  const s=String(v).trim();
  if(/^[01]{1,9}$/.test(s)){ const a=s.split("").map(c=>c==="1"); while(a.length<9)a.push(false); return a; }
  return null;
}

async function fetchRoster(){
  const j = await (await fetch(`${CONFIG.API_BASE}/roster`)).json();
  const rows = j.values || j.rows || j;
  return (rows||[]).map(personFromRow);
}

let _cache = null;
const DataAPI = {
  async getAll(force){
    if (!CONFIG.USE_CLOUD) return SAMPLE_PEOPLE;
    if (_cache && !force) return _cache;
    try { _cache = await fetchRoster(); } catch(e){ console.error("讀取雲端名冊失敗，改用樣本：", e); _cache = SAMPLE_PEOPLE; }
    return _cache;
  },
  async getRoster(store){ return (await this.getAll()).filter(p=>p.store===store); },
  async findPerson(name, store, job){
    const q=(name||"").trim();
    const all=await this.getAll();
    return all.find(p=>p.name===q && p.store===store && (!job || p.job===job))
        || all.find(p=>p.name===q && p.store===store) || null;
  },

  /* --- Checklist 狀態 --- */
  // 雲端大表為唯一準據，回傳 9 格：true / "na" / false
  cloudTicks(p){
    return CHECKLIST.ABBR.map((_,i)=> (i===0||i>=5) ? true
      : i===1 ? (p.chk.hb==="na"?"na":!!p.chk.hb)
      : i===2 ? !!p.chk.jk
      : i===3 ? !!p.chk.cz
      : i===4 ? !!p.chk.ld : false);
  },
  // 新人自報（「待核對」提示，不覆蓋雲端）
  // 優先用雲端 K 欄自報（跨裝置，HR/店經理看得到）；沒有才用本機
  selfTicks(p){
    if(Array.isArray(p.selfReport)) return p.selfReport;
    try{ const a=JSON.parse(localStorage.getItem(`chiyuan:chk:${p.store}:${p.name}`)||"null");
         return Array.isArray(a)?a.map(Boolean):null; }catch(e){ return null; }
  },
  // 新人在報到頁勾選時呼叫：存本機；接雲端後同時寫回 K 欄自報
  saveSelfTick(p, arr){
    try{ localStorage.setItem(`chiyuan:chk:${p.store}:${p.name}`, JSON.stringify(arr)); }catch(e){}
    if(CONFIG.USE_CLOUD){
      fetch(`${CONFIG.API_BASE}/checkin`, {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:p.id, store:p.store, name:p.name, self:arr})}).catch(err=>console.error("自報寫回雲端失敗：",err));
    }
  },
  // 合併：true / "na" / "self"(新人回報未登記) / false
  liveTicks(p){
    const c=this.cloudTicks(p), sf=this.selfTicks(p);
    return c.map((v,i)=> (v===true||v==="na") ? v : (sf&&sf[i] ? "self" : false));
  },
  doneCount(p){    return this.liveTicks(p).filter(v=>v===true||v==="na").length; },
  pendingCount(p){ return this.liveTicks(p).filter(v=>v==="self").length; },

  /* --- GHP 宣導影片（店經理確認新人已觀看） --- */
  ghpOf(p){ return !!(p && p.ghp); },
  saveGhp(p, done){
    if(p) p.ghp = !!done;
    if(CONFIG.USE_CLOUD){
      fetch(`${CONFIG.API_BASE}/ghp`, {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:p.id, store:p.store, name:p.name, done:!!done})}).catch(err=>console.error("GHP 寫回雲端失敗：",err));
    }
  },

  /* --- 考核紀錄（現存本機；接雲端寫入後改這裡） --- */
  loadEval(p){
    try{ const raw=localStorage.getItem(`chiyuan:eval:${p.store}:${p.name}`);
      if(!raw) return null;
      const e=JSON.parse(raw); e.date=new Date(e.date); if(e.updated) e.updated=new Date(e.updated);
      return e;
    }catch(e){ return null; }
  },
  saveEval(p, ev){
    const payload={ ...ev, drinkOn:p.drinkOn, job:p.job, store:p.store, name:p.name,
      sc:score(ev.levels,p.job,p.drinkOn), pass:score(ev.levels,p.job,p.drinkOn)>=PASS };
    try{ localStorage.setItem(`chiyuan:eval:${p.store}:${p.name}`, JSON.stringify(payload)); }catch(e){}
    if (CONFIG.USE_CLOUD){
      fetch(`${CONFIG.API_BASE}/eval`, {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)}).catch(err=>console.error("寫回雲端失敗：",err));
    }
  },
  clearEval(p){ try{ localStorage.removeItem(`chiyuan:eval:${p.store}:${p.name}`); }catch(e){} },

  /* --- 技能評核狀態（skills.html 寫入的 localStorage；接雲端後改讀 /api） --- */
  getSkillState(){
    try{ return JSON.parse(localStorage.getItem("skill_eval_v2")||"null"); }catch(e){ return null; }
  },
  // 某員工的技能覆蓋：done/總數、加權分、百分比（分母=實際技能數 27）
  skillCoverage(empId){
    const st=this.getSkillState(); const ev=(st&&st.evals&&st.evals[empId])||{};
    const keys=SKILLS.ALL_KEYS; let score=0, done=0;
    keys.forEach(k=>{ const v=ev[k]; if(v && SKILLS.LEVELS[v]){ score+=SKILLS.LEVELS[v].weight; done++; } });
    return { done, total:keys.length, score, pct: Math.round(score/keys.length*100), evals:ev };
  },
  shiftOf(empId){ const st=this.getSkillState(); return (st&&st.shifts&&st.shifts[empId])||{}; },

  /* --- 雲端技能資料（USE_CLOUD 時；把雲端資料同步進本機快取，其餘讀取邏輯不變） --- */
  async fetchSkillsFromCloud(){
    if(!CONFIG.USE_CLOUD) return null;
    try{ const j=await (await fetch(`${CONFIG.API_BASE}/skills`)).json(); return j; }catch(e){ console.error("讀取雲端技能失敗：",e); return null; }
  },
  // 把雲端技能/班別覆蓋進 localStorage skill_eval_v2，讓 getSkillState/skillCoverage 直接可用
  async syncSkillsToLocal(){
    const j=await this.fetchSkillsFromCloud(); if(!j) return false;
    try{
      const cur=this.getSkillState()||{};
      cur.evals=j.evals||{}; cur.shifts=j.shifts||{}; cur.updated=j.updated||cur.updated;
      // 每人最後評核時間（雲端 times 為毫秒）→ 併入 evalMeta（取較新者）
      if(j.times){ cur.evalMeta=cur.evalMeta||{};
        Object.keys(j.times).forEach(id=>{ const iso=new Date(j.times[id]).toISOString();
          if(!cur.evalMeta[id] || new Date(iso)>new Date(cur.evalMeta[id])) cur.evalMeta[id]=iso; }); }
      localStorage.setItem("skill_eval_v2", JSON.stringify(cur));
      return true;
    }catch(e){ return false; }
  },
  // 某員工「最後一次技能評核」時間（Date 或 null）
  lastSkillEval(empId){
    const st=this.getSkillState()||{};
    const iso=(st.evalMeta&&st.evalMeta[empId])||null;
    if(!iso) return null; const d=new Date(iso); return isNaN(d)?null:d;
  },
  // 取某員工的新人考核（USE_CLOUD 時走 /api/onboard；技能評核帶入用）
  async fetchOnboard(person){
    if(!CONFIG.USE_CLOUD) return null;
    const q=new URLSearchParams(); if(person.id) q.set("id",person.id); if(person.name) q.set("name",person.name); if(person.store) q.set("store",person.store);
    try{ const j=await (await fetch(`${CONFIG.API_BASE}/onboard?${q}`)).json(); return (j&&j.levels)?j:null; }catch(e){ return null; }
  },

  /* --- 新人考核 → 技能評核 帶入規則 --- */
  // 由新人考核成績算出對應的 SM 技能等級（依 ONBOARD_TO_SKILL 對應）
  prefillFromOnboard(onboardEval){
    const pre={}; if(!onboardEval||!onboardEval.levels) return pre;
    Object.keys(SKILLS.ONBOARD_TO_SKILL).forEach(okey=>{
      const lv=onboardEval.levels[okey]; if(lv==null) return;
      const smLevel=SKILLS.ONBOARD_LEVEL_TO_SM[lv]; if(!smLevel) return;
      SKILLS.ONBOARD_TO_SKILL[okey].forEach(sk=>{ pre[sk]=smLevel; });
    });
    return pre;
  },
  // 合併新人考核到既有技能評核：空的就補；已有值時「較新的考核」為準（比日期）。
  // existing=該人現有技能物件；onboardEval=新人考核；smUpdated=該人技能評核最後更新時間(ISO/Date)。
  // 回傳 {evals:合併後, marks:被帶入/更新的技能(標記可改), filled, overwritten}
  mergeOnboardIntoSkills(existing, onboardEval, smUpdated){
    existing = existing || {};
    const pre = this.prefillFromOnboard(onboardEval);
    const ot = new Date((onboardEval && (onboardEval.updated || onboardEval.date)) || 0).getTime();
    const st = smUpdated ? new Date(smUpdated).getTime() : 0;
    const out = Object.assign({}, existing), marks = {};
    let filled=0, overwritten=0;
    Object.keys(pre).forEach(sk=>{
      const cur = out[sk];
      if(cur==null || cur===''){ out[sk]=pre[sk]; marks[sk]=true; filled++; }         // 空格：直接補
      else if(pre[sk]!==cur && ot>st){ out[sk]=pre[sk]; marks[sk]=true; overwritten++; } // 衝突且新人考核較新：以最新為主
      // 其餘（技能評核較新或值相同）：保留既有
    });
    return { evals:out, marks, filled, overwritten };
  },
};

/* ========== 匯出 ================================================ */
return { CONFIG, STORES, ALL_STORES, STORE_PW, CHECKLIST, ICONS, EVAL_ITEMS,
  PASS, LEVELS, RATIO, RATIO3, labelsOf, ratioOf, activeItems, effWeights, score,
  SAMPLE_PEOPLE, SKILLS, DataAPI };
})();
