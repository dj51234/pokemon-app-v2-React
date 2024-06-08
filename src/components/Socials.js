import React from 'react';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import instagram from '../assets/instagram.png';
import discord from '../assets/discord.png';
import '../styles/Socials.css';

const Socials = () => (
  <section className="socials">
    <h2>Join Our Community</h2>
    <div className="social-links">
      <a href="#"><img src={facebook} alt="Facebook" /></a>
      <a href="#"><img src={twitter} alt="Twitter" /></a>
      <a href="#"><img src={instagram} alt="Instagram" /></a>
      <a href="#"><img src={discord} alt="Discord" /></a>
    </div>
  </section>
);

export default Socials;
