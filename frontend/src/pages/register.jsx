import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { registerUser } from '../services/api';
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const response = await registerUser(formData); // Call the API with formData
      // console.log(response);
      
      if (!response.error) {
        console.log('Registration successful:', response);
        enqueueSnackbar('Registration successful', { variant: 'success' })
        navigate('/login');

        // Redirect or show success message
      } else {
        console.error('Unexpected response:', response);
        // Handle unexpected responses
      }
    } catch (error) {
      console.error('Error during registration:', error);
      enqueueSnackbar('Error during registration', { variant: 'error' })
      // Display an error message to the user
    }
  };

  return (
    <Container sx={{minWidth:'100vw', display:'flex', justifyContent:'center'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: '100%' }}
        >
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
