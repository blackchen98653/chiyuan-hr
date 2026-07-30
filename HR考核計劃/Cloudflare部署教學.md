# Cloudflare 部署教學（全部用 Cloudflare，不用 Apps Script）

一步一步照做即可。分五大步，慢慢來，不趕。全程免費。

> 做法：Cloudflare 會用一個「Google 服務帳戶」幫你讀寫試算表。你只要建帳戶、拿一把鑰匙、把鑰匙貼到 Cloudflare。

---

## 步驟 1：把新表整理好（約 5 分鐘）

打開你建的新表「**季緣HR系統_資料庫**」。

**1-1 名冊分頁（鏡射大表）**

1. 把第一個分頁改名為 **名冊**。
2. 點 A1 儲存格，貼上這行後按 Enter：
   ```
   =IMPORTRANGE("1bpnKr4H5t5MHt10ol-uVgYaCbkm41ofDKH2GsxxFq5o","人事薪資表!A:P")
   ```
3. 儲存格會出現 `#REF!` 和「**允許存取**」按鈕 → 按下去。大表的人員就會整份跑進來（會自動更新，你之後改大表這裡也會跟著變）。

**1-2 再建 4 個分頁，並在第 1 列貼上標題**

在下方分頁列按「＋」新增分頁，命名並貼標題（用 Tab 分隔，直接貼到 A1 那列）：

- 分頁 **新人考核** →：`時間　員工編號　姓名　門市　職位　總分　通過　等級JSON　評語　考核日　修改時間`
- 分頁 **技能評核** →：`時間　門市　主管　員工ID　技能　等級`
- 分頁 **班別** →：`時間　員工ID　早班　中班　晚班`
- 分頁 **新人自報** →：`時間　員工ID　自報9碼　姓名　門市`

（只要標題列即可，內容之後系統自己寫。）

---

## 步驟 2：建立 Google 服務帳戶 + 拿鑰匙（約 10 分鐘）

**2-1 建專案並開啟 Sheets API**
1. 到 https://console.cloud.google.com （用你公司 Google 帳號登入）。
2. 左上專案下拉 → 新增專案 → 命名 `chiyuan-hr` → 建立。
3. 左側選單 →「API 和服務」→「程式庫」→ 搜尋 **Google Sheets API** → 進去按 **啟用**。

**2-2 建立服務帳戶**
1. 「API 和服務」→「憑證」→ 上方「**+ 建立憑證**」→ **服務帳戶**。
2. 名稱填 `chiyuan-hr-bot` → 建立並繼續 → 角色可略過（直接繼續）→ 完成。

**2-3 下載金鑰（JSON）**
1. 在憑證頁點剛建立的服務帳戶 → 上方「**金鑰**」分頁 → 「新增金鑰」→「建立新的金鑰」→ 選 **JSON** → 建立。
2. 會下載一個 `.json` 檔。用記事本打開，裡面有兩個重點：
   - `"client_email": "chiyuan-hr-bot@....iam.gserviceaccount.com"` ← 這是「服務帳戶 email」
   - `"private_key": "-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"` ← 這是「私鑰」

> ⚠️ 這個 JSON 是機密，等同鑰匙，**別外傳、別貼到聊天室**。只會貼進 Cloudflare。

---

## 步驟 3：把新表分享給服務帳戶（1 分鐘）

1. 回到新表「季緣HR系統_資料庫」→ 右上「**共用**」。
2. 貼上剛剛的 **client_email**（那個 …iam.gserviceaccount.com）。
3. 權限選 **編輯者** → 傳送。

（這樣 Cloudflare 才能寫入你的新表。大表不用分享，因為我們是用 IMPORTRANGE 鏡射。）

---

## 步驟 4：把網站放上 Cloudflare Pages（約 10 分鐘）

因為含有 Functions（後端），建議用 **GitHub 連結**方式（最穩、之後改動會自動更新）：

1. 到 https://github.com 註冊/登入 → New repository → 命名 `chiyuan-hr` → Create。
2. 進 repo → 「uploading an existing file」→ 把 `季緣HR系統` 資料夾裡**所有檔案與資料夾**拖進去上傳 → Commit。
3. 到 https://dash.cloudflare.com → 左側「Workers & Pages」→ Create →「Pages」→「Connect to Git」→ 選剛剛的 repo。
4. 建置設定：**Framework preset＝None**、**Build command 留空**、**Build output directory＝`/`** → 儲存並部署。

> 不熟 GitHub 也沒關係，這步我們可以到時候一起用畫面操作；或你有工程同事可協助這一步。

---

## 步驟 5：設定鑰匙 + 開啟雲端（5 分鐘）

**5-1 環境變數**
Cloudflare 你的 Pages 專案 →「Settings」→「Environment variables」→ Production 新增三個：

| 名稱 | 值 |
|---|---|
| `GOOGLE_CLIENT_EMAIL` | JSON 裡的 client_email（…iam.gserviceaccount.com） |
| `GOOGLE_PRIVATE_KEY` | JSON 裡 private_key 的值（從 `-----BEGIN` 到 `-----END PRIVATE KEY-----\n`，含中間的 `\n` 照貼即可） |
| `DATA_SHEET_ID` | `1MBtq1J4jiCc9_7VdfXKMMkSoR4aJvCsSPNVQ66C5eHs` |

（`GOOGLE_PRIVATE_KEY` 可勾選「Encrypt/加密」。貼的時候把 JSON 裡引號內那一整段複製進去，不用引號本身。）

**5-2 開啟雲端**
1. 打開 `assets/config.js`，把最上面 `USE_CLOUD: false` 改成 `USE_CLOUD: true`（在 GitHub 上直接編輯該檔即可，存檔後 Cloudflare 會自動重新部署）。
2. 等 Cloudflare 顯示部署完成。

---

## 步驟 6：驗收

打開你的 Cloudflare 網址測：
- 新人報到：輸入一位真實員工姓名＋門市 → 應該查得到、顯示報到進度。
- 店經理平台：進門市 → 看得到名單 → 送出一筆考核 → 回新表「新人考核」分頁應有一列。
- HR 總覽：看得到全員與技能/班別。

若某頁空白或查無資料，先確認：名冊 IMPORTRANGE 有沒有「允許存取」、新表有沒有分享給服務帳戶、三個環境變數有沒有貼對。

---

## 常見問題

- **會不會收費？** 不會。Google Sheets API＋服務帳戶＋Cloudflare Pages 這個用量都在免費額度內。
- **私鑰貼上去安全嗎？** Cloudflare 環境變數是加密保存、只有你的後端用得到，不會出現在前端網頁。
- **舊技能資料？** 前面都通了之後，我再幫你把「季緣 SM 評核資料」的舊評核整理成可貼上的格式，貼進新表「技能評核」分頁即可。

卡在任何一步，把畫面截圖給我，我帶你過。
