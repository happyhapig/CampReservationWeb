const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

console.log("當前環境變數 MONGODB_URI:", process.env.MONGODB_URI); // ✅ 加這行看看是否有成功載入

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

let db = null

async function connectDB() {
    try {
        await client.connect();
        db = client.db("CampReservationDB");
        console.log("成功連接到 MongoDB");
    }
    catch(error) {
        console.log("MongoDB 連接錯誤:", error);
    }
}

function getCollection(name) {
    if (!db) {
        throw new Error("尚未連接資料庫");
    }
    return db.collection(name);
}

module.exports = { connectDB, getCollection };