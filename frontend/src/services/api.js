import axios from 'axios';

// Set the base URL for your API
const API_BASE_URL = 'http://localhost:8080';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await api.get("/user/me", {
      headers: {
        Authorization: token,
      },
    });
    return response.data; // Return the user details
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await api.put("/user/update-profile", profileData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Return the updated profile data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};


// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to fetch user details
export const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.get('/user/fetch-profiles', {
        headers: {
          Authorization: token,
        },
      });
    //   console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

// Function to upgrade to premium
export const upgradeToPremium = async (userId) => {
  try {
    const response = await api.post(`/user/${userId}/upgrade`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add more functions for other endpoints as needed
