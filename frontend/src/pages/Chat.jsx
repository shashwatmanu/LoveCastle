import { useEffect, useState, useRef } from 'react';
import socket from "../services/socket";
import { api, fetchUserDetails } from "../services/api";
import { useLocation } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import {Button} from '@mui/material';
import Navbar from '../components/navbar';
import {Avatar} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {matchId, user1Name, user2Name, user1Wins, user2Wins, otherUser} = useLocation().state
//   console.log(matchId, user1Name, user2Name, user1Wins, user2Wins, )
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null); // Reference to the bottom of the messages list
  const navigate = useNavigate();

  const addElement = (newElement) => {
    setMessages((prevMessagesArray) => [...prevMessagesArray, newElement]);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await api.get(`/chat/${matchId}`, {
          headers: {
            Authorization: token,
          },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Join the match room
    socket.emit('joinChat', { matchId });

    // Listen for new messages
    socket.on('receiveMessage', (content) => {
      addElement(content);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [matchId]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
  }, [messages]);


  const sendMessage = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const messageData = { matchId, content: newMessage, sender: user._id };
      await api.post(`/chat/${matchId}`, messageData, {
        headers: {
          Authorization: token,
        },
      });

      // Emit the message to the server
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
        {/* <div style={{position:'sticky', top:'0', height:'4rem', width:'80vw', backgroundColor:'green', justifySelf:'center', borderRadius:'10px'}}>

        </div> */}
        <div style={{position:'sticky'}}>
            <div style={{display:'flex', justifyContent:'center', padding:'0.5rem'}} onClick={()=> navigate('/game')}>
            <Avatar src={otherUser.profilePictures[0].url} sx={{marginLeft:'1rem', alignSelf:'center'}}/>
                <Typography color='secondary' sx={{marginLeft:'1rem', alignSelf:'center'}}>{otherUser.name}</Typography>
            </div>
            <Divider/>
        </div>
      <div style={{ maxHeight: '90vh', overflow: 'auto' , width:'100vw', paddingBottom:'2rem'}}>
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div key={index}>
                
              <Typography
              variant='h6'
              color='white'
              style={{justifySelf:(user._id===message.sender)?'flex-end':'flex-start'}}>
                <div style={{backgroundColor:(user._id===message.sender)?'#f12711':'#f5af19', padding:'1rem', margin:'1rem', borderRadius:'10px'}}>
                {message.message || message.content}
                </div>
                </Typography>
                
            </div>
          ))}
        {/* Invisible div to ensure scrolling */}
        <div ref={messagesEndRef} />
      </div>

      
      <div style={{display:'flex', justifyContent:'space-around', position:'fixed', width:'100vw', bottom:'1rem'}}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        style={{ width: '80%', height:'2rem'}}
      />
      <Button onClick={sendMessage} variant='contained' style={{color:'white'}}>Send</Button>
      </div>
      </>
   
  );
};

export default Chat;
