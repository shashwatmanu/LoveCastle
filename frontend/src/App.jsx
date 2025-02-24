import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main'; // Swiping Profiles Page
import Login from './pages/Login';
import Register from './pages/Register';
import Introduction from './pages/Introduction';
import { PrivateRoute, PublicRoute } from './components/RouteGuards';
import UpdateProfile from './pages/UpdateProfile';
import Me from './pages/Me';
import { CssBaseline } from '@mui/material/';
import { GlobalStyles } from '@mui/material';
import Navbar from './components/navbar';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Game from "./pages/Game";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulated login state (replace with actual logic)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
     <CssBaseline/>
     <GlobalStyles
        styles={{
          body: {
            background: 'linear-gradient(92.7deg,  rgba(245,212,212,1) 8.5%, rgba(252,251,224,1) 90.2%)',
            // background: 'radial-gradient(circle 321px at 8.3% 75.7%,  rgba(209,247,241,1) 0%, rgba(249,213,213,1) 81%)',
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            color: '#ffffff', // Ensures text is readable
          },
        }}
      />
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Introduction />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Login setIsLoggedIn={setIsLoggedIn}/>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Register />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path="/swipe"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              
              <Navbar/>
              <Main />
              
             
              
            </PrivateRoute>
          }
        />

<Route
          path="/me"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
             {/* <UpdateProfile /> */}
             <Navbar/>
             <Me/>
              </PrivateRoute>
          }
        />

<Route
          path="/messages"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
             {/* <UpdateProfile /> */}
             <Navbar/>
             
             <Messages/>
              </PrivateRoute>
          }
        />

<Route
          path="/chat"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
             {/* <UpdateProfile /> */}
             {/* <Navbar/> */}
             
             <Chat/>
              </PrivateRoute>
          }
        />

<Route
          path="/game"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
             {/* <UpdateProfile /> */}
             {/* <Navbar/> */}
             
             <Game/>
              </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;