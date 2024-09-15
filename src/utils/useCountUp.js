import { useState, useEffect, useRef } from 'react';

const useCountUp = (finalValue, duration = 1000, placeholder = 100) => {
  const getInitialCount = (value) => {
    if (value === undefined) return placeholder;
    if (value > 1000) return Math.max(1000, value * 0.8);
    return Math.min(placeholder, value);
  };

  const [count, setCount] = useState(() => getInitialCount(finalValue));
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const previousFinalValue = useRef(getInitialCount(finalValue));

  useEffect(() => {
    let isMounted = true;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      
      let targetValue = finalValue !== undefined ? finalValue : previousFinalValue.current * 1.2;
      let startValue = previousFinalValue.current;

      const difference = targetValue - startValue;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(percentage);

      const currentValue = Math.round(startValue + difference * easedProgress);
      
      if (isMounted) {
        setCount(currentValue);
      }

      if (percentage < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (finalValue !== undefined) {
        previousFinalValue.current = finalValue;
        startTimeRef.current = null;
        if (currentValue !== finalValue) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finalValue, duration]);

  return count;
};

export default useCountUp;