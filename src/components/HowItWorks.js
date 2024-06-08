import React, { useEffect, useRef } from 'react';
import game from '../assets/game.png';
import packs from '../assets/packs.webp';
import tealMask from '../assets/Teal-Mask-Ogerpon-ex-Twilight-Masquerade.png';
import twltCardPack from '../assets/twlt-card-pack.webp';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const stepsRef = useRef([]);

  useEffect(() => {
    const steps = stepsRef.current;

    const checkSteps = () => {
      const triggerBottom = window.innerHeight * 0.8;

      steps.forEach((step) => {
        const stepTop = step.getBoundingClientRect().top;

        if (stepTop < triggerBottom) {
          step.classList.add('step-visible');
          step.classList.remove('step-hidden');
        } else {
          step.classList.remove('step-visible');
          step.classList.add('step-hidden');
        }
      });
    };

    window.addEventListener('scroll', checkSteps);
    checkSteps(); // Initial check

    return () => {
      window.removeEventListener('scroll', checkSteps);
    };
  }, []);

  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps">
        <div
          className="step left-step step-hidden"
          ref={(el) => (stepsRef.current[0] = el)}
        >
          <img src={game} alt="Sign Up" />
          <div className="text">
            <h3>
              Step 1: <span>Sign Up</span>
            </h3>
            <p>
              Create an account to get started with our platform. Simply sign up
              with your email and choose a username.
            </p>
            <a href="/">Start Your Collection</a>
          </div>
        </div>
        <div
          className="step right-step step-hidden"
          ref={(el) => (stepsRef.current[1] = el)}
        >
          <img src={packs} alt="Browse Packs" />
          <div className="text">
            <h3>
              Step 2: <span>Browse Packs</span>
            </h3>
            <p>
              Explore our wide range of Pokémon card packs from various series.
              Filter by release date or series to find your favorite packs.
            </p>
          </div>
        </div>
        <div
          className="step left-step step-hidden"
          ref={(el) => (stepsRef.current[2] = el)}
        >
          <img src={tealMask} alt="Open Packs" />
          <div className="text">
            <h3>
              Step 3: <span>Open Packs</span>
            </h3>
            <p>
              Experience the excitement of opening digital Pokémon card packs
              with realistic animations and sound effects.
            </p>
          </div>
        </div>
        <div
          className="step right-step step-hidden"
          ref={(el) => (stepsRef.current[3] = el)}
        >
          <img src={twltCardPack} alt="Manage Collection" />
          <div className="text">
            <h3>
              Step 4: <span>Manage Collection</span>
            </h3>
            <p>
              Keep track of your card collection, trade with other users, and
              showcase your rare finds in your profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

