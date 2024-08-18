// src/App.js
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
import { auth, firestore } from './js/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './index.css';
import { fetchUserSets } from './js/api'; // Import the function to fetch set data
import ProtectedRoute from './ProtectedRoute';

export const AuthContext = React.createContext();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileColor, setProfileColor] = useState('#ffffff'); // Default color
  const [binderCards, setBinderCards] = useState([]); // State for binder cards
  const [sets, setSets] = useState([]); // State for sets

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
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
          }
        }
      } else {
        // Clear state when user logs out
        setCurrentUser(null);
        setBinderCards([]);
        setSets([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddCardsToBinder = async (newCards) => {
    // Update Firestore (already handled in Overlay)
    // Update the local state with the new cards
    const updatedBinderCards = [
      ...binderCards,
      ...newCards
    ];

    setBinderCards(updatedBinderCards);

    // Optionally, you can also update sets if necessary
    const updatedSets = await fetchUserSets(updatedBinderCards);
    setSets(updatedSets);
  };

  return (
    <AuthContext.Provider value={{ currentUser, profileColor, handleAddCardsToBinder }}>
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
                  <UserBinder binderCards={binderCards} sets={sets} /> {/* Pass binder cards and sets as props */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/binder/organize"
              element={
                <ProtectedRoute>
                  {/* Your organize component */}
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
