import React from "react";
import { Box, Typography, Button, Grid, Container, Grid2 } from "@mui/material";
import chessboardImage from '../assets/board.png'
import boardAnimation from "../assets/boardAnimation.json"



import challengeAnimation from "../assets/ChallengeAnimation.json"


const HeroSection = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1f1f1f, #3a3a3a)",
        color: "#fff",
        // minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        minWidth:'100vw'
      }}
    >

      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Text */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Find Your Perfect Match <br />
              <span style={{ color: "#FF4081" }}>Over a Game of Chess</span>.
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: "#bdbdbd", fontSize: "1.2rem" }}
            >
              Swipe, Play, and Connect with chess enthusiasts worldwide. Join
              the ultimate platform where strategy meets romance.
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mr: 2, backgroundColor: "#FF4081" }}
              >
                Register Now
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ color: "#FF4081", borderColor: "#FF4081" }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>

<Grid>
          
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
