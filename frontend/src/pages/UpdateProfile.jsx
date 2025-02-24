import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails, updateProfile } from "../services/api";
import { use } from "react";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [genderPreference, setGenderPreference] = useState("");
  const [locationPreference, setLocationPreference] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [chessSkillRange, setChessSkillRange] = useState({ min: 0, max: 0 });
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
        setBio(userData.bio || "");
        setGenderPreference(userData.genderPreference || "");
        setLocationPreference(userData.locationPreference || false);
        setCurrentLocation(userData.currentLocation || "Not Available");
        setAgeRange(userData.ageRange || { min: 18, max: 50 });
        setChessSkillRange(userData.chessSkillRange || { min: 0, max: 0 });
        setPhotos(userData.profilePictures || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {  
    console.log(user)
    , [user]});
  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const updatedData = {
        bio,
        genderPreference,
        locationPreference,
        ageRange,
        chessSkillRange,
        photos,
      };
      await updateProfile(updatedData);
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Update Your Profile
        </Typography>
      </Grid>

      {/* Bio */}
      <Grid item xs={12}>
        <TextField
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
      </Grid>

      {/* Photos */}
      <Grid item xs={12}>
        <Typography>Profile Photos:</Typography>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item key={index} xs={4}>
              <img
                src={photo.url}
                alt={`Profile ${index + 1}`}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Gender Preference */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Gender Preference</InputLabel>
          <Select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">OBJECT</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Location Preference */}
      <Grid item xs={12}>
        <Typography>Current Location: {currentLocation}</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={locationPreference}
              onChange={(e) => setLocationPreference(e.target.checked)}
            />
          }
          label="Enable Location-Based Matching"
        />
      </Grid>

      {/* Age Range Preference */}
      <Grid item xs={12}>
        <Typography>
          Age Range Preference: {ageRange.min} - {ageRange.max}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Min Age"
              type="number"
              value={ageRange.min}
              onChange={(e) =>
                setAgeRange((prev) => ({
                  ...prev,
                  min: parseInt(e.target.value, 10),
                }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Max Age"
              type="number"
              value={ageRange.max}
              onChange={(e) =>
                setAgeRange((prev) => ({
                  ...prev,
                  max: parseInt(e.target.value, 10),
                }))
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Chess Skill Range */}
      <Grid item xs={12}>
        <Typography>
          Chess Skill Range: {chessSkillRange.min} - {chessSkillRange.max}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Min Skill"
              type="number"
              value={chessSkillRange.min}
              onChange={(e) =>
                setChessSkillRange((prev) => ({
                  ...prev,
                  min: parseInt(e.target.value, 10),
                }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Max Skill"
              type="number"
              value={chessSkillRange.max}
              onChange={(e) =>
                setChessSkillRange((prev) => ({
                  ...prev,
                  max: parseInt(e.target.value, 10),
                }))
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProfile}
        >
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

export default UpdateProfile;
