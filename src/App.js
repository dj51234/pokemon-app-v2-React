// FILE PATH: src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserBinder from './components/UserBinder';
import OpenPacksPage from './pages/OpenPacksPage';
import WishlistPage from './components/WishlistPage';
import ExpandedCardView from './components/ExpandedCardView';
import Messages from './components/Messages';
import { auth, firestore } from './js/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import './index.css';
import { fetchUserSets } from './js/api';
import ProtectedRoute from './ProtectedRoute';
// import './js/pack_algorithm/fetchAllSetData';

export const AuthContext = React.createContext();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileColor, setProfileColor] = useState('#ffffff'); // Default color
  const [binderCards, setBinderCards] = useState([]); // State for binder cards
  const [sets, setSets] = useState([]); // State for sets

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(firestore, 'users', user.uid);

        // Set up real-time listener for user's Firestore document
        const unsubscribeFirestore = onSnapshot(userDocRef, async (userDocSnap) => {
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.profileColor) {
              setProfileColor(userData.profileColor);
            }
            if (userData.binder) {
              console.log("User's Binder Data:", userData.binder); // Log the binder data
              setBinderCards(userData.binder);

              // Fetch sets based on the binder cards
              const fetchedSets = await fetchUserSets(userData.binder);
              setSets(fetchedSets);
            } else {
              setBinderCards([]);
              setSets([]);
            }
          }
        });

        // Clean up Firestore listener on component unmount or user change
        return () => unsubscribeFirestore();
      } else {
        // Clear state when user logs out
        setCurrentUser(null);
        setBinderCards([]);
        setSets([]);
      }
    });

    // Clean up Auth listener on component unmount
    return () => unsubscribeAuth();
  }, []);

  const handleAddCardsToBinder = async (newCards) => {
    if (currentUser) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      try {
        // Update Firestore with the new binder using arrayUnion to add new cards
        await updateDoc(userDocRef, {
          binder: arrayUnion(...newCards)
        });

        // The real-time listener will automatically update the state
      } catch (error) {
        console.error('Error updating user binder:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, profileColor, binderCards, handleAddCardsToBinder }}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packs/view-all"
              element={
                <ProtectedRoute>
                  <OpenPacksPage handleAddCardsToBinder={handleAddCardsToBinder} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/binder/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/binder/view"
              element={
                <ProtectedRoute>
                  <UserBinder binderCards={binderCards} sets={sets} isInUserBinder={true} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/card-view"
              element={
                <ProtectedRoute>
                  <ExpandedCardView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
