const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const { getProfile, updateProfile, uploadProfilePicture, uploadBannerPicture } = require("../controllers/profileController");
const { uploadProfilePic, uploadBannerPic } = require("../middleware/upload");

router.get("/", verifyToken, getProfile);

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/", verifyToken, updateProfile);

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

module.exports = router;
