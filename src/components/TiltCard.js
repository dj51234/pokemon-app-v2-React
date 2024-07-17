import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/TiltCard.css';
import grain from '../assets/grain.webp';
import glitter from '../assets/glitter.png';

const TiltCard = ({ src, maxWidth, onAspectRatioCalculated }) => {
    const [aspectRatio, setAspectRatio] = useState(1);
    const [contrast, setContrast] = useState('100%');
    const cardRef = useRef(null);
    const shineRef = useRef(null);
    const glareRef = useRef(null);
    const glitterRef = useRef(null);

    useEffect(() => {
        const cardImage = new Image();
        cardImage.crossOrigin = "Anonymous"; // Handle CORS
        cardImage.src = src;
        cardImage.onload = () => {
            const calculatedAspectRatio = cardImage.width / cardImage.height;
            setAspectRatio(calculatedAspectRatio);
            if (onAspectRatioCalculated) {
                onAspectRatioCalculated(calculatedAspectRatio);
            }
            adjustContrast(cardImage);
        };
        cardImage.onerror = () => {
            console.error("Image failed to load.");
        };
    }, [src, onAspectRatioCalculated]);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const shine = shineRef.current;
        const glare = glareRef.current;
        const glitter = glitterRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const maxTilt = 22;
        const tiltX = (maxTilt * y) / (rect.height / 2);
        const tiltY = (-maxTilt * x) / (rect.width / 2);

        card.classList.add('tilting'); // Add tilting class
        card.classList.add('enhanced-contrast'); // Add contrast class

        requestAnimationFrame(() => {
            card.style.setProperty('--rx', `${tiltX}deg`);
            card.style.setProperty('--ry', `${tiltY}deg`);
            card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);

            shine.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            shine.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            glare.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            glare.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            glitter.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            glitter.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        const shine = shineRef.current;
        const glare = glareRef.current;
        const glitter = glitterRef.current;
        card.classList.remove('tilting'); // Remove tilting class
        card.classList.remove('enhanced-contrast'); // Remove contrast class

        requestAnimationFrame(() => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '50%');
            card.style.transition = 'transform 0.3s ease-out';

            shine.style.setProperty('--mx', '50%');
            shine.style.setProperty('--my', '50%');
            glare.style.setProperty('--pointer-x', '50%');
            glare.style.setProperty('--pointer-y', '50%');
            glitter.style.setProperty('--pointer-x', '50%');
            glitter.style.setProperty('--pointer-y', '50%');
        });
    };

    const adjustContrast = (img) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            let lightPixels = 0;
            let darkPixels = 0;

            for (let i = 0; i < imageData.data.length; i += 4) {
                const [r, g, b] = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                if (brightness > 127.5) {
                    lightPixels++;
                } else {
                    darkPixels++;
                }
            }

            const contrastValue = lightPixels > darkPixels ? '110%' : '100%';
            setContrast(contrastValue);
        } catch (error) {
            console.error("Failed to adjust contrast", error);
        }
    };

    return (
        <div className="tilt-card">
            <div
                className="tilt-card__card"
                ref={cardRef}
                style={{ '--max-width': maxWidth, '--aspect-ratio': `${100 / aspectRatio}%`, borderRadius: '15px', '--contrast': contrast }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="tilt-card__card-inner">
                    <div className="tilt-card__card-face" style={{ backgroundImage: `url(${src})` }} />
                    <div className="tilt-card__card-shine" ref={shineRef} />
                    <div className="tilt-card__card-glare" ref={glareRef} />
                    <div className="tilt-card__card-grain" style={{ backgroundImage: `url(${grain})` }} />
                    <div className="tilt-card__card-glitter" ref={glitterRef} style={{ backgroundImage: `url(${glitter})` }} />
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
