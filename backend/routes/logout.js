const express = require("express")
const router = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bycrypt = require("bcrypt")

router.post("/", async (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log(token);
    // const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.status(401).send("Access denied");
    }
    try {
        const blackListToken = await User.findOne({ _id: req.user._id });
        console.log("removing toke: ", blackListToken)
        if(!blackListToken){
            return res.status(401).send("You have been logged out. Please login again.");
        }
        const compare = bycrypt.compare(token, blackListToken.accessToken);
        if (!compare) {
            return res.status(401).send("You have been logged out. Please login again.");
        }

        blackListToken.accessToken = null;

        await blackListToken.save();
        res.status(201).send("Logged out successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
