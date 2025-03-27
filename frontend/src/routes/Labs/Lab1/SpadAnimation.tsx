// src/routes/Labs/Lab1/SpadAnimation.tsx
import React, { useState, useEffect } from 'react';

export const SpadAnimation = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev,
        { x: Math.random() * 100, y: Math.random() * 100 }
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      {particles.map((particle, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            width: '10px',
            height: '10px',
            backgroundColor: '#ff6600',
            borderRadius: '50%',
            animation: 'avalancheEffect 1s ease-out infinite'
          }}
        />
      ))}
    </div>
  );
};
