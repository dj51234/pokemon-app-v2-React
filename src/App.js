// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OpenPacksPage from './pages/OpenPacksPage'; // Import the new page
import Sidebar from './components/Sidebar'; // Make sure to include Sidebar
import { auth, firestore } from './js/firebase';
import './index.css';
import { doc, getDoc } from 'firebase/firestore';
// Import your pack algorithm script
import { openPack } from './js/pack_algorithm/packAlgorithm';
// import { fetchAndGroupCardsForAllSets } from './js/pack_algorithm/fetchAllSetData'; // uncomment to fetch new full set data json

export const AuthContext = React.createContext();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileColor, setProfileColor] = useState('#ffffff'); // Default color

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.profileColor) {
            setProfileColor(userData.profileColor);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, profileColor }}>
      <Router>
        <div className="app">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/open-packs" element={<OpenPacksPage />} /> {/* Add the new route */}
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
