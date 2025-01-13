import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Container, Grid2 } from "@mui/material";
import Lottie from "lottie-react";
import snakeAnimation from "../assets/snakes.json"
import boardAnimation from "../assets/boardAnimation.json"
import boardAnimationColor1 from "../assets/boardAnimationColor1.json"
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Fade } from "react-awesome-reveal";
import left from "../assets/left.png"
import right from "../assets/right.png"



const Introduction = () => {
    const [word, setWord] = useState("King");
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
          setWord((prevWord) => (prevWord === "King" ? "Queen" : "King"));
        }, 5000);
    
        return () => clearInterval(interval);
      }, []);

  return (
    <>
    {/* <Box sx={{width:'50vw', marginLeft:'12px', display:'flex', height:'100vh', justifyContent:'space-around'}}>  */}
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', width:'100vw', height:'100vh', justifyContent:'space-evenly'}}>
      {/* <Fade direction="right" triggerOnce> */}

<div style={{display:'flex', flexDirection:'column'}}>
<div style={{display:'flex', justifyContent:'center'}}>
  <Fade direction="right" triggerOnce delay={500}>
<img src={left} alt="" height='100rem'/>
</Fade>
<Fade direction='left' triggerOnce delay={500}>
<img src={right} alt="" height='100rem'/>
</Fade>
</div>

<div>
<Fade triggerOnce delay={1000}>
<Typography variant='h1' color='black'>LoveCastle</Typography>
</Fade>
</div>
</div>



        {/* </Fade> */}
    <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "2rem", md: "3.5rem" },
      
              }}
            >
              Find Your {word} <br />
              <span style={{ color: "#f5af19" }}>Over a Game of Chess</span>!
            </Typography>

            {/* <img src="https://images.vexels.com/media/users/3/254457/isolated/preview/e1b0a70c8337b997b00e9aa5c3e376b0-white-king-chess-piece-color-stroke.png" style={{height:'200px', width:'200px', marginTop:'24px', position:'absolute', bottom:'12%', transform:'rotate(-30deg)', zIndex:'-1'}}/>
            <img src="https://images.freeimages.com/image/previews/b8f/royal-chess-piece-black-stroke-png-design-5694546.png" style={{height:'200px', width:'200px', marginTop:'24px', position:'absolute', bottom:'10%', zIndex:'-1'}}/> */}
            {/* <Box sx={{alignSelf:'flex-end', }}>
            <Lottie animationData={boardAnimationColor1} loop={true} style={{width:'600px'}}/>
            </Box> */}
            <Box sx={{display:'flex', justifyContent:'space-around', width:'100vw'}}>
            
            <Button sx={{background:theme.customGradients.primary, color: 'white'}} variant='contained' size='large'  onClick={()=> navigate('/login') }>
              <Typography variant='h6'>Login</Typography>
              
            </Button>
            
            
            <Button sx={{background:theme.customGradients.primary, color:'white'}} variant='contained' size='large' onClick={()=> navigate('/register')}>
            <Typography variant='h6'>Register</Typography>
            </Button>
            
            </Box>
          
    {/* </Box> */}
    </Box>
    </>
  )
}

export default Introduction