const mongoose = require("mongoose")
const { create } = require("./Comments")
const schema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }, 
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: "1d"
    }
})

module.exports = mongoose.model("BlacklistToken", schema)