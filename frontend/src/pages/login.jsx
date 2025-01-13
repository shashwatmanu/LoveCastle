import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { loginUser } from '../services/api';
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom';

const Login = ({setIsLoggedIn}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });
      const { token } = res;
    
      localStorage.setItem('authToken', token);
      setIsLoggedIn(true);
      navigate('/swipe');
      
      enqueueSnackbar('Logged in', { variant: 'success' })

    } catch (error) {
      console.error('Error during login:', error);
      enqueueSnackbar('Error during login', { variant: 'error' })
    }
   
  };

  return (
    <Container sx={{minWidth:'100vw', display:'flex', justifyContent:'center'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: '#6A1E55', color: 'white' }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
