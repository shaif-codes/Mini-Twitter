const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Set limits (e.g., 5MB per file)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Initialize multer with storage, file filter, and limits
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter, 
  limits: limits 
});

// Middleware for single profile picture upload
// 'profilePic' should match the field name sent from the frontend form
const uploadProfilePic = upload.single('profilePic');

// Middleware for single banner picture upload
// 'bannerPic' should match the field name sent from the frontend form
const uploadBannerPic = upload.single('bannerPic');

module.exports = { 
  uploadProfilePic, 
  uploadBannerPic 
}; 