const express = require("express")
const router = express.Router()
const Comment = require("../models/Comments")
const Tweet = require("../models/Tweets")
const mongoose = require("mongoose")
const { successResponse, errorResponse, notFoundResponse } = require("../utils/responseUtils")

router.post("/", async (req, res) => {
    // console.log(req.body)
    try {
        const tweet = await Tweet.findById(req.body.tweetId);

        if (!tweet) 
            return notFoundResponse(res, "Tweet not found");

        const comment = new Comment({
            comment: req.body.comment,
            commentBy: req.user._id,
            tweetId: req.body.tweetId
        });
        tweet.comments.push(comment._id);
        await comment.save();
        await tweet.save();

        return successResponse(res, comment, "Comment added successfully", 201);
    } catch (error) {
        return errorResponse(res, "Failed to add comment", 500, error);
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

        if (!comments) {
            return notFoundResponse(res, "Tweet not found");
        }

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

        return successResponse(res, mappedComments, "Comments retrieved successfully");
    } catch (error) {
        return errorResponse(res, "Failed to fetch comments", 500, error);
    }
});

module.exports = router;