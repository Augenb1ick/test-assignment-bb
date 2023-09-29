import { useState } from 'react';
import Starfield from './components/Starfield';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';

import About from './components/About';
import Home from './components/Home';

const App = () => {
  const [isStartAnimation, setIsStartAnimation] = useState(false);
  const [isReverseAnimationStart, setIsReverseAnimationStart] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const navigate = useNavigate();

  const location = useLocation();
  const chechLocation = (path) => {
    return location.pathname === path ? true : false;
  };

  const ftlJump = () => {
    setIsStartAnimation(false);
    setIsReverseAnimationStart(true);

    let animationValue = -50;
    const animationStep = 2;

    const animationInterval = setInterval(() => {
      animationValue += animationStep;
      setAnimationSpeed(animationValue);
      if (animationValue >= 1000) {
        clearInterval(animationInterval);
      }
    }, 1);
    setTimeout(() => {
      setIsReverseAnimationStart(false);
    }, 2000);
  };

  const handleClick = () => {
    setAnimationSpeed(30);
    setIsStartAnimation(true);

    setTimeout(() => {
      if (chechLocation('/')) {
        navigate('/about', { replace: true });
        ftlJump();
      } else {
        navigate('/', { replace: true });
        ftlJump();
      }
    }, 2000);
  };

  return (
    <>
      <Starfield
        numStars={5000}
        starSize={0.5}
        bgLightness={0.06}
        animationSpeed={animationSpeed}
      />
      <Routes>
        <Route
          path='/'
          element={
            <Home
              handleClick={handleClick}
              isStartAnimation={isStartAnimation}
              isReverseAnimationStart={isReverseAnimationStart}
            />
          }
        />
        <Route
          path='/about'
          element={
            <About
              handleClick={handleClick}
              isStartAnimation={isStartAnimation}
              isReverseAnimationStart={isReverseAnimationStart}
            />
          }
        />
        <Route path='*' element={<Navigate to='/' replace={true} />} />
      </Routes>
    </>
  );
};

export default App;
