import React, { useState, useEffect, useRef } from 'react';
import defaultImage from '../assets/default-image.png';
import cardTest from '../assets/card-test-1.png';
import '../styles/NormalCard.css';

const NormalCard = () => {
    const [isRotated, setIsRotated] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isInteractMode, setIsInteractMode] = useState(false);
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.src = cardTest;
        img.onload = () => {
            setAspectRatio(img.width / img.height);
        };
    }, []);

    const handleCardClick = () => {
        setIsRotated(!isRotated);
        setIsInteractMode(false); // Reset interact mode when starting rotation
    };

    useEffect(() => {
        const inner = innerRef.current;
        const handleTransitionEnd = () => {
            if (isRotated) {
                setIsInteractMode(true); // Enable interact mode after rotation completes
            }
        };
        inner.addEventListener('transitionend', handleTransitionEnd);
        return () => {
            inner.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [isRotated]);

    const handleMouseEnter = (e) => {
        if (!isInteractMode) return;

        const outer = outerRef.current;
        const rect = outer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const maxTilt = 17;
        const tiltX = (maxTilt * y) / (rect.height / 2);
        const tiltY = (-maxTilt * x) / (rect.width / 2);

        clearTimeout(timeoutRef.current);
        requestAnimationFrame(() => {
            outer.style.setProperty('--rx', `0deg`);
            outer.style.setProperty('--ry', `0deg`);
            outer.style.setProperty('--mx', `50%`);
            outer.style.setProperty('--my', `50%`);
            outer.style.transition = 'transform 0.3s ease-out';
        });

        setTimeout(() => {
            requestAnimationFrame(() => {
                outer.style.setProperty('--rx', `${tiltX}deg`);
                outer.style.setProperty('--ry', `${tiltY}deg`);
                outer.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                outer.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
                outer.style.transition = 'none';
            });
        }, 300);
    };

    const handleMouseMove = (e) => {
        if (!isInteractMode) return;

        const outer = outerRef.current;
        const rect = outer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const maxTilt = 17;
        const tiltX = (maxTilt * y) / (rect.height / 2);
        const tiltY = (-maxTilt * x) / (rect.width / 2);

        requestAnimationFrame(() => {
            outer.style.setProperty('--rx', `${tiltX}deg`);
            outer.style.setProperty('--ry', `${tiltY}deg`);
            outer.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            outer.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
    };

    const handleMouseLeave = () => {
        if (!isInteractMode) return;

        const outer = outerRef.current;
        requestAnimationFrame(() => {
            outer.style.setProperty('--rx', '0deg');
            outer.style.setProperty('--ry', '0deg');
            outer.style.setProperty('--mx', '50%');
            outer.style.setProperty('--my', '50%');
            outer.style.transition = 'transform 0.3s ease-out';
        });
    };

    return (
        <div
            className="normal-card-wrapper"
            style={{ perspective: '1000px' }}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`normal-card-outer ${isRotated ? 'rotated' : ''}`}
                style={{ paddingTop: `${100 / aspectRatio}%` }}
                ref={outerRef}
                onClick={handleCardClick}
            >
                <div className="normal-card-inner" ref={innerRef}>
                    <div className="normal-card-front">
                        <img src={defaultImage} alt="Normal Card Front" />
                    </div>
                    <div className="normal-card-back">
                        <img src={cardTest} alt="Normal Card Back" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NormalCard;
