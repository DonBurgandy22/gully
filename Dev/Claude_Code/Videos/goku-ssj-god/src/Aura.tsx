import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

type AuraProps = {
  intensity: number;
  color: string;
  secondaryColor: string;
};

export const Aura: React.FC<AuraProps> = ({ intensity, color, secondaryColor }) => {
  const frame = useCurrentFrame();

  if (intensity <= 0) return null;

  const auraOpacity = interpolate(intensity, [0, 1], [0, 0.9], {
    extrapolateRight: 'clamp',
  });

  // SSJ God has a fiery, flame-like aura
  const flameParticles = [];
  const particleCount = Math.floor(intensity * 40);

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const baseRadius = 120 + Math.sin(frame * 0.12 + i) * 25;
    const waveOffset = Math.sin(frame * 0.18 + i * 0.6) * 20;
    const radius = baseRadius + waveOffset;

    const x = Math.cos(angle) * radius * 0.5;
    const y = Math.sin(angle) * radius * 0.8 - 80;

    const particleSize = 25 + Math.sin(frame * 0.25 + i) * 12;
    const particleOpacity = 0.4 + Math.sin(frame * 0.15 + i * 0.4) * 0.2;

    flameParticles.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          width: particleSize,
          height: particleSize * 1.8,
          background: `radial-gradient(ellipse at center bottom, ${color}, ${secondaryColor}80, transparent)`,
          borderRadius: '50% 50% 40% 40%',
          opacity: particleOpacity * intensity,
          transform: `rotate(${angle + Math.PI / 2}rad)`,
          filter: 'blur(3px)',
        }}
      />
    );
  }

  // Rising flame streams - more prominent for SSJ God
  const streams = [];
  for (let i = 0; i < 12; i++) {
    const streamX = -100 + (i * 20);
    const streamPhase = frame * 0.25 + i * 0.9;
    const streamY = (streamPhase * 40) % 400 - 300;
    const streamOpacity = 0.5 - (streamY + 300) / 600;
    const streamWidth = 12 + Math.sin(streamPhase) * 6;

    streams.push(
      <div
        key={`stream-${i}`}
        style={{
          position: 'absolute',
          left: `calc(50% + ${streamX}px)`,
          top: `calc(50% + ${streamY}px)`,
          width: streamWidth,
          height: 60,
          background: `linear-gradient(to top, transparent, ${color}90, ${secondaryColor}60, transparent)`,
          borderRadius: '50%',
          opacity: Math.max(0, streamOpacity) * intensity,
          filter: 'blur(4px)',
        }}
      />
    );
  }

  // Inner flame wisps
  const wisps = [];
  for (let i = 0; i < 8; i++) {
    const wispPhase = frame * 0.3 + i * 1.2;
    const wispX = Math.sin(wispPhase) * 40;
    const wispY = -150 - (wispPhase * 20) % 150;
    const wispSize = 20 + Math.sin(wispPhase * 0.5) * 10;

    wisps.push(
      <div
        key={`wisp-${i}`}
        style={{
          position: 'absolute',
          left: `calc(50% + ${wispX}px)`,
          top: `calc(50% + ${wispY}px)`,
          width: wispSize,
          height: wispSize * 2,
          background: `radial-gradient(ellipse at center, ${color}, transparent)`,
          borderRadius: '50%',
          opacity: intensity * 0.6,
          filter: 'blur(5px)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Outer aura glow - large and diffuse */}
      <div
        style={{
          position: 'absolute',
          width: 350 + intensity * 150,
          height: 550 + intensity * 150,
          background: `radial-gradient(ellipse at center 60%, ${color}50, ${secondaryColor}30, transparent 65%)`,
          borderRadius: '45% 45% 40% 40%',
          opacity: auraOpacity * 0.7,
          filter: `blur(${25 - intensity * 10}px)`,
          transform: `scale(${1 + Math.sin(frame * 0.12) * 0.06})`,
        }}
      />

      {/* Middle aura layer */}
      <div
        style={{
          position: 'absolute',
          width: 280 + intensity * 80,
          height: 480 + intensity * 80,
          background: `radial-gradient(ellipse at center 55%, ${color}70, ${secondaryColor}40, transparent 60%)`,
          borderRadius: '40% 40% 35% 35%',
          opacity: auraOpacity * 0.8,
          filter: 'blur(15px)',
          transform: `scale(${1 + Math.sin(frame * 0.15 + 0.5) * 0.04})`,
        }}
      />

      {/* Inner intense core glow */}
      <div
        style={{
          position: 'absolute',
          width: 200,
          height: 400,
          background: `radial-gradient(ellipse at center, ${color}90, ${secondaryColor}50, transparent 55%)`,
          borderRadius: '40%',
          opacity: auraOpacity * 0.9,
          filter: 'blur(10px)',
        }}
      />

      {/* Rising streams */}
      {streams}

      {/* Flame particles */}
      {flameParticles}

      {/* Inner wisps */}
      {wisps}

      {/* Outer pulsing ring */}
      <div
        style={{
          position: 'absolute',
          width: 280 + Math.sin(frame * 0.18) * 40,
          height: 480 + Math.sin(frame * 0.18) * 40,
          border: `4px solid ${color}`,
          borderRadius: '45% 45% 40% 40%',
          opacity: auraOpacity * 0.4,
          filter: 'blur(4px)',
        }}
      />

      {/* Secondary outer ring */}
      <div
        style={{
          position: 'absolute',
          width: 320 + Math.sin(frame * 0.12 + 1) * 50,
          height: 520 + Math.sin(frame * 0.12 + 1) * 50,
          border: `2px solid ${secondaryColor}`,
          borderRadius: '45% 45% 40% 40%',
          opacity: auraOpacity * 0.3,
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
};
