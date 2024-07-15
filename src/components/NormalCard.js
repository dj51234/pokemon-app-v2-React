import React, { useState, useEffect, useRef } from 'react';
import '../styles/NormalCard.css';

const NormalCard = ({ isFlipped, frontImage, backImage, onCardClick }) => {
    const [isRotated, setIsRotated] = useState(isFlipped);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isInteractMode, setIsInteractMode] = useState(false);
    const [borderRadius, setBorderRadius] = useState('15px');
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const shineRef = useRef(null);
    const glareRef = useRef(null);
    const glitterRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.src = frontImage || backImage;
        img.onload = () => {
            setAspectRatio(img.width / img.height);
            calculateBorderRadius(img);
        };
        img.onerror = () => {
            console.error("Image failed to load.");
        };
    }, [frontImage, backImage]);

    useEffect(() => {
        setIsRotated(isFlipped);
    }, [isFlipped]);

    useEffect(() => {
        const inner = innerRef.current;
        const handleTransitionEnd = () => {
            if (isRotated) {
                setIsInteractMode(true);
            }
        };
        inner.addEventListener('transitionend', handleTransitionEnd);
        return () => {
            inner.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [isRotated]);

    const handleMouseMove = (e) => {
        if (!isInteractMode) return;

        const outer = outerRef.current;
        const shine = shineRef.current;
        const glare = glareRef.current;
        const glitter = glitterRef.current;
        const rect = outer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const maxTilt = 22;
        const tiltX = (maxTilt * y) / (rect.height / 2);
        const tiltY = (-maxTilt * x) / (rect.width / 2);

        outer.classList.add('tilting'); // Add tilting class

        requestAnimationFrame(() => {
            outer.style.setProperty('--rx', `${tiltX}deg`);
            outer.style.setProperty('--ry', `${tiltY}deg`);
            outer.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            outer.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);

            shine.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            shine.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            glare.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            glare.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            glitter.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            glitter.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
    };

    const handleMouseLeave = () => {
        if (!isInteractMode) return;

        const outer = outerRef.current;
        const shine = shineRef.current;
        const glare = glareRef.current;
        const glitter = glitterRef.current;
        outer.classList.remove('tilting'); // Remove tilting class

        requestAnimationFrame(() => {
            outer.style.setProperty('--rx', '0deg');
            outer.style.setProperty('--ry', '0deg');
            outer.style.setProperty('--mx', '50%');
            outer.style.setProperty('--my', '50%');
            outer.style.transition = 'transform 0.3s ease-out';

            shine.style.setProperty('--mx', '50%');
            shine.style.setProperty('--my', '50%');
            glare.style.setProperty('--pointer-x', '50%');
            glare.style.setProperty('--pointer-y', '50%');
            glitter.style.setProperty('--pointer-x', '50%');
            glitter.style.setProperty('--pointer-y', '50%');
        });
    };

    const calculateBorderRadius = (img) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Analyze the transparency in the corners to determine the border radius
            const threshold = 0.1; // Transparency threshold to determine the edge
            const sampleSize = 10; // Number of pixels to sample from the corners

            let radius = 0;

            for (let y = 0; y < sampleSize; y++) {
                for (let x = 0; x < sampleSize; x++) {
                    const pixelData = ctx.getImageData(x, y, 1, 1).data;
                    if (pixelData[3] / 255 > threshold) {
                        radius = Math.max(radius, Math.sqrt(x * x + y * y));
                    }
                }
            }

            setBorderRadius(`${radius}px`);
        } catch (error) {
            console.error("Failed to calculate border radius", error);
        }
    };

    return (
        <div
            className="normal-card-wrapper"
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`normal-card-outer ${isRotated ? 'rotated' : ''}`}
                style={{ paddingTop: `${100 / aspectRatio}%`, borderRadius: borderRadius }}
                ref={outerRef}
                onClick={onCardClick}
            >
                <div className="normal-card-inner" ref={innerRef}>
                    <div className="normal-card-front">
                        <img src={backImage} alt="Normal Card Front" />
                    </div>
                    <div className="normal-card-back">
                        <img src={frontImage} alt="Normal Card Back" />
                        <div className="shine" ref={shineRef}></div>
                        <div className="glare" ref={glareRef}></div>
                        <div className="grain"></div>
                        <div className="glitter" ref={glitterRef}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NormalCard;
