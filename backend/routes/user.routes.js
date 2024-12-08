import express from "express";
import upload from "../helpers/multer.js"
import User from "../models/user.model.js"

const router = express.Router();

router.put(
  "/update-profile",
  upload.array("photos", 3), 
  async (req, res) => {
    const userId = req.user._id; 
    // console.log(req.user._id);
    const { bio, preferences, latitude, longitude } = req.body; // Assuming these fields are passed from the client
    const files = req.files;

    try {
      // Process uploaded files to get URLs and public_ids from Cloudinary
      const uploadedPictures = files.map((file) => ({
        url: file.path,        // Cloudinary URL of the uploaded image
        public_id: file.filename, // Cloudinary public_id of the image
      }));

      // Update user profile in the database
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            bio,                       // Update bio
            preferences: JSON.parse(preferences), // Assuming preferences are sent as a JSON string
            profilePictures: uploadedPictures,    // Add profile images
            location: { 
              latitude: parseFloat(latitude),  // Store latitude
              longitude: parseFloat(longitude), // Store longitude
            },
          },
        },
        { new: true } // Return the updated user
      );

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
  }
);

export default router;
