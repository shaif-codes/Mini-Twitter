const express = require("express")
const router = express.Router()
const user = require("../models/User")
// const mongoose = require("mongoose")

router.post("/", async (req, res) => {
    const {followId} = req.body
    const userId = req.user._id
    // console.log(userId, followId)

    try {
        const user1 = await user.findOne({_id: userId})
        const user2 = await user.findOne({userid: followId})
        

        if (!user1 || !user2) {
            return res.status(404).send("User not found")
        }
        
        if (user1.following.includes(user2._id)) {
            return res.status(400).send("Already following")
        }

        
        user1.following.push(user2._id)
        user2.followers.push(user1._id)
        await user1.save()
        await user2.save()

        res.status(200).send("Followed successfully")
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});

module.exports = router;
