const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to create a new user
router.post('/', async (req, res) => {
    console.log(req.body);
    const { userid, password, name, email, phone, dob } = req.body;
    try {
        const newUser = new User({
            userid,
            password,
            name,
            email,
            phone
            // dob? dob : null,
        });

        await newUser.save();
        res.status(201).send("User registered successfully");
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

module.exports = router;
