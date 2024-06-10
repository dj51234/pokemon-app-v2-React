// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
import Login from './pages/Login';
import Register from './pages/Register'; // Updated import
import './index.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokedex" element={<Pokedex />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} /> {/* Updated route */}
    </Routes>
  </Router>
);

export default App;
