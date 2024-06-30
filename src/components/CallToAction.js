import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../styles/CallToAction.css';

const CallToAction = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCallToAction = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="call-to-action">
      <h1>Let's Get Started</h1>
      <a href="/" onClick={handleCallToAction}>
        {currentUser ? 'Go to Profile' : 'Sign Up or Login'}
      </a>
    </div>
  );
};

export default CallToAction;
