const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

router.post("/", async (req, res) => {
    const { userid, password } = req.body

    try {
        const user = await User.findOne({
            userid
        })

        if (!user) {
            return res.status(400).send("Invalid credentials")
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(400).send("Invalid credentials")
        }

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET)
        //encrypting the token and saving it in the database
        const encryptedToken = await bcrypt.hash(token, 10);
        user.accessToken = encryptedToken;
        user.save();
        // res.json({user, accessToken: token})
        res.json({accessToken: token})
        // res.send(token);
    } 
    catch (err) {
        res.status(400).send(err.message)
    }
});

module.exports = router;