import { useState, useEffect, useRef } from 'react';

const useCountUp = (finalValue, duration = 1000, placeholder = 100) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(placeholder);
  const animationRef = useRef(null);

  useEffect(() => {
    let start = 0;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const increment = Math.ceil(target / (duration / 16.67)); // Roughly 60 frames per second

      start += increment;
      if (start > target) start = target;
      setCount(start);

      if (progress < duration && start < target) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration]);

  useEffect(() => {
    if (finalValue !== undefined) {
      setTarget(finalValue);
    }
  }, [finalValue]);

  return count;
};

export default useCountUp;