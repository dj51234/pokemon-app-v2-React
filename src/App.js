import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import OpenPacksPage from './pages/OpenPacksPage'
import ExpandedCardView from './components/ExpandedCardView'
import './index.css'

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/packs/view-all" element={<OpenPacksPage />} />
          <Route path="/card-view" element={<ExpandedCardView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
