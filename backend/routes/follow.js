const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/responseUtils");
// const mongoose = require("mongoose")

router.post("/", async (req, res) => {
  const { followId } = req.body;
  const userId = req.user._id;

  // console.log(userId, followId)

  try {
    const user1 = await User.findOne({ _id: userId });
    // check if the user is following itself
    if (user1.userid === followId) {
      return errorResponse(res, "You cannot follow yourself", 400);
    }
    const user2 = await User.findOne({ userid: followId });

    if (!user1 || !user2) {
      return errorResponse(res, "User not found", 404);
    }

    if (user1.following.includes(user2._id)) {
      return errorResponse(res, "Already following", 400);
    }

    user1.following.push(user2._id);
    user2.followers.push(user1._id);
    await user1.save();
    await user2.save();

    successResponse(res, "Followed successfully", 200);
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
});

router.get("/followers", async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId }).populate({
      path: "followers",
      select: "_id userid name profilePictureUrl followers following",
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const mappedFollowers = user.followers.map((follower) => {
      return {
            _id: follower._id,
            userid: follower.userid,
            name: follower.name,
            profilePictureUrl: follower.profilePictureUrl,
            followersCount: follower.followers?.length || 0,
            followingCount: follower.following?.length || 0,
      }
    });
    console.log("Mapped Followers:", mappedFollowers);
    successResponse(res, mappedFollowers, 200);
  } catch (err) {
    console.error("Error fetching followers route:", err);
    errorResponse(res, "Error fetching followers", 500);
  }
});

router.get("/following", async (req, res) => {
  const userId = req.user._id;
  console.log("I am at following:", userId);
  const user = await User.findOne({ _id: userId }).populate({
    path: "following",
    select: "-accessToken -password -createdAt -updatedAt -phoneNumber -email",
  });
  const mappedFollowing = user.following.map((following) => {
    return {
          userid: following.userid,
          name: following.name,
          profilePictureUrl: following.profilePictureUrl,
          followersCount: following.followers.length,
          followingCount: following.following.length,
          isFollowing: following.followers.includes(following.userid),
        };
  });
  console.log("I am at following:", user);
  successResponse(res, mappedFollowing, 200);
});

router.get("/remove-follower/:followId", async (req, res) => {
    console.log("I am at remove-follower route");
  const userId = req.user._id;
  const followId = req.params.followId;
  console.log("I am at remove-follower:", userId, followId);    
  const user = await User.findOne({ _id: userId }).populate("followers");
//   console.log("I am at user:", user);
  if(!user) {
    return errorResponse(res, "User not found", 404);
  }
  const follower = await User.findOne({ _id: followId }).populate("following");
  if(!follower) {
    return errorResponse(res, "Follower not found", 404);
  }
//   console.log("I am at follower:", follower);
  follower.following = follower.following.filter((data) => data._id.toString() !== userId);
  console.log("I am at follower after filtering:", follower.following);
  await follower.save();
  user.followers = user.followers.filter((data) => data._id.toString() !== followId);
  console.log("I am at user after filtering:", user.following);
  await user.save();
  successResponse(res, "Follower removed successfully", 200);
});
module.exports = router;
