const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails"
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweets"
    }
})

module.exports = mongoose.model("Comments", schema)