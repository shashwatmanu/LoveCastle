import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Stack,
  Avatar,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails, updateProfile } from "../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar"; // Import your original Navbar component

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchDetails();
  }, []);

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    const totalPhotos = (user.profilePictures ? user.profilePictures.length : 0) + (photoFiles ? photoFiles.length : 0);
    
    if (totalPhotos + files.length > 3) {
      setSnackbarMessage("You can only upload up to 3 photos.");
      setOpenSnackbar(true);
      return;
    }
    setPhotoFiles([...photoFiles, ...files]); // Append new files
  };

  // Handle photo deletion
  const handleDeletePhoto = (index) => {
    const updatedPhotos = photoFiles.filter((_, i) => i !== index);
    setPhotoFiles(updatedPhotos);
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append("name", user.name || "");
      formData.append("bio", user.bio || "");
      formData.append("age", user.age || 18);
      formData.append("latitude", user.latitude || 0);
      formData.append("longitude", user.longitude || 0);
      formData.append("gender", user.gender || "");

      const preferences = user.preferences || {};
      formData.append(
        "preferences",
        JSON.stringify({
          ageRange: preferences.ageRange || { min: 18, max: 99 },
          gender: preferences.gender || "any",
          chessSkillRange: preferences.chessSkillRange || 200,
          locationPreference: preferences.locationPreference || false,
          maxDistance: preferences.maxDistance || 50000,
        })
      );

      // Append photos to formData correctly
      Array.from(photoFiles).forEach((file) => formData.append("photos", file));

      // Use your existing updateProfile method to send the request
      const updatedProfile = await updateProfile(formData);

      // Show success message
      setSnackbarMessage("Profile updated successfully!");
      setOpenSnackbar(true);

      // Reload the page instead of redirecting
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Failed to update profile.");
      setOpenSnackbar(true);
    }
  };

  // Handle geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUser((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <>
      {/* <Navbar /> */}
    
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Use your original Navbar component */}
    

      {/* Profile update form below Navbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          padding: 4,
          marginTop: 10, // Add margin to push content below the Navbar
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Update Your Profile
          </Typography>

          {/* Display current profile photos */}
          {user.profilePictures && (
            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
              {user.profilePictures.map((pic, index) => (
                <Avatar
                  key={index}
                  alt="Profile Picture"
                  src={pic.url}
                  sx={{ width: 100, height: 100 }}
                />
              ))}
            </Box>
          )}

          {/* Display uploaded photos and delete button */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            {Array.from(photoFiles).map((file, index) => (
              <Box key={index} sx={{ position: "relative" }}>
                <Avatar
                  alt="Uploaded Photo"
                  src={URL.createObjectURL(file)}
                  sx={{ width: 100, height: 100 }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                  onClick={() => handleDeletePhoto(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Upload button now placed here */}
          <Box sx={{ marginBottom: 2 }}>
            <Button variant="contained" component="label">
              Upload Photos
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </Button>
          </Box>

          <Stack spacing={3}>
            <TextField
              label="Name"
              value={user.name || ""}
              onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Bio"
              value={user.bio || ""}
              onChange={(e) => setUser((prev) => ({ ...prev, bio: e.target.value }))}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Age"
              type="number"
              value={user.age || 18}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, age: parseInt(e.target.value, 10) }))
              }
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={user.gender || ""}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Preferences section */}
            <Box>
              <Typography gutterBottom>Preferences:</Typography>

              {/* Age Range */}
              <TextField
                label="Age Range"
                type="number"
                value={user.preferences?.ageRange?.min}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      ageRange: { ...prev.preferences.ageRange, min: e.target.value },
                    },
                  }))
                }
                fullWidth
              />
              <TextField
                label="Max Age"
                value={user.preferences?.ageRange?.max || 99}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      ageRange: { ...prev.preferences.ageRange, max: e.target.value },
                    },
                  }))
                }
                fullWidth
              />

              {/* Chess Skill Range */}
              <TextField
                label="Chess Skill Range"
                value={user.preferences?.chessSkillRange || 200}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      chessSkillRange: e.target.value,
                    },
                  }))
                }
                fullWidth
              />

              {/* Gender Preference */}
              <FormControl fullWidth>
                <InputLabel>Gender Preference</InputLabel>
                <Select
                  value={user.preferences?.gender || "any"}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        gender: e.target.value,
                      },
                    }))
                  }
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography gutterBottom>Location Preference:</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={user.preferences?.locationPreference || false}
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          locationPreference: e.target.checked,
                        },
                      }))
                    }
                  />
                }
                label="Enable Location-Based Matching"
                sx={{ display: "block", textAlign: "center" }}
              />
              {user.preferences?.locationPreference && (
                <Box sx={{ marginTop: 2 }}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Latitude"
                      type="number"
                      value={user.latitude || ""}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          latitude: parseFloat(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Longitude"
                      type="number"
                      value={user.longitude || ""}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          longitude: parseFloat(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGetLocation}
                    sx={{ marginTop: 2 }}
                  >
                    Get Current Location
                  </Button>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
            >
              Save Changes
            </Button>
          </Stack>

          {/* Snackbar for success/error messages */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarMessage.includes("success") ? "success" : "error"}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default UpdateProfile;
