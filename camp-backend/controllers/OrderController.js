const { getCollection } = require('../db/db');
const collectionOrders = () => getCollection('order');
const collectionReservations = () => getCollection('reservation');
const dayjs = require('dayjs');
const { ObjectId } = require("bson");

exports.createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid order format' });
        }

        // 儲存訂單
        const order = {
            userId,
            items,
            createdAt: new Date(),
        };

        await collectionOrders().insertOne(order);

        // 更新 reservation 的剩餘數量
        for (const item of items) {
            const { campId, campsiteId, date, amount, nights } = item;
            const [year, month, day] = date.split('-').map(Number);
            const baseDate = new Date(year, month - 1, day);

            for (let i = 0; i < nights; i++) {
                const target = new Date(baseDate);
                target.setDate(baseDate.getDate() + i);

                const targetDate = `${target.getFullYear()}-${target.getMonth() + 1}`;
                const dayStr = `${target.getDate()}`;

                const query = { date: targetDate, campsiteId, campId };
                const update = { $inc: { [`availability.${dayStr}`]: -amount } };

                await collectionReservations().updateOne(query, update);
            }
        }

        res.status(200).json({ success: true, message: 'Order placed and reservations updated' });
    } catch (error) {
        console.error('Create order failed:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: '缺少 userId' });
    }

    const orders = await collectionOrders()
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('取得訂單失敗:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

exports.clearAllOrders = async (req, res) => {
  try {
    const orders = await collectionOrders().find().toArray();

    for (const order of orders) {
      for (const item of order.items) {
        const { campId, date, campsiteId, amount, nights } = item;

        for (let i = 0; i < nights; i++) {
          const targetDate = dayjs(date).add(i, 'day');
          const dateStr = `${targetDate.year()}-${targetDate.month() + 1}`
          const dayStr = `${targetDate.date()}`;

          const query = { date: dateStr, campId, campsiteId };
          const update = { $inc: { [`availability.${dayStr}`]: +amount } };

          await collectionReservations().updateOne(query, update);
        }
      }
    }

    await collectionOrders().deleteMany({});

    return res.status(200).json({ success: true, message: '所有訂單已清除，並復原 reservation 數量。' });

  } catch (error) {
    console.error('清除訂單錯誤:', error);
    return res.status(500).json({ success: false, error: '伺服器錯誤，無法清除訂單。' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {

    const orders = await collectionOrders().find().sort({ createdTime: -1 }).toArray(); 
    res.render("order", { orders: orders });

  } catch (err) {
    res.status(500).send("訂單載入失敗：" + err.message);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("無效的訂單 ID");
    }

    await collectionOrders().deleteOne({ _id: new ObjectId(id) });

    res.redirect("/order"); // ✅ 刪除後重新載入列表
  } catch (err) {
    res.status(500).send("刪除失敗：" + err.message);
  }
};