require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { connectDB } = require("./db/db");
const port = process.env.PORT || 3000;

app.use(express.json()); // 解析 JSON 請求
app.use(cors());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // 解析表單資料
app.use(express.static('public'));

(async () => {
  await connectDB();
  const campRoutes = require("./routes/camp");
  const reservationRoutes = require("./routes/Reservation");
  const userRoutes = require("./routes/User");
  const orderRoutes = require('./routes/Order');
  
  app.use("/camp", campRoutes);
  app.use("/reservation", reservationRoutes);
  app.use("/api", campRoutes);
  app.use("/api", reservationRoutes);
  app.use("/api", userRoutes);
  app.use('/api', orderRoutes);
  app.use('/order', orderRoutes);
  app.listen( port, () => {
    console.log(`伺服器運行於${port}`);
  });
})();