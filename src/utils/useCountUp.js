import { useState, useEffect } from 'react';

const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(end / (duration / 16.67)); // Roughly 60 frames per second
    const step = () => {
      start += increment;
      if (start > end) start = end;
      setCount(start);
      if (start < end) {
        requestAnimationFrame(step);
      }
    };

    step();
  }, [end, duration]);

  return count;
};

export default useCountUp;