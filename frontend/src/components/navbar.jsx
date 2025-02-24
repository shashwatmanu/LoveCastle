import React from 'react'
import logo from '../assets/lovecastle.png'


import boardAnimationColor from "../assets/boardAnimationColor.json"
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useNavigate } from 'react-router-dom';


const navbar = () => {
  const navigate = useNavigate();
  return (
    <>
    <div style={{display:'flex', justifyContent:'space-between', position:'absolute', top:'0px', width:'100vw', padding:'2rem', alignItems:'center'}}>
    <PersonIcon fontSize='large' color='warning' onClick={()=> navigate('/me')}/>
<img src={logo} alt="" style={{height:'50px'}} onClick={()=> navigate('/')}/>
    <ChatBubbleIcon fontSize='large' color='warning' onClick={()=> navigate('/messages')}/>
    
    </div>
    </>
  )
}

export default navbar