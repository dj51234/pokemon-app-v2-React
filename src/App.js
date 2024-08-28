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
import ExpandedCardView from './components/ExpandedCardView'; // Import the ExpandedCardView component
import { auth, firestore } from './js/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './index.css';
import { fetchUserSets } from './js/api';
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
  
          // Set the sets from the Firestore document if available
          if (userData.sets) {
            setSets(userData.sets);
          } else {
            setSets([]); // Default to an empty array if no sets are found
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
    // Combine the existing binder cards with the new cards
    const updatedBinderCards = [...binderCards, ...newCards];
  
    // Update Firestore with the new binder and totalCards count
    if (currentUser) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
  
      try {
        await updateDoc(userDocRef, {
          binder: updatedBinderCards,
          totalCards: updatedBinderCards.length,  // Update totalCards to reflect the new length of the binder array
        });
  
        // Update the local state with the new cards
        setBinderCards(updatedBinderCards);
  
        // Fetch sets based on the updated binder cards
        const updatedSets = await fetchUserSets(updatedBinderCards);
        console.log(updatedSets)
        setSets(updatedSets);
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
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
