const express = require("express")
const router = express.Router()
const Tweet = require("../models/Tweets")
const mongoose = require("mongoose")


router.post("/like", async (req, res) => {
    // console.log(req.body.tweetId)
    try {
        const tweetId = req.body.tweetId;

        if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            return res.status(400).send("Invalid Tweet ID");
        }

        const tweet = await Tweet.findById(tweetId);

        if(!tweet) {
            return res.status(404).send("Tweet not found")
        }

        if(tweet.likedBy.includes(req.user._id)) {
            return res.status(400).send("Already liked")
        }

        tweet.likedBy.push(req.user._id);
        await tweet.save();
        res.status(201).json(tweet);
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
}
);
router.post("/unlike", async (req, res) => {
    try {
        const tweetId = req.body.tweetId;

        if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            return res.status(400).send("Invalid Tweet ID");
        }

        const tweet = await Tweet.findById(tweetId);

        if(!tweet) {
            return res.status(404).send("Tweet not found")
        }

        if(!tweet.likedBy.includes(req.user._id)) {
            return res.status(400).send("Not liked")
        }

        tweet.likedBy.pull(req.user._id);
        await tweet.save();
        res.status(201).json(tweet);

    } 
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/likeCount/:tweetId", async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.tweetId);
        res.status(200).json({ liked: tweet.likedBy.includes(req.user._id), count: tweet.likedBy.length });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
module.exports = router;