const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const { getProfile, updateProfile, uploadProfilePicture, uploadBannerPicture } = require("../controllers/profileController");
const { uploadProfilePic, uploadBannerPic } = require("../middleware/upload");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const mongoose = require("mongoose");

// --- Define specific routes FIRST --- 

// Own profile
router.get("/", verifyToken, getProfile);

// Search users
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      // Maybe return suggestions or popular users if no search term?
      // For now, return empty array.
      return successResponse(res, [], 200);
    }
    console.log("Searching for:", searchTerm);
    
    // Use $regex for flexible, case-insensitive search
    const searchPattern = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
    const users = await User.find({
      $or: [
        { name: { $regex: searchPattern } },
        { userid: { $regex: searchPattern } }
      ]
      // Optionally exclude the current user from search results
      // _id: { $ne: req.user._id } 
    })
    .select("_id userid name profilePictureUrl"); // Select only needed fields

    successResponse(res, users, 200);
  } catch (error) {
    console.error("Error searching users:", error);
    errorResponse(res, "Internal Server Error during search", 500);
  }
});

// Upload routes
router.post(
  "/upload/profile-picture",
  verifyToken,
  uploadProfilePic,
  uploadProfilePicture
);

router.post(
  "/upload/banner-picture",
  verifyToken,
  uploadBannerPic,
  uploadBannerPicture
);


// Get specific user profile by ID
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Ensure the id is a valid ObjectId before querying if needed
    if (!req.params.userId) {
        return errorResponse(res, "Invalid user userid format", 400);
    }
    
    const user = await User.findOne({ userid: req.params.userId })
      .select("-password -accessToken") // Exclude sensitive fields
      .populate("followers", "_id userid name profilePictureUrl") // Populate necessary fields
      .populate("following", "_id userid name profilePictureUrl");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    successResponse(res, user, 200); // Use successResponse
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    errorResponse(res, "Internal Server Error", 500);
  }
});



// Update own profile (assuming this updates the logged-in user)
router.put("/", verifyToken, updateProfile);

module.exports = router;
