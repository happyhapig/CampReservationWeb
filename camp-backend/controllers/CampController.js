const { ObjectId } = require("bson");
const { getCollection } = require("../db/db");

const areaList = require("../data/list_area");
const cityList = require("../data/list_city");
const typeList = require("../data/list_type");

const collectionCamp = () => getCollection("camp");
const collectionReservation = () => getCollection("reservation");

//後端編輯資料用
exports.getAllCamps = async(req, res) => {
    let campIds = [];
    try {
        const camps = await collectionCamp().find().toArray();
        
        const campList = (camps || []).map(camp => ({
            ...camp,
            cityName: cityList[camp.city].name || "未知城市",
            areaName: areaList[camp.area].name || "未知地區",
            typeName: typeList[camp.type].name || "未知類型",
        }));  
        
        campIds = camps.map(camp => camp._id.toString());
        const success = req.query.success || null; 

        const editId = req.query.edit;
        let editingCamp = null; 
        let reservationArray = [];
        let prevId = null;
        let nextId = null;
        
        if (editId && ObjectId.isValid(editId)) {
            editingCamp = await collectionCamp().findOne({ _id: new ObjectId(editId) });
            const firstCampsite = editingCamp.campsites[0];
            
            if (firstCampsite && firstCampsite.id) {
                reservationArray = await collectionReservation().find({ 
                    campId: editingCamp.id,
                    campsiteId: firstCampsite.id
                }).toArray();
            }

            const index = campIds.indexOf(editId);
            if (index > 0) prevId = campIds[index - 1];
            else prevId = campIds[campIds.length - 1];

            if (index < campIds.length - 1) nextId = campIds[index + 1];
            else nextId = campIds[0];
        }
        res.render("camp", { title: "Camp Editor", campList, cityList, areaList, typeList, editingCamp, success, reservations: reservationArray, prevId, nextId });         
        
    } catch (error) {
        res.status(500).json({ error :"無法取得營區資料" });
    }
};

//後端新增資料
exports.createCamp = async(req, res) => {
    try {
        const campsiteRaw = req.body.campsites || [];
        const campsites = Array.isArray(campsiteRaw) ? campsiteRaw : Object.values(campsiteRaw);

        const parsedCampsites = campsites.map(site => ({
            id: site.id,
            name: site.name,
            amount: site.amount,
            price: site.price,
            picture: site.picture,
        }));

        const { id, name, picture, campImg, area, city, county, altitude, type } = req.body;
        await collectionCamp().insertOne({ id, name, picture, campImg, area, city, county, altitude, type, campsites: parsedCampsites });
        const allCamps = await collectionCamp().find().toArray();
        
        res.json({ success: true, allCamps});
        res.re
    } catch (error) {
        res.status(500).json({ error: "新增營區資料失敗" });
    }
};

//後端更新資料
exports.updateCamp = async (req, res) => {
    try {
        const campId = req.body._id;
        const campsiteRaw = req.body.campsites  || [];
        const campsites = Array.isArray(campsiteRaw) ? campsiteRaw : Object.values(campsiteRaw);
        
        const parsedCampsites = campsites.map(site => ({
            id: site.id,
            name: site.name,
            amount: site.amount,
            price: site.price,
            picture: site.picture,
        }));

        const { id, name, picture, campImg, area, city, county, altitude, type } = req.body;
    
        const updatedCamp = {
            id, name, picture, campImg, area, city, county, altitude, type,
            campsites: parsedCampsites,
        };

        await collectionCamp().updateOne(
            { _id: new ObjectId(campId) },
            { $set: updatedCamp }
        );        

        const allCamps = await collectionCamp().find().toArray();
        res.json({ success: true, allCamps });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }    
};

exports.apiGetAllCamps = async (req, res) => {
    try {
        var camps = await collectionCamp().find().toArray();
        res.json(camps);
    } catch (error) {
        console.error("取得營區資料錯 : ", error);
        res.status(500).json({ error: "無法取得資料" });
    }
};

exports.getCampById = async (req, res) => {
    try {
        const { id } = req.params;

        const camp = await collectionCamp().findOne({ id: id });

        if (!camp) {
        return res.status(404).json({ success: false, message: "找不到營地資料" });
        }

        res.json(camp);
    } catch (err) {
        console.error("取得營地失敗:", err);
        res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
};