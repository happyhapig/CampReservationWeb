# 使用官方 Node 基礎映像檔
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# RUN npm install dotenv

# 複製專案檔案
COPY . .

# 設定環境變數（可選）
ENV NODE_ENV=production

# 開放應用埠（你應用 listen 的 port）
EXPOSE 3000

# 啟動指令
CMD ["npm", "start"]