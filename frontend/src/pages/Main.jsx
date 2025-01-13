import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { fetchProfiles } from '../services/api';
import ScoreIcon from '@mui/icons-material/Score';
import Navbar from '../components/navbar';
import PersonIcon from '@mui/icons-material/Person';
import knightAnimation from "../assets/KnightAnimation.json"
import Lottie from 'lottie-react';

const SwipePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfiles();
        console.log(data.matches);  
        setProfiles(data.matches); // Assuming the endpoint returns an array of profiles
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSwipe = (direction, profile) => {
    console.log(`Swiped ${direction} on ${profile.name}`);
    // Add logic to handle 'like' or 'reject' based on the direction
  };

  const handleCardLeftScreen = (name) => {
    console.log(`${name} left the screen`);
  };

  if (isLoading) {
    return <div> <Lottie
    animationData={knightAnimation}
    loop={true}
    style={{ width: 300, height: 300 }}
  /></div>;
  }

  // if (!userDetails?.bio || !userDetails?.preferences || userDetails?.profilePictures.length === 0) {
  //   return <div>Please update your profile to see potential matches.</div>;
  // }

  if (profiles.length === 0) {
    return <div>No more profiles to show. Expand your preferences to see more.</div>;
  }

  return (
    <>
    
    <div style={{width:'100vw', display:'flex', justifyContent:'center', height:'100%'}}>
    <Navbar/>
      {/* <h1>Swipe Profiles</h1> */}
      <div className="cardContainer">
        {profiles.map((profile) => (
          <TinderCard
            key={profile.id}
            onSwipe={(dir) => handleSwipe(dir, profile)}
            onCardLeftScreen={() => handleCardLeftScreen(profile.name)}
          >
            <div
              style={{
                backgroundImage: `url(${profile.profilePictures[0].url})`,
                width: '18rem',
                height: '24rem',
                backgroundSize: 'cover',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'rgba(0, 0, 0, 0.56) 0px 22px 70px 4px',
                position:'absolute',
                top:'50%',
                left:'50%',
                transform:'translate(-50%, -50%)'
              }}
            >
              <div style={{display:'flex', alignSelf:'flex-end', justifyContent:'space-evenly', width:'inherit'}}>
              <h3 style={{ color: 'white'}}>{profile.name}</h3> 
              <h3 style={{ color: 'green'}}> {profile.chessStats.rating}</h3>
              
              </div>
              
              
            </div>
            
          </TinderCard>
        ))}
      </div>
    </div>
    </>
  );
};

export default SwipePage;
