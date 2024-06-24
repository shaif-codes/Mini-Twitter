const express = require("express")
const router = express.Router();
const User = require("../models/User");

router.post("/userid", async (req, res) => {
    try {
        const userid = req.body.userid;
        // console.log(userid);
        const user = await User.findOne({ userid }, {userid: 1, _id: 0});
        // console.log(user);
        if(user?.length === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
);

router.post("/email", async (req, res) => {
    try {
        const email = req.body.email;
        // console.log(email);
        const user = await User.findOne({ email }, {email: 1, _id: 0});
        // console.log(user);
        if(user?.length === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/phone", async (req, res) => {
    try {
        const phone = req.body.phone;
        // console.log(phone);
        const user = await User.findOne({ phone }, {phone: 1, _id: 0});
        // console.log(user);   
        if(user?.length === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }   
});

module.exports = router;
