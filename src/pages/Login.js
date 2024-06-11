import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../js/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import '../styles/login.css';
import '../styles/google.css';
import faceBookLogo from '../assets/facebook_icon.png';
import googleLogo from '../assets/google_icon.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-background');
    return () => {
      document.body.classList.remove('auth-background');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/pokedex');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/pokedex');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate('/pokedex');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-content">
        <div className="login">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
          </form>
          <div className="auth-buttons">
            <button onClick={handleGoogleSignIn} className="google-sign-in">
              <img src={googleLogo} alt="Google logo" className="icon-left google-icon" />
              Sign up with Google
            </button>
            <button onClick={handleFacebookSignIn} className="facebook-sign-in">
              <img src={faceBookLogo} alt="Facebook logo" className="icon-left facebook-icon" />
              Sign up with Facebook
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
