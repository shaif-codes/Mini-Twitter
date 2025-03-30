const User = require('../models/User');
const { uploadFileToFirebase } = require('../utils/fileUpload');
const multer = require('multer'); // Need multer to check for MulterError

// Controller to get user profile
exports.getProfile = async (req, res) => {
  try {
    // User ID is attached to req.user by the authMiddleware
    const user = await User.findById(req.user._id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: "Profile fetched successfully", data: user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// Controller to update user profile (TEXT DATA ONLY)
exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  try {
    // Prevent email and userId from being updated
    delete updates.email;
    delete updates.userid; 

    // Handle password update separately if needed
    if (updates.password && updates.password.length > 0) {
       // Ensure your User model's pre-save hook handles hashing
       console.log("Password update requested (ensure hashing)");
    } else {
      // If password field is empty or not provided, remove it from updates
      delete updates.password; 
    }

    // Remove image URL fields if they were somehow sent in the body
    delete updates.profilePictureUrl;
    delete updates.bannerPictureUrl;

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' } // Added context for potential mongoose quirks
    ).select('-password');

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found during update' });
    }

    res.status(200).json({ message: "Profile text data updated successfully", data: updatedUser });

  } catch (error) {
    console.error("Error updating profile text data:", error);
    if (error.name === 'ValidationError') {
       return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while updating profile text data' });
  }
};

// Helper function to handle single image upload and update user
const handleImageUpload = async (req, res, fieldName, destinationPath) => {
  const userId = req.user._id;
  
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  const file = req.file;

  try {
    console.log(`Uploading ${fieldName} picture...`);
    const imageUrl = await uploadFileToFirebase(
      file.buffer,
      file.originalname,
      file.mimetype,
      destinationPath
    );
    console.log(`${fieldName} picture uploaded:`, imageUrl);

    // Update the specific field in the User document
    const updateData = {};
    updateData[fieldName === 'profilePic' ? 'profilePictureUrl' : 'bannerPictureUrl'] = imageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found during image URL update' });
    }

    res.status(200).json({ 
        message: `${fieldName === 'profilePic' ? 'Profile' : 'Banner'} picture updated successfully`, 
        data: { imageUrl } // Send back the new URL
    });

  } catch (error) {
    console.error(`Error uploading ${fieldName} picture:`, error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${error.message}` });
    }
    if (error.message === 'Not an image! Please upload only images.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: `Server error while uploading ${fieldName} picture` });
  }
};

// Controller to upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  await handleImageUpload(req, res, 'profilePic', 'profile_pictures');
};

// Controller to upload banner picture
exports.uploadBannerPicture = async (req, res) => {
  await handleImageUpload(req, res, 'bannerPic', 'banner_pictures');
}; 