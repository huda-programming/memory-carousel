import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CountdownLoader = ({ onComplete }) => {
  const gridRef = useRef(null);

  // koordinat titik-titik heart (10x10 grid)
  const heartCoords = [
    [false,false,true,true,false,true,true,false,false,false],
    [false,true,true,true,true,true,true,true,false,false],
    [true,true,true,true,true,true,true,true,true,false],
    [true,true,true,true,true,true,true,true,true,true],
    [false,true,true,true,true,true,true,true,true,false],
    [false,false,true,true,true,true,true,true,false,false],
    [false,false,false,true,true,true,true,false,false,false],
    [false,false,false,false,true,true,false,false,false,false],
    [false,false,false,false,false,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
  ];

  useEffect(() => {
    const offset = 0.02;
    const circles = gsap.utils.toArray('.grid circle');

    gsap.set('svg', { visibility: 'visible' });

    const tl = gsap.timeline({
      onComplete: onComplete,
      defaults: { duration: 0.5, ease: 'linear' }
    });

    circles.forEach((circle, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const isHeart = heartCoords[row][col];
      tl.to(circle, { fill: isHeart ? '#FF4D6D' : '#222', stagger: offset }, 0);
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <svg
        ref={gridRef}
        width="200"
        height="200"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="grid">
          {Array.from({ length: 100 }).map((_, i) => (
            <circle
              key={i}
              cx={(i % 10) + 0.5}
              cy={Math.floor(i / 10) + 0.5}
              r="0.4"
              fill="#222"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default CountdownLoader;
