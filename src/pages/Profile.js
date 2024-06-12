// src/pages/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Profile.css';
import { auth } from '../js/firebase';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="profile-container">
      <Header secondary />
      <div className="profile-content">
        <div className="profile-grid-container">
          <a href="/my-binder" className="profile-grid-item"><h2>Binder</h2></a>
          <a href="/open-packs" className="profile-grid-item"><h2>Open Packs</h2></a>
          <a href="/pokedex" className="profile-grid-item"><h2>Browse Cards</h2></a>
          <a href="/trade" className="profile-grid-item"><h2>Trade</h2></a>
          <a href="/settings" className="profile-grid-item"><h2>Settings</h2></a>
          <a href="#logout" className="profile-grid-item" onClick={handleLogout}><h2>Log Out</h2></a>
        </div>
      </div>
      <div className="footer-secondary">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
