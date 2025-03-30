const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        // Decode the JWT token to get the payload
        const decoded = jwt.verify(token, secret);
        // Find the user by ID
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send("Invalid token");
        }

        // Compare the provided token with the stored hashed token
        const isTokenValid = await bcrypt.compare(token, user.accessToken);
        if (!isTokenValid) {
            return res.status(401).send("Invalid token");
        }

        // Token is valid, attach user to request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};

module.exports = verifyToken;
