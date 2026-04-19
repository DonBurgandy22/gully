import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

type EnergyParticlesProps = {
  intensity: number;
  color: string;
};

export const EnergyParticles: React.FC<EnergyParticlesProps> = ({ intensity, color }) => {
  const frame = useCurrentFrame();

  if (intensity <= 0) return null;

  // Ground cracks/energy burst
  const cracks = [];
  const crackCount = 12;

  for (let i = 0; i < crackCount; i++) {
    const angle = (i / crackCount) * Math.PI * 2;
    const length = 50 + intensity * 100 + Math.sin(frame * 0.1 + i) * 20;
    const width = 2 + intensity * 3;

    cracks.push(
      <div
        key={`crack-${i}`}
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          width: length,
          height: width,
          background: `linear-gradient(to right, ${color}, transparent)`,
          transformOrigin: 'left center',
          transform: `rotate(${angle}rad)`,
          opacity: intensity * 0.7,
          filter: 'blur(1px)',
        }}
      />
    );
  }

  // Floating energy particles
  const floatingParticles = [];
  const particleCount = Math.floor(intensity * 50);

  for (let i = 0; i < particleCount; i++) {
    const seed = i * 137.508; // Golden angle for distribution
    const baseX = Math.sin(seed) * 200;
    const baseY = Math.cos(seed * 0.7) * 250;

    // Particles rise and converge toward center
    const riseSpeed = (frame * 0.5 + i * 10) % 200;
    const convergeFactor = riseSpeed / 200;

    const x = baseX * (1 - convergeFactor * 0.8);
    const y = baseY - riseSpeed + 100;

    const size = 3 + Math.sin(seed) * 2;
    const opacity = (1 - convergeFactor) * intensity * 0.8;

    if (opacity > 0.05) {
      floatingParticles.push(
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            width: size,
            height: size,
            background: color,
            borderRadius: '50%',
            opacity,
            boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
        />
      );
    }
  }

  // Lightning bolts
  const lightningBolts = [];
  const boltCount = Math.floor(intensity * 5);

  for (let i = 0; i < boltCount; i++) {
    const boltFrame = (frame + i * 17) % 30;
    if (boltFrame < 5) {
      const startX = -100 + Math.sin(i * 3.7) * 150;
      const startY = -200;

      // Generate zigzag path
      let pathD = `M ${startX} ${startY}`;
      let currentX = startX;
      let currentY = startY;

      for (let j = 0; j < 5; j++) {
        currentX += (Math.random() - 0.5) * 40;
        currentY += 40;
        pathD += ` L ${currentX} ${currentY}`;
      }

      lightningBolts.push(
        <svg
          key={`lightning-${i}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
            opacity: (5 - boltFrame) / 5,
          }}
          width="400"
          height="500"
        >
          <path
            d={pathD}
            stroke={color}
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      );
    }
  }

  // Shockwave rings
  const shockwaves = [];
  const shockwaveCount = 3;

  for (let i = 0; i < shockwaveCount; i++) {
    const shockwaveFrame = (frame + i * 20) % 60;
    const scale = 1 + shockwaveFrame * 0.05;
    const opacity = Math.max(0, (1 - shockwaveFrame / 60) * intensity * 0.5);

    if (opacity > 0) {
      shockwaves.push(
        <div
          key={`shockwave-${i}`}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 70,
            width: 200 * scale,
            height: 30 * scale,
            border: `2px solid ${color}`,
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            opacity,
            filter: 'blur(1px)',
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {cracks}
      {floatingParticles}
      {lightningBolts}
      {shockwaves}
    </div>
  );
};
