const express = require("express")
const router = express.Router()
const Tweet = require("../models/Tweets")
const User = require("../models/User")


//timeline route- get all tweets from the database in chronological order
router.get("/", async (req, res)=>{
    try{
        // const tweets = await Tweet.find({})?.sort({createdAt: 1});
        // if(!tweets){
        //     return res.status(400).send("No tweets found")
        // }
        // res.send(tweets)
        const following = await User.findById(req.user._id).select("following")?.populate("following");
        // if (!following) {
        //     return res.status(400).send("No following found");
        // }
        // if(following.following.length === 0){
        //     return res.status(400).send("No following found");
        // }
        const followingIds = following ? following.following.map(follow => follow._id) : [];
        followingIds.push(req.user._id);
        const timelineTweets = await Tweet.find({tweetBy:{$in: followingIds}}).populate("tweetBy")
        res.send(timelineTweets);
    }
    catch(err){
        res.status(400).send(err)
    }    
    
});

//create a new tweet route
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

// Search tweets
router.get("/search", async (req, res) => {
    try {
        const { searchTerm } = req.query;
        if (!searchTerm) {
            // Return empty array or perhaps recent tweets if no term?
            return res.status(200).json([]); 
        }

        // Use $regex for case-insensitive search within the tweet content
        const searchPattern = new RegExp(searchTerm, 'i'); 

        const tweets = await Tweet.find({
            tweet: { $regex: searchPattern } 
            // You could add searching user details here too if needed:
            // $or: [ 
            //   { tweet: { $regex: searchPattern } },
            //   { 'tweetBy.name': { $regex: searchPattern } }, // Requires populating first or separate query
            // ]
        })
        .populate("tweetBy", "_id userid name profilePictureUrl") // Populate user details
        .sort({ createdAt: -1 }) // Optional: sort by most recent
        .limit(20); // Optional: limit results

        res.status(200).json(tweets);
    } catch (error) {
        console.error("Error searching tweets:", error);
        res.status(500).send(error.message || "Internal Server Error during tweet search");
    }
});

//get a single tweet by id
router.get("/:tweetId", async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.tweetId).populate("comments");
        // console.log(tweet)
        if (!tweet) 
            return res.status(404).send("Tweet not found");

        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//delete a tweet by id
router.post("/delete", async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.body.tweetId);
        
        if (!tweet)
            return res.status(404).send("Tweet not found");  
        // console.log("tweet", tweet)

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