import React from 'react';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import HowItWorks from '../components/HowItWorks';
import Socials from '../components/Socials';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => (
  <div className="app">
    <Hero />
    <InfoSection />
    <HowItWorks />
    <Socials />
    <Footer />
  </div>
);

export default Home;