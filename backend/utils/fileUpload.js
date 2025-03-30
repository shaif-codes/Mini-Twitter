const { bucket } = require('../services/firebase');
const { v4: uuidv4 } = require('uuid');

/**
 * Uploads a file buffer to Firebase Cloud Storage and returns a long-lived Signed URL.
 * @param {Buffer} buffer - The file buffer from multer.
 * @param {string} originalname - The original name of the file.
 * @param {string} mimetype - The MIME type of the file.
 * @param {string} destinationPath - The folder path in Firebase Storage (e.g., 'profile_pictures').
 * @returns {Promise<string>} - A promise that resolves with the Signed URL of the uploaded file.
 */
const uploadFileToFirebase = (buffer, originalname, mimetype, destinationPath) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      return reject(new Error('Firebase bucket is not initialized.'));
    }

    const uniqueSuffix = uuidv4();
    const filename = `${destinationPath}/${uniqueSuffix}-${originalname.replace(/\s+/g, '_')}`;
    const fileUpload = bucket.file(filename);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype,
      },
      // Ensure objects are NOT public by default
      // public: false, 
      resumable: false // Recommended for reliability, especially with smaller files like profile pics
    });

    blobStream.on('error', (error) => {
      console.error("Error uploading to Firebase:", error);
      reject(error);
    });

    blobStream.on('finish', async () => {
      // Generate a Signed URL for the uploaded file
      try {
        // Set an expiration date far in the future (e.g., ~100 years)
        // Firebase uses 'v4' signing by default with the Admin SDK
        const [signedUrl] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '01-01-2125' // Adjust date as needed, format MM-DD-YYYY
        });
        console.log(`File uploaded: ${filename}. Signed URL generated.`);
        resolve(signedUrl);
      } catch (err) {
        console.error("Error getting signed URL:", err);
        reject(err);
      }
    });

    blobStream.end(buffer);
  });
};

module.exports = { uploadFileToFirebase }; 