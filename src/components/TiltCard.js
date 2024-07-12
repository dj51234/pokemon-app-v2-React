// src/components/TiltCard.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
`;

const Card = styled.div`
  width: 100%;
  max-width: ${(props) => props.maxWidth || '300px'};
  --tx: 0px;
  --ty: 0px;
  --rx: 0deg;
  --ry: 0deg;
  --mx: 50%;
  --my: 50%;
  transform: translate3d(var(--tx), var(--ty), 0) rotateY(var(--ry)) rotateX(var(--rx));
  will-change: transform;
  position: relative;
`;

const CardInner = styled.div`
  width: 100%;
  position: relative;
  transform-style: preserve-3d;
  box-shadow: 0px 10px 20px -5px black;
  &::before {
    content: '';
    display: block;
    padding-top: ${(props) => props.aspectRatio * 100}%;
  }
`;

const CardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.src});
`;

const CardShine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.8), transparent);
  mix-blend-mode: overlay;
  pointer-events: none;
  border-radius: 20px;
`;

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
    const maxTilt = 15;
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
    <CardWrapper>
      <Card
        ref={cardRef}
        maxWidth={maxWidth}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CardInner aspectRatio={aspectRatio}>
          <CardFace src={src} />
          <CardShine />
        </CardInner>
      </Card>
    </CardWrapper>
  );
};

TiltCard.propTypes = {
  src: PropTypes.string.isRequired,
  maxWidth: PropTypes.string,
  onAspectRatioCalculated: PropTypes.func,
};

export default TiltCard;
