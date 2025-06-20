const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['google', 'guest'],
        required: true
    },
    guestId: {
        type: String,
        unique: true,
        sparse: true // 只對非 null 值做唯一檢查
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String
    },
    cart: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('model_user', userSchema);