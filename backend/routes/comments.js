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
        res.status(500).send({status: error.status, message: error.message});
    }
});

router.get("/:tweetId", async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const comments = await Tweet.findById(tweetId).populate({
            path: "comments",
            populate: {
                path: "commentBy",
                model: "User",
                select: "userid name email"
            }
        });
        const mappedComments = comments.comments.map(comment => ({
            id: comment._id,
            comment: comment.comment,
            commentBy: comment.commentBy.userid,
            name: comment.commentBy.name,
            email: comment.commentBy.email,
            userId: comment.commentBy.userid,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }));
        res.status(200).json(mappedComments);
    } catch (error) {
        res.status(500).send({status: error.status, message: error.message});
    }
});


module.exports = router;