const express = require("express")
const router = express.Router()
const Comment = require("../models/Comments")
const Tweet = require("../models/Tweets")
const mongoose = require("mongoose")

router.post("/", async (req, res) => {
    // console.log(req.body)
    try {
        const tweet = await Tweet.findById(req.body.tweetId);

        if (!tweet) 
            return res.status(404).send("Tweet not found");

        const comment = new Comment({
            comment: req.body.comment,
            commentBy: req.user._id,
            tweetId: req.body.tweetId
        });
        tweet.comments.push(comment._id);
        await comment.save();
        await tweet.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;