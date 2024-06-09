const express = require("express")
const router = express.Router()
const Tweet = require("../models/Tweets")


router.post("/create", async (req, res) => {
    try {
        const tweet = new Tweet({
            tweet: req.body.tweet,
            tweetBy: req.user._id
        });

        await tweet.save();

        res.status(201).json(tweet);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get("/:tweetId", async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.tweetId).populate("comments");
        console.log(tweet)
        if (!tweet) 
            return res.status(404).send("Tweet not found");

        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/delete", async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.body.tweetId);
        
        if (!tweet)
            return res.status(404).send("Tweet not found");
        console.log("tweet", tweet)

        if (tweet.tweetBy.toString() !== req.user._id.toString())
            return res.status(401).send("You are not authorized to delete this tweet");

        await tweet.deleteOne();
        res.status(200).send("Tweet deleted");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/edit', async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.body.tweetId);

        if (!tweet)
            return res.status(404).send("Tweet not found");

        if (tweet.tweetBy.toString() !== req.user._id.toString())
            return res.status(401).send("You are not authorized to edit this tweet");

        tweet.tweet = req.body.tweet;
        await tweet.save();
        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;