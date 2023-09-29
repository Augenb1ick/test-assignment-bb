import React, { useState } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => {
    setShowAnimation(true);
    setTimeout(() => {
      navigate('/about', { replace: true });
    }, 3000);
  };

  return (
    <div className={`container ${showAnimation ? 'show-animation' : ''}`}>
      <div onClick={handleClick} className='text'>
        Bit Busters
      </div>
      <div className={`${showAnimation ? 'bg' : ''}`}>
        <div className='wrapper'>
          <div className='side side-right'></div>
          <div className='side side-left'></div>
          <div className='side side-top'></div>
          <div className='side side-bottom'></div>
          <div className='side side-back'></div>
        </div>
        <div className='wrapper'>
          <div className='side side-right'></div>
          <div className='side side-left'></div>
          <div className='side side-top'></div>
          <div className='side side-bottom'></div>
          <div className='side side-back'></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
