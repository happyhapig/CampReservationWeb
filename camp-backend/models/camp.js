const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, required: true },
    campImg: {type: String, required: true },
    area: {type: String, required: true },
    city: {type: String, required: true },
    county: {type: String, required: true },
    altitude: {type: Number, required: true },
    type: {type: String, required: true },
});

const camp = mongoose.model("camp", campSchema, "camp");

module.exports = camp;