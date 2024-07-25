import React, { useState, useEffect, useRef } from 'react';
import '../styles/NormalCard.css';

const NormalCard = ({ isFlipped, frontImage, backImage, onCardClick, rarity, subtypes, setId, supertypes, startInteractive, zIndex, isTopCard }) => {
  const [isRotated, setIsRotated] = useState(isFlipped);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isInteractMode, setIsInteractMode] = useState(startInteractive);
  const [borderRadius, setBorderRadius] = useState('0px');
  const [contrast, setContrast] = useState('100%');
  const [imageLoaded, setImageLoaded] = useState(false);
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
      const aspectRatioValue = img.width / img.height;
      setAspectRatio(aspectRatioValue);
      document.documentElement.style.setProperty('--card-aspect-ratio', `${aspectRatioValue}`);
      calculateBorderRadius(img);
      if (isFlipped) {
        adjustContrast(img);
      }
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Image failed to load.");
    };
  }, [frontImage, backImage, isFlipped]);

  useEffect(() => {
    setIsRotated(isFlipped);
  }, [isFlipped]);

  useEffect(() => {
    if (innerRef.current) {
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
    }
  }, [isRotated]);

  const handleMouseMove = (e) => {
    if (!isInteractMode || !isFlipped || !isRotated) return;

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
      if (glitter) {
        glitter.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        glitter.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }
    });
  };

  const handleMouseLeave = () => {
    if (!isInteractMode || !isFlipped || !isRotated) return;

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
      outer.style.transition = 'transform 0.3s ease-out, box-shadow 0.5s ease;';

      shine.style.setProperty('--mx', '50%');
      shine.style.setProperty('--my', '50%');
      glare.style.setProperty('--pointer-x', '50%');
      glare.style.setProperty('--pointer-y', '50%');
      if (glitter) {
        glitter.style.setProperty('--pointer-x', '50%');
        glitter.style.setProperty('--pointer-y', '50%');
      }
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
      const threshold = 10; // Transparency threshold to determine the edge
      const sampleSize = 50; // Number of pixels to sample from the corners
      const transparentPixelCount = {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0
      };

      // Function to check if a pixel is transparent
      const isTransparent = (pixelData) => pixelData[3] < threshold;

      // Check top left corner
      for (let y = 0; y < sampleSize; y++) {
        for (let x = 0; x < sampleSize; x++) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;
          if (isTransparent(pixelData)) {
            transparentPixelCount.topLeft++;
          }
        }
      }

      // Check top right corner
      for (let y = 0; y < sampleSize; y++) {
        for (let x = img.width - sampleSize; x < img.width; x++) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;
          if (isTransparent(pixelData)) {
            transparentPixelCount.topRight++;
          }
        }
      }

      // Check bottom left corner
      for (let y = img.height - sampleSize; y < img.height; y++) {
        for (let x = 0; x < sampleSize; x++) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;
          if (isTransparent(pixelData)) {
            transparentPixelCount.bottomLeft++;
          }
        }
      }

      // Check bottom right corner
      for (let y = img.height - sampleSize; y < img.height; y++) {
        for (let x = img.width - sampleSize; x < img.width; x++) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;
          if (isTransparent(pixelData)) {
            transparentPixelCount.bottomRight++;
          }
        }
      }

      // Determine the border radius based on the amount of transparent pixels
      const totalTransparentPixels = transparentPixelCount.topLeft + transparentPixelCount.topRight + transparentPixelCount.bottomLeft + transparentPixelCount.bottomRight;
      const borderRadiusValue = totalTransparentPixels > 0 ? '22px' : '0px';

      setBorderRadius(borderRadiusValue);
    } catch (error) {
      console.error("Failed to calculate border radius", error);
    }
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

  const formatSupertypes = (supertypes) => {
    if (Array.isArray(supertypes)) {
      return supertypes.map(type => type.toLowerCase().replace('pokémon', 'pokemon')).join(',');
    } else if (supertypes) {
      return supertypes.toLowerCase().replace('pokémon', 'pokemon');
    } else {
      return '';
    }
  };

  const getRarityClass = () => {
    if (!rarity) return '';
    return rarity.toLowerCase().replace(/ /g, '-');
  };

  return (
    imageLoaded && (
      <div
        className={`normal-card-wrapper ${isTopCard && isFlipped ? getRarityClass() : ''}`}
        style={{ perspective: '1000px', zIndex }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-rarity={rarity}
        data-subtypes={Array.isArray(subtypes) ? subtypes.join(',').toLowerCase() : (subtypes || '').toLowerCase()}
        data-set={setId}
        data-supertypes={formatSupertypes(supertypes)}
      >
        <div
          className={`normal-card-outer ${isRotated ? 'rotated' : ''}`}
          style={{ paddingTop: `${100 / aspectRatio}%`, borderRadius: borderRadius}}
          ref={outerRef}
          onClick={onCardClick}
        >
          <div className="normal-card-inner" ref={innerRef}>
            <div className="normal-card-front" style={{ borderRadius }}>
              <img src={backImage} alt="Normal Card Front" />
            </div>
            <div className="normal-card-back" style={{ borderRadius }}>
              <img src={frontImage} alt="Normal Card Back" />
              <div className="shine" ref={shineRef}></div>
              <div className="glare" ref={glareRef}></div>
              <div className="grain"></div>
              {['common', 'uncommon'].includes(rarity) && (
                <div className="glitter" ref={glitterRef}></div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NormalCard;
