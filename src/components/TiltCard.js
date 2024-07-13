import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/TiltCard.css';
import grain from '../assets/grain.webp';

const TiltCard = ({ src, maxWidth, onAspectRatioCalculated }) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const cardImage = new Image();
    cardImage.src = src;
    cardImage.onload = () => {
      const calculatedAspectRatio = cardImage.height / cardImage.width;
      setAspectRatio(calculatedAspectRatio);
      if (onAspectRatioCalculated) {
        onAspectRatioCalculated(calculatedAspectRatio);
      }
    };
  }, [src, onAspectRatioCalculated]);

  const handleMouseEnter = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 17;
    const tiltX = (maxTilt * y) / (rect.height / 2);
    const tiltY = (-maxTilt * x) / (rect.width / 2);

    clearTimeout(timeoutRef.current);
    requestAnimationFrame(() => {
      card.style.setProperty('--rx', `0deg`);
      card.style.setProperty('--ry', `0deg`);
      card.style.setProperty('--mx', `50%`);
      card.style.setProperty('--my', `50%`);
      card.style.transition = 'transform 0.3s ease-out';
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        card.style.setProperty('--rx', `${tiltX}deg`);
        card.style.setProperty('--ry', `${tiltY}deg`);
        card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        card.style.transition = 'none';
      });
    }, 300);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 17;
    const tiltX = (maxTilt * y) / (rect.height / 2);
    const tiltY = (-maxTilt * x) / (rect.width / 2);

    requestAnimationFrame(() => {
      card.style.setProperty('--rx', `${tiltX}deg`);
      card.style.setProperty('--ry', `${tiltY}deg`);
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    requestAnimationFrame(() => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.style.transition = 'transform 0.3s ease-out';
    });
  };

  return (
    <div className="tilt-card">
      <div
        className="tilt-card__card"
        ref={cardRef}
        style={{ '--max-width': maxWidth, '--aspect-ratio': aspectRatio * 100 + '%' }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="tilt-card__card-inner">
          <div className="tilt-card__card-face" style={{ backgroundImage: `url(${src})` }} />
          <div className="tilt-card__card-shine card-shine" />
          <div className="tilt-card__card-grain card-grain" style={{ backgroundImage: `url(${grain})` }} />
        </div>
      </div>
    </div>
  );
};

TiltCard.propTypes = {
  src: PropTypes.string.isRequired,
  maxWidth: PropTypes.string,
  onAspectRatioCalculated: PropTypes.func,
};

export default TiltCard;
