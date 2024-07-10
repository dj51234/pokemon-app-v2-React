// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, firestore } from '../js/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.css';
import '../styles/google.css';
import faceBookLogo from '../assets/facebook_icon.png';
import googleLogo from '../assets/google_icon.png';
import getErrorMessage from '../js/firebaseErrorMessages';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Can be either email or username
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
      let email = identifier;

      // Check if the identifier is an email or username
      if (!identifier.includes('@')) {
        // If it's a username, fetch the user by username (case-insensitive)
        const usersCollection = collection(firestore, 'users');
        const q = query(usersCollection, where('lowercaseUsername', '==', identifier.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          email = userDoc.email;
        } else {
          throw new Error('User data does not exist.');
        }
      }

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
      setError(getErrorMessage(error.code) || error.message);
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
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or Username"
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
          <p className='account-status'>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
