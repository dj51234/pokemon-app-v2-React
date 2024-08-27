import React, { useState, useEffect, useRef } from 'react';
import '../styles/NormalCard.css';
import OverlayCard from './OverlayCard'; 

const NormalCard = React.forwardRef(({
  isFlipped, 
  frontImage, 
  backImage, 
  onCardClick, 
  rarity, 
  subtypes, 
  setId, 
  supertypes, 
  startInteractive, 
  zIndex, 
  isTopCard, 
  applyBoxShadow, 
  isInteractable, 
  heroCard, 
  id,
  isInUserBinder,
  selectedSetId,
  isInCardOverlay
}, ref) => {
  const [isRotated, setIsRotated] = useState(isFlipped);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isInteractMode, setIsInteractMode] = useState(startInteractive);
  const [contrast, setContrast] = useState('100%');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [boxShadow, setBoxShadow] = useState('');
  const [transitionBoxShadow, setTransitionBoxShadow] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); 

  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const shineRef = useRef(null);
  const glareRef = useRef(null);
  const glitterRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = frontImage || backImage;
    img.onload = () => {
      const aspectRatioValue = img.width / img.height;
      setAspectRatio(aspectRatioValue);
      document.documentElement.style.setProperty('--card-aspect-ratio', `${aspectRatioValue}`);
      adjustContrast(img);
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Image failed to load.");
    };
  }, [frontImage, backImage]);

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

  useEffect(() => {
    if (applyBoxShadow) {
      switch (rarity) {
        case 'ace spec rare':
          setBoxShadow('0 0 1px -1px #F700C1, 0 0 3px 1px #F700C1, 0 0 12px 2px #F700C1, 0px 10px 20px -5px black, 0 0 20px -30px #F700C1, 0 0 50px -20px #F700C1');
          break;
        case 'double rare':
          setBoxShadow('0 0 1px -1px white, 0 0 3px 1px white, 0 0 12px 2px white, 0px 10px 20px -5px black, 0 0 20px -30px white, 0 0 50px -20px white');
          break;
        case 'hyper rare':
          setBoxShadow('0 0 1px -1px #FFD913, 0 0 3px 1px #FFD913, 0 0 12px 2px #FFD913, 0px 10px 20px -5px black, 0 0 20px -30px #FFD913, 0 0 50px -20px #FFD913');
          break;
        case 'rare holo':
          setBoxShadow('0 0 1px -1px white, 0 0 3px 1px white, 0 0 12px 2px white, 0px 10px 20px -5px black, 0 0 20px -30px white, 0 0 50px -20px white');
          break;
        case 'rare secret':
          setBoxShadow('0 0 1px -1px #FFD913, 0 0 3px 1px #FFD913, 0 0 12px 2px #FFD913, 0px 10px 20px -5px black, 0 0 20px -30px #FFD913, 0 0 50px -20px #FFD913');
          break;
        case 'rare rainbow':
          setBoxShadow('0 0 1px -1px rgb(255, 56, 6), 0 0 3px 1px rgb(0, 110, 255), 0 0 12px 2px rgb(66, 255, 66), 0px 10px 20px -5px rgb(255, 51, 0), 0 0 20px -30px rgb(58, 255, 58), 0 0 50px -20px rgb(255, 80, 80)');
          break;
        case 'rare ultra':
          setBoxShadow('0 0 1px -1px white, 0 0 3px 1px white, 0 0 12px 2px white, 0px 10px 20px -5px black, 0 0 20px -30px white, 0 0 50px -20px white');
          break;
        case 'rare holo vmax':
          setBoxShadow('0 0 1px -1px white, 0 0 3px 1px white, 0 0 12px 2px white, 0px 10px 20px -5px black, 0 0 20px -30px white, 0 0 50px -20px white');
          break;
        case 'rare holo v':
          setBoxShadow('0 0 1px -1px white, 0 0 3px 1px white, 0 0 12px 2px white, 0px 10px 20px -5px black, 0 0 20px -30px white, 0 0 50px -20px white');
          break;
        default:
          setBoxShadow('0 0 1px -1px white, 0 0 3px 1px white, 0 0 12px 2px white, 0px 10px 20px -5px black, 0 0 20px -30px white, 0 0 50px -20px white');
      }
      setTransitionBoxShadow(true);
    } else {
      setBoxShadow('');
      setTransitionBoxShadow(false);
    }
  }, [applyBoxShadow, rarity]);

  useEffect(() => {
    if (shineRef.current) {
      shineRef.current.style.setProperty('--mx', '50%');
      shineRef.current.style.setProperty('--my', '50%');
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty('--pointer-x', '50%');
      glareRef.current.style.setProperty('--pointer-y', '50%');
    }
    if (glitterRef.current) {
      glitterRef.current.style.setProperty('--pointer-x', '50%');
      glitterRef.current.style.setProperty('--pointer-y', '50%');
    }
    document.documentElement.style.setProperty('--contrast', contrast);
  }, [contrast]);

  const handleMouseMove = (e) => {
    if (!isInteractMode || !isFlipped || !isRotated || (!isInteractable && !heroCard) || !outerRef.current) return;

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

    outer.classList.add('tilting');

    requestAnimationFrame(() => {
      outer.style.setProperty('--rx', `${tiltX}deg`);
      outer.style.setProperty('--ry', `${tiltY}deg`);
      outer.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      outer.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);

      if (shine) {
        shine.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        shine.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }
      if (glare) {
        glare.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        glare.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }
      if (glitter) {
        glitter.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        glitter.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }
    });
  };

  const handleMouseLeave = () => {
    if (!isInteractMode || !isFlipped || !isRotated || !outerRef.current) return;

    const outer = outerRef.current;
    const shine = shineRef.current;
    const glare = glareRef.current;
    const glitter = glitterRef.current;
    outer.classList.remove('tilting');

    requestAnimationFrame(() => {
      outer.style.setProperty('--rx', '0deg');
      outer.style.setProperty('--ry', '0deg');
      outer.style.setProperty('--mx', '50%');
      outer.style.setProperty('--my', '50%');
      outer.style.transition = 'transform 0.3s ease-out';

      if (shine) {
        shine.style.setProperty('--mx', '50%');
        shine.style.setProperty('--my', '50%');
      }
      if (glare) {
        glare.style.setProperty('--pointer-x', '50%');
        glare.style.setProperty('--pointer-y', '50%');
      }
      if (glitter) {
        glitter.style.setProperty('--pointer-x', '50%');
        glitter.style.setProperty('--pointer-y', '50%');
      }
    });
  };

  const handleCardClick = (e) => {
    if (isInCardOverlay) {  // Check if the card is in the overlay
      console.log('clicked');
    }

    if (isInUserBinder) {
      setIsOverlayOpen(true); 
    }

    if (outerRef.current) {
      const outer = outerRef.current;
      outer.classList.remove('tilting');
      outer.style.setProperty('--rx', '0deg');
      outer.style.setProperty('--ry', '0deg');
      outer.style.setProperty('--mx', '50%');
      outer.style.setProperty('--my', '50%');

      if (shineRef.current) {
        shineRef.current.style.setProperty('--mx', '50%');
        shineRef.current.style.setProperty('--my', '50%');
      }
      if (glareRef.current) {
        glareRef.current.style.setProperty('--pointer-x', '50%');
        glareRef.current.style.setProperty('--pointer-y', '50%');
      }
      if (glitterRef.current) {
        glitterRef.current.style.setProperty('--pointer-x', '50%');
        glitterRef.current.style.setProperty('--pointer-y', '50%');
      }
    }

    if (onCardClick) {
      onCardClick(e);
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

      const contrastValue = lightPixels > darkPixels ? '115%' : '115%';
      setContrast(contrastValue);
      document.documentElement.style.setProperty('--contrast', contrastValue);
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
    <>
      {isOverlayOpen && (
        <OverlayCard cardProps={{
          isFlipped,
          frontImage,
          backImage,
          rarity,
          subtypes,
          setId,
          supertypes,
          startInteractive,
          zIndex,
          isTopCard,
          applyBoxShadow,
          isInteractable,
          heroCard,
          id,
        }} onClose={() => setIsOverlayOpen(false)} />
      )}
      {imageLoaded && (
        <div
          className={`normal-card-wrapper ${isTopCard && isFlipped ? getRarityClass() : ''}`}
          style={{ perspective: '1000px', zIndex }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-rarity={rarity}
          data-subtypes={Array.isArray(subtypes) ? subtypes.join(',').toLowerCase() : (subtypes || '').toLowerCase()}
          data-set={setId}
          data-supertypes={formatSupertypes(supertypes)}
          data-id={id}
          data-selected-set-id={selectedSetId ? selectedSetId : undefined}
        >
          <div
            className={`normal-card-outer ${isRotated ? 'rotated' : ''} ${transitionBoxShadow ? 'box-shadow-transition' : ''}`}
            style={{ paddingTop: `${100 / aspectRatio}%`, boxShadow, filter: `contrast(${contrast})`, transition: 'transform 0.3s ease-out' }}
            ref={ref || outerRef} 
            onClick={handleCardClick}
          >
            <div className="normal-card-inner" ref={innerRef}>
              <div className="normal-card-front">
                <img src={backImage} alt="" />
              </div>
              <div className="normal-card-back">
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
      )}
    </>
  );
});

export default NormalCard;
