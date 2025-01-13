import React from 'react';
import Lottie from 'lottie-react';
import knightAnimation from '../assets/knightAnimation.json';

const Loader = ({ fadeOut }) => {
  return (
    <div
      className={`loader-container ${fadeOut ? 'fade-out' : ''}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width:'100vw',
        backgroundColor: '#1A1A1D',
      }}
    >
      <Lottie
        animationData={knightAnimation}
        loop={true}
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

export default Loader;
