const { getCollection } = require("../db/db");

const collectionCamp = () => getCollection("camp");
const collectionReservation = () => getCollection("reservation");

exports.getCampReservation = async(req, res) => {
    try {
        const campId = req.query.campId;             
        const listReservation = await collectionReservation().find({ campId: campId }).toArray();
        
        res.json({ success: true, listReservation});
    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ success: false, message: error.message });
    }    
}

exports.CreateAllReservation = async(req, res) => {
    try {
        const { campId } = req.body;
        const insertedIds = await createReservationsForCamp(campId);
        console.log(insertedIds);
        res.json({ success: true, insertedIds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

async function createReservationsForCamp(campId) {
    
    const camp = await collectionCamp().findOne({ id: campId });    
    const fistCampsite = camp.campsites[0];

    let reservationData = [];
    reservationData = await collectionReservation().find({ 
        campId: campId,
        campsiteId: fistCampsite.id,
    }).toArray();    

    let year;
    let month;

    //是否要開放當月訂位資料
    const isOpenNextMonth = reservationData.length > 0
    
    if (isOpenNextMonth) {
        //取得所有訂位資料，比對最新的一筆
        const latestMonth = reservationData.reduce((latest, item) => {
            const [year, month] = item.date.split("-");
            const current = parseInt(year) * 12 + parseInt(month);
            return current > latest ? current : latest;
        }, 0);

        year = Math.floor(latestMonth / 12);
        month = latestMonth % 12 || 12;
        
    } else {
        let currentDate = new Date();
        year = currentDate.getFullYear();
        month = currentDate.getMonth() + 1;
    }    

    //計算要開放的年月
    const nextYear = (isOpenNextMonth && month == 12) ? (year + 1) : year;
    const nexrMonth = isOpenNextMonth ? ((month + 1) % 12 || 12) : month;
    
    const daysInMonth = new Date(nextYear, nexrMonth, 0).getDate();
    const reservations = [];
    
    const date = nextYear + "-" + nexrMonth;
    
    camp.campsites.forEach(campsite => {
        
        let availability = {};
        for (let d = 1; d <= daysInMonth; d++) {
            availability[d] = Number(campsite.amount);            
        }
        
        reservations.push({
            campId: campId,
            campsiteId: campsite.id,
            date,
            availability
        });
    });
  
    const result = await collectionReservation().insertMany(reservations);
    return result.insertedIds;
}  

exports.clearCampReservation = async (req, res) => {
    try {
        const campId = req.query.campId;
        console.log(campId);
        if (!campId) {
        return res.status(400).json({ success: false, message: "缺少 campId" });
        }

        const result = await collectionReservation().deleteMany({ campId });

        res.status(200).json({
        success: true,
        message: `已刪除 ${result.deletedCount} 筆訂位資料`,
        });
    } catch (err) {
        console.error("清空訂位失敗:", err);
        res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
};
