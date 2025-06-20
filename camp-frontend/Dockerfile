# Build stage
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve static files with nginx
FROM nginx:alpine

# 複製 Vite build 的結果
COPY --from=build /app/dist /usr/share/nginx/html

# 可選：自訂 nginx 設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]