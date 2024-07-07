// src/components/AnimatedGridItem.js
import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import '../styles/OpenPacksPage.css';
import { easeCubicInOut, easeElasticInOut, easeBackInOut, easeBounceInOut } from 'd3-ease';

const easingFunctions = {
  easeCubicInOut,
  easeElasticInOut,
  easeBackInOut,
  easeBounceInOut,
};

// Change this to try different easing functions
const selectedEasingFunction = easingFunctions.easeBackInOut;

const AnimatedGridItem = ({ set, isActive, onClick, id }) => {
  const itemRef = useRef(null);
  const [itemPosition, setItemPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [viewportCenter, setViewportCenter] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 + window.scrollY,
  });
  const [animating, setAnimating] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        setItemPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const updateViewportCenter = () => {
      setViewportCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + window.scrollY,
      });
    };

    updatePosition();
    updateViewportCenter();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updateViewportCenter);
    window.addEventListener('resize', updateViewportCenter);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updateViewportCenter);
      window.removeEventListener('resize', updateViewportCenter);
    };
  }, [itemRef, isActive]);

  useEffect(() => {
    if (isActive) {
      const timeout = setTimeout(() => setHighlighted(true), 0); // Delay for 0.5 seconds
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setHighlighted(false), 200); // Delay for 0.5 seconds
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  const deltaX = viewportCenter.x - itemPosition.left - itemPosition.width / 2;
  const deltaY = viewportCenter.y - itemPosition.top - itemPosition.height / 2;

  const calculateScale = () => {
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 960) {
      return 2; // Use a fixed scale for larger screens
    }

    const viewportHeight = window.innerHeight;

    // Calculate the scale based on the smaller dimension of the viewport
    const scaleX = viewportWidth * 0.8 / itemPosition.width;
    const scaleY = viewportHeight * 0.8 / itemPosition.height;

    return Math.min(scaleX, scaleY);
  };

  const [zIndex, setZIndex] = useState(1);

  const springProps = useSpring({
    transform: isActive
      ? `translate(${deltaX}px, ${deltaY}px) scale(${calculateScale()})`
      : `translate(0px, 0px) scale(1)`,
    config: {
      tension: 200,
      friction: 15,
      duration: 550,
      easing: selectedEasingFunction,
    },
    onStart: () => {
      setZIndex(10); // Keep the z-index high during animation
      setAnimating(true);
    },
    onRest: () => {
      setAnimating(false);
      if (!isActive) {
        setTimeout(() => setZIndex(1), 500); // Delay resetting z-index to match animation duration
      }
    },
  });

  return (
    <animated.div
      ref={itemRef}
      className={`open-packs-page-grid-item ${highlighted ? 'highlighted' : ''}`}
      style={{
        zIndex: isActive || animating ? 10 : zIndex, // Ensure z-index remains high while active
        ...springProps,
      }}
      onClick={() => onClick(id)}
    >
      {highlighted && <div className="pulsing-text">Open Pack</div>}
      <img
        src={set.images.logo}
        className={`logo ${isActive ? 'expanded' : ''}`}
        alt={`${set.name} logo`}
      />
      <div className="set-info">
        <img
          src={set.images.symbol}
          className={`symbol ${isActive ? 'hidden' : ''}`}
          alt={`${set.name} symbol`}
        />
        <h2>{set.name}</h2>
      </div>
      <p>Release date: {set.releaseDate}</p>
      <p>ID: {set.id}</p>
    </animated.div>
  );
};

export default AnimatedGridItem;
