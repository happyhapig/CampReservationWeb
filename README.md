# COME CAMP

## 簡介

這是一個前後端分離的營區預訂平台，包含：

- 前端使用者界面：提供營區瀏覽、營位預訂與購物車功能。
- 後端管理工具：支援營區資料管理、營位設定、訂單管理與定位表開放功能。

本專案同時使用 `.env` 檔案管理後端與前端環境變數。

---

## 環境變數設定說明

### 🔧 根目錄（Backend）

- `.env.example`  
  後端環境變數範例，包含如 `MONGO_URI`、`JWT_SECRET` 等。

請依此建立 `.env`，並填入你的實際設定：

```bash
cp .env.example .env

前端資料夾（frontend/）
.env.production.example：正式環境的變數範例。

.env.development：開發環境設定檔（自行建立）。

請依此建立前端環境設定：

bash
複製
編輯
cd frontend
cp .env.production.example .env.production

🔧 專案啟動方式
Backend
bash
複製
編輯
npm install
npm run dev
Frontend
bash
複製
編輯
cd frontend
npm install
npm run dev
🖼️ 專案畫面預覽
📦 後台畫面
畫面	說明
後台工具首頁，營區列表
新增資料（基本資料、營位設定、定位表開放）
修改營區資料
訂單清單頁面

🏕️ 前台畫面
畫面	說明
前端首頁，提供地區與類型的條件篩選
點選營區後顯示地圖與營位資訊
選擇營位與日期後加入購物車
顯示所有選擇的預訂項目與結帳功能

🔒 注意事項
請勿提交 .env、.env.production 等真實設定檔。

.gitignore 已設為排除這些檔案，僅提交 .env.example 等範例檔案。

🔗 網站連結
👉 正式網站連結
👉 後台管理頁連結（如有）

如有任何問題，歡迎提問或開啟 Issue。