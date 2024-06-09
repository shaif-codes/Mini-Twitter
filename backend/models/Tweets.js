const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    tweet: {
        type: String,
        required: true
    },
    tweetBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("Tweets", schema)