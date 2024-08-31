// File: /src/pages/Register.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, firestore } from '../js/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import '../styles/Register.css';
import '../styles/google.css';
import faceBookLogo from '../assets/facebook_icon.png';
import googleLogo from '../assets/google_icon.png';
import getErrorMessage from '../js/firebaseErrorMessages';
import { getRandomColor } from '../utils/colorUtils';
import { fetchSetData } from '../js/api'; // Assuming you have this API function to fetch all sets

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const defaultForYouSetIds = ['sv6pt5', 'sv6', 'sv5', 'sv4pt5'];

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

  const fetchDefaultForYouSets = async (setIds) => {
    const allSets = await fetchSetData();
    return allSets.filter((set) => setIds.includes(set.id));
  };

  const createUserDocument = async (user, username, randomColor) => {
  // Fetch default "For You" sets
  const defaultForYouSets = await fetchDefaultForYouSets(defaultForYouSetIds);
  const userDocRef = doc(firestore, 'users', user.uid);

  // Initialize the properties
  const binder = [];
  const sets = [];
  const wishlist = []; // Replace 'default-card-id' with the actual default card ID

  // Initialize the rarities object with default values
  const userRarities = {
    specialIllustrationRare: 0,
    aceSpecRare: 0,
    amazingRare: 0,
    hyperRare: 0,
    doubleRare: 0,
    radiantRare: 0,
    illustrationRare: 0,
    rareAce: 0,
    rareHolo: 0,
    rareBreak: 0,
    rareHoloEx: 0,
    rareHoloGx: 0,
    rareHoloLvx: 0,
    rareHoloVstar: 0,
    rareV: 0,
    rareHoloVmax: 0,
    rarePrime: 0,
    rarePrismStar: 0,
    rareRainbow: 0,
    rareSecret: 0,
    rareShining: 0,
    rareHoloShiny: 0,
    rareShinyGx: 0,
    rareUltra: 0,
    shinyRare: 0,
    shinyUltraRare: 0,
    trainerGalleryRareHolo: 0,
    ultraRare: 0,
  };

  await setDoc(userDocRef, {
    uid: user.uid,
    email: user.email,
    displayName: username,
    lowercaseUsername: username.toLowerCase(),
    bio: "I'm an avid Pokémon trainer on a mission to catch 'em all! Always exploring new places, meeting fellow trainers, and evolving my team. Add something cool about yourself here...",
    profileColor: randomColor,
    forYouSets: defaultForYouSets.reverse(),
    binder,
    sets,
    wishlist,
    userRarities,
    settings: {},
    isActive: true,
    lastLogin: new Date(),
    totalCards: binder.length,
    rank: 'bronze'
  });
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

      await createUserDocument(user, username, randomColor);

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

      const randomColor = getRandomColor();
      await createUserDocument(user, username, randomColor);

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

      const randomColor = getRandomColor();
      await createUserDocument(user, username, randomColor);

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
            <button type="submit" className='gradient-btn'>Register</button>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          </form>
          <div className="auth-buttons">
            <button onClick={handleGoogleSignUp} className="google-sign-in btn-primary">
              <img src={googleLogo} alt="Google logo" className="icon-left google-icon" />
              Sign up with Google
            </button>
            <button onClick={handleFacebookSignUp} className="facebook-sign-in btn-primary">
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
