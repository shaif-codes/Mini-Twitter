const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const verifyToken = require("./middleware/verifyToken");
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const follow = require("./routes/follow");
const unfollow = require("./routes/unfollow");
const tweet = require("./routes/tweet");
const likeCount = require("./routes/likeCount");
const comments = require("./routes/comments");
const logout = require("./routes/logout");


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
    if (req.path === '/register' || req.path === '/login') {
        next();
    } else {
        verifyToken(req, res, next);
    }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Routes
app.use('/register', register);
app.use('/login', login);
app.use('/profile', profile);
app.use('/follow', follow);
app.use('/unfollow', unfollow);
app.use('/tweet', tweet);
app.use('/likeCount', likeCount);
app.use('/comments', comments);
app.use('/logout', logout);
// app.use('/timeline', timeline);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
