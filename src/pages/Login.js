// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, firestore } from '../js/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.css';
import '../styles/google.css';
import faceBookLogo from '../assets/facebook_icon.png';
import googleLogo from '../assets/google_icon.png';
import getErrorMessage from '../js/firebaseErrorMessages';

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        navigate('/profile');
      } else {
        setError('User data does not exist.');
      }
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        navigate('/profile');
      } else {
        setError('User data does not exist.');
      }
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        navigate('/profile');
      } else {
        setError('User data does not exist.');
      }
    } catch (error) {
      setError(getErrorMessage(error.code));
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
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          </form>
          <div className="auth-buttons">
            <button onClick={handleGoogleSignIn} className="google-sign-in">
              <img src={googleLogo} alt="Google logo" className="icon-left google-icon" />
              Sign in with Google
            </button>
            <button onClick={handleFacebookSignIn} className="facebook-sign-in">
              <img src={faceBookLogo} alt="Facebook logo" className="icon-left facebook-icon" />
              Sign in with Facebook
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
