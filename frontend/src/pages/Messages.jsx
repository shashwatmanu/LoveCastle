import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { fetchUserMatches } from '../services/api';
import { Avatar, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Lottie from 'lottie-react';
import matchAnimation from '../assets/match.json';
import boardanimationColor from '../assets/boardanimationColor1.json';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';



const Messages = () => {
    const [value, setValue] = React.useState(0);
    const [matches, setMatches] = React.useState([]);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchUserMatches();
            console.log(data);
            setMatches(data);
          } catch (error) {
            console.error('Error fetching matches:', error);
          }
        }
        fetchData();
    }, [])

  return (
    <>
    <div style={{width:'100vw', marginTop:'5rem'}}>
        <Tabs value={value} onChange={handleChange} variant='fullWidth'>
            
            <Tab label="Matches" />
            <Tab label="Challenges" />
            
        </Tabs>
        {value === 0 && 
        <>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            {matches.length === 0 ? <h1>No matches yet</h1> : 
            <>
            {matches.map((match) => (
                <>
                <div style={{display:'flex', marginTop:'1rem', width:'100vw', height:'3rem'}} key={match._id} onClick={()=> navigate('/chat',{state:
                  {matchId: match.matchId,
                      name: match.otherUser.name,
                      user1Name: match.user1Name,
                      user2Name: match.user2Name,
                      user1Wins: match.user1Wins,
                      user2Wins: match.user2Wins,
                      otherUser: match.otherUser
                  }})}>
                <Avatar src={match.otherUser.profilePictures[0].url} sx={{marginLeft:'1rem', alignSelf:'center'}}/>
                <Typography color='secondary' sx={{marginLeft:'1rem', alignSelf:'center'}}>{match.otherUser.name}</Typography>
                {/* <Lottie animationData={boardanimationColor} style={{height:'5rem'}}/> */}
                
             
                
                </div>
                <div style={{width:'100vw'}}><Divider/></div>
                </>
            ))}
            </>}
            
        </div>
        </>
        }

        {value === 1 && 
        <>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            {/* <h1>Challenges</h1> */}
            <Lottie animationData={matchAnimation} style={{height:'15rem'}} loop="false"/>
            <p>Here you can see all your challenges</p>
            </div>
        </>
        }

    </div>
    </>
  )
}

export default Messages