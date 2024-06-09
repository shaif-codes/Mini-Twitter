const express = require("express")
const router = express.Router()
const user = require("../models/User")

router.post("/", async (req, res) => {
    const {unfollowId} = req.body
    const userId = req.user._id

    // console.log(req.body, userId)

    try {
        const user1 = await user.findOne({_id: userId})
        const user2 = await user.findOne({userid: unfollowId})
        
        // console.log(user1, user2)

        if (!user1 || !user2) {
            return res.status(404).send("User not found")
        }
        
        if (!user1.following.includes(user2._id)) {
            return res.status(400).send("Not following")
        }

        
        user1.following.pull(user2._id)
        user2.followers.pull(user1._id)
        await user1.save()
        await user2.save()

        res.status(200).send("Unfollowed successfully")
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});

module.exports = router;