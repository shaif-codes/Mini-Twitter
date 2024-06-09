const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/verifyToken")
const User = require("../models/User")


router.get("/", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
            .populate("followers")
            .populate("following");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

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
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
