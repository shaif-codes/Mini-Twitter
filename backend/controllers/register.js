// const User = require('../models/User');

// const registerUser = async (req, res) => {
//     const { userid, password, name, email, phone, dob } = req.body;

//     try {
//         const newUser = new User({
//             userid,
//             password,
//             name,
//             email,
//             phone,
//             dob,
//         });

//         await newUser.save();
//         res.status(201).send("User registered successfully");
//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// }

// module.exports = registerUser;