// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, firestore } from '../js/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Register.css';
import '../styles/google.css';
import faceBookLogo from '../assets/facebook_icon.png';
import googleLogo from '../assets/google_icon.png';
import getErrorMessage from '../js/firebaseErrorMessages';
import { getRandomColor } from '../utils/colorUtils';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-background');
    return () => {
      document.body.classList.remove('auth-background');
    };
  }, []);

  const checkUsernameAvailability = async (username) => {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, where('lowercaseUsername', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const isValidPassword = (password) => {
    const minLength = 8;
    const specialCharCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    return (
      password.length >= minLength &&
      specialCharCount >= 2 &&
      uppercaseCount >= 2 &&
      numberCount >= 2
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Username is required');
      return;
    }
    if (username.length < 8 || username.length > 16) {
      setError('Username must be between 8 and 16 characters');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long, contain at least 2 special characters, 2 uppercase letters, and 2 numbers');
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      setError('Username is already taken');
      return;
    }

    const randomColor = getRandomColor();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: username,
        lowercaseUsername: username.toLowerCase(), // Store lowercase username
        bio: '',
        profileColor: randomColor // Store the generated random color
      });
      navigate('/profile');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const isUsernameAvailable = await checkUsernameAvailability(username);
      if (!isUsernameAvailable) {
        setError('Username is already taken');
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await updateProfile(user, { displayName: username });
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: username,
        lowercaseUsername: username.toLowerCase(), // Store lowercase username
        bio: '',
        profileColor: getRandomColor() // Store the generated random color
      });
      navigate('/profile');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const isUsernameAvailable = await checkUsernameAvailability(username);
      if (!isUsernameAvailable) {
        setError('Username is already taken');
        return;
      }

      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      await updateProfile(user, { displayName: username });
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: username,
        lowercaseUsername: username.toLowerCase(), // Store lowercase username
        bio: '',
        profileColor: getRandomColor() // Store the generated random color
      });
      navigate('/profile');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  return (
    <div className="register-container">
      <Header />
      <div className="register-content">
        <div className="register">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
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
            <button type="submit">Register</button>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          </form>
          <div className="auth-buttons">
            <button onClick={handleGoogleSignUp} className="google-sign-in">
              <img src={googleLogo} alt="Google logo" className="icon-left google-icon" />
              Sign up with Google
            </button>
            <button onClick={handleFacebookSignUp} className="facebook-sign-in">
              <img src={faceBookLogo} alt="Facebook logo" className="icon-left facebook-icon" />
              Sign up with Facebook
            </button>
          </div>
          <p className='account-status'>Already have an account? <Link to="/login">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
