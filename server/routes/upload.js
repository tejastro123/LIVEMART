// server/routes/upload.js
const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const cloudinary = require('../config/cloudinary');
const { protect, isManager } = require('../middleware/auth');

router.post(
  '/',
  [protect, isManager, fileUpload({ useTempFiles: true })],
  async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No file was uploaded.' });
      }

      const file = req.files.image; // 'image' is the name of the input field

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'live-mart-products',
        // You can add transformations here, e.g., width, height, crop
      });

      res.json({ secure_url: result.secure_url });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
