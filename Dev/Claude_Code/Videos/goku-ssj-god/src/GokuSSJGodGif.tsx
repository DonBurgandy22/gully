import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

// SSJ God Goku character - matching the GIF pose exactly
const GokuCharacter: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle breathing/power animation
  const breathe = Math.sin(frame * 0.15) * 2;
  const powerPulse = Math.sin(frame * 0.3) * 1.5;

  return (
    <svg
      width="320"
      height="400"
      viewBox="0 0 320 400"
      style={{
        overflow: 'visible',
        filter: `drop-shadow(0 0 15px rgba(255, 100, 50, 0.8))`,
      }}
    >
      {/* Dark magenta/crimson red hair - SSJ God style */}
      <defs>
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc143c" />
          <stop offset="50%" stopColor="#8b0a1a" />
          <stop offset="100%" stopColor="#5c0a0a" />
        </linearGradient>
        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff3050" />
          <stop offset="50%" stopColor="#c41030" />
          <stop offset="100%" stopColor="#8b0a1a" />
        </linearGradient>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5c8a0" />
          <stop offset="100%" stopColor="#d4a070" />
        </linearGradient>
        <linearGradient id="giGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2850a0" />
          <stop offset="100%" stopColor="#1a3060" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* HAIR - Large spiky SSJ God hair */}
      <g transform={`translate(0, ${breathe * 0.3})`}>
        {/* Back spikes */}
        <path
          d="M80 120 L40 50 L70 90 L30 20 L65 80 L20 -10 L60 70 L25 -30 L58 60"
          fill="url(#hairGradient)"
        />
        <path
          d="M240 120 L280 50 L250 90 L290 20 L255 80 L300 -10 L260 70 L295 -30 L262 60"
          fill="url(#hairGradient)"
        />

        {/* Main hair mass */}
        <path
          d="M100 130
             Q70 100 75 60
             L90 85
             Q80 50 95 15
             L105 60
             Q95 25 115 -15
             L120 50
             Q115 5 140 -25
             L145 40
             Q140 -10 160 -35
             L165 35
             Q160 -15 185 -30
             L185 45
             Q185 0 210 -10
             L205 55
             Q210 20 235 30
             L225 75
             Q240 50 250 70
             L235 95
             Q250 85 245 110
             L230 105
             Q235 120 225 135
             L160 115
             L95 135
             Q85 120 90 105
             L100 130 Z"
          fill="url(#hairGradient)"
        />

        {/* Hair highlights */}
        <path
          d="M110 80 Q105 50 120 20 L125 55 Q120 35 135 10 L138 50"
          fill="url(#hairHighlight)"
          opacity="0.7"
        />
        <path
          d="M180 80 Q185 50 170 20 L165 55 Q170 35 155 10 L152 50"
          fill="url(#hairHighlight)"
          opacity="0.7"
        />

        {/* Front bangs - pointed down */}
        <path
          d="M115 115 L105 140 L120 120 L110 150 L130 125 L125 145 L140 120"
          fill="url(#hairGradient)"
        />
        <path
          d="M205 115 L215 140 L200 120 L210 150 L190 125 L195 145 L180 120"
          fill="url(#hairGradient)"
        />

        {/* Side spikes */}
        <path
          d="M90 115 L55 95 L82 108 L45 80 L78 100 L35 60 L75 95"
          fill="url(#hairGradient)"
        />
        <path
          d="M230 115 L265 95 L238 108 L275 80 L242 100 L285 60 L245 95"
          fill="url(#hairGradient)"
        />
      </g>

      {/* HEAD */}
      <ellipse cx="160" cy="155" rx="50" ry="55" fill="url(#skinGradient)" />

      {/* Face shadow */}
      <path
        d="M115 145 Q120 175 140 190 Q160 200 180 190 Q200 175 205 145"
        fill="#c49060"
        opacity="0.4"
      />

      {/* EYES - Glowing red */}
      <g filter="url(#glow)">
        {/* Left eye */}
        <ellipse cx="138" cy="150" rx="14" ry="10" fill="white" />
        <ellipse cx="140" cy="150" rx="8" ry="8" fill="#ff2020" />
        <ellipse cx="140" cy="150" rx="4" ry="4" fill="#ffff00" />
        <circle cx="143" cy="147" r="2" fill="white" />

        {/* Right eye */}
        <ellipse cx="182" cy="150" rx="14" ry="10" fill="white" />
        <ellipse cx="180" cy="150" rx="8" ry="8" fill="#ff2020" />
        <ellipse cx="180" cy="150" rx="4" ry="4" fill="#ffff00" />
        <circle cx="183" cy="147" r="2" fill="white" />
      </g>

      {/* Eyebrows - intense angry expression */}
      <path
        d="M118 132 Q130 128 150 138"
        fill="none"
        stroke="#8b0a1a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M202 132 Q190 128 170 138"
        fill="none"
        stroke="#8b0a1a"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Nose */}
      <path
        d="M160 155 L157 170 L163 170"
        fill="none"
        stroke="#c49060"
        strokeWidth="2"
      />

      {/* Mouth - gritting teeth/intense */}
      <path
        d="M145 185 Q160 190 175 185"
        fill="none"
        stroke="#8b5a40"
        strokeWidth="2"
      />

      {/* Ears */}
      <ellipse cx="108" cy="155" rx="8" ry="12" fill="url(#skinGradient)" />
      <ellipse cx="212" cy="155" rx="8" ry="12" fill="url(#skinGradient)" />

      {/* NECK */}
      <rect x="140" y="200" width="40" height="30" fill="url(#skinGradient)" />
      <path d="M145 205 L140 225" stroke="#c49060" strokeWidth="2" fill="none" />
      <path d="M175 205 L180 225" stroke="#c49060" strokeWidth="2" fill="none" />

      {/* TORSO - Blue torn gi */}
      <path
        d="M100 225 L90 350 L230 350 L220 225 Z"
        fill="url(#giGradient)"
      />

      {/* Gi torn/ripped details */}
      <path
        d="M100 225 L95 240 L105 235 L98 255 L110 245 L102 270 L115 260"
        fill="url(#giGradient)"
        stroke="#1a3060"
        strokeWidth="1"
      />
      <path
        d="M220 225 L225 240 L215 235 L222 255 L210 245 L218 270 L205 260"
        fill="url(#giGradient)"
        stroke="#1a3060"
        strokeWidth="1"
      />

      {/* Gi collar/neckline */}
      <path
        d="M140 225 L150 280 L160 280 L160 250 L160 280 L170 280 L180 225"
        fill="#1a3060"
      />

      {/* Belt - purple/blue */}
      <rect x="95" y="340" width="130" height="18" fill="#4a3080" />
      <ellipse cx="160" cy="349" rx="10" ry="7" fill="#3a2060" />

      {/* ARMS - muscular, at sides with fists */}
      {/* Left arm */}
      <path
        d={`M100 230
            Q70 250 55 290
            Q45 320 55 350
            L75 355
            Q85 325 80 295
            Q75 265 100 240 Z`}
        fill="url(#skinGradient)"
      />
      {/* Left forearm */}
      <path
        d="M55 350 Q40 380 45 410 L75 415 Q80 385 75 355 Z"
        fill="url(#skinGradient)"
      />
      {/* Left wristband */}
      <rect x="42" y="405" width="36" height="15" rx="3" fill="#2850a0" />
      {/* Left fist */}
      <ellipse cx="60" cy="440" rx="22" ry="18" fill="url(#skinGradient)" />
      <path d="M45 435 L45 445 M55 433 L55 447 M65 433 L65 447 M75 435 L75 445"
            stroke="#c49060" strokeWidth="2" fill="none" />

      {/* Right arm */}
      <path
        d={`M220 230
            Q250 250 265 290
            Q275 320 265 350
            L245 355
            Q235 325 240 295
            Q245 265 220 240 Z`}
        fill="url(#skinGradient)"
      />
      {/* Right forearm */}
      <path
        d="M265 350 Q280 380 275 410 L245 415 Q240 385 245 355 Z"
        fill="url(#skinGradient)"
      />
      {/* Right wristband */}
      <rect x="242" y="405" width="36" height="15" rx="3" fill="#2850a0" />
      {/* Right fist */}
      <ellipse cx="260" cy="440" rx="22" ry="18" fill="url(#skinGradient)" />
      <path d="M245 435 L245 445 M255 433 L255 447 M265 433 L265 447 M275 435 L275 445"
            stroke="#c49060" strokeWidth="2" fill="none" />

      {/* Muscle definition on arms */}
      <path d="M70 280 Q75 300 70 320" stroke="#c49060" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M250 280 Q245 300 250 320" stroke="#c49060" strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  );
};

// Intense fiery aura effect
const FireAura: React.FC = () => {
  const frame = useCurrentFrame();

  const flames: JSX.Element[] = [];

  // Create multiple flame layers
  for (let layer = 0; layer < 3; layer++) {
    const layerOffset = layer * 20;
    const layerOpacity = 0.9 - layer * 0.2;
    const layerScale = 1 + layer * 0.15;

    // Flame columns
    for (let i = 0; i < 25; i++) {
      const baseX = -200 + i * 18;
      const flamePhase = frame * 0.4 + i * 0.8 + layer * 0.5;
      const waveX = Math.sin(flamePhase) * 15;
      const height = 300 + Math.sin(flamePhase * 0.7) * 100 + Math.random() * 50;
      const width = 30 + Math.sin(flamePhase * 0.5) * 10;

      // Rising speed varies
      const riseOffset = (flamePhase * 30) % 400;

      flames.push(
        <div
          key={`flame-${layer}-${i}`}
          style={{
            position: 'absolute',
            left: `calc(50% + ${baseX + waveX}px)`,
            bottom: `${-50 + riseOffset * 0.3}px`,
            width: width * layerScale,
            height: height,
            background: layer === 0
              ? `linear-gradient(to top,
                  rgba(255, 200, 50, 0.9) 0%,
                  rgba(255, 150, 30, 0.8) 30%,
                  rgba(255, 80, 20, 0.6) 60%,
                  rgba(200, 50, 20, 0.3) 80%,
                  transparent 100%)`
              : layer === 1
              ? `linear-gradient(to top,
                  rgba(255, 180, 50, 0.7) 0%,
                  rgba(255, 120, 30, 0.5) 40%,
                  rgba(255, 60, 20, 0.3) 70%,
                  transparent 100%)`
              : `linear-gradient(to top,
                  rgba(255, 220, 100, 0.5) 0%,
                  rgba(255, 150, 50, 0.3) 50%,
                  transparent 100%)`,
            borderRadius: '50% 50% 30% 30%',
            opacity: layerOpacity,
            filter: `blur(${layer * 3 + 2}px)`,
            transform: `scaleX(${0.8 + Math.sin(flamePhase) * 0.3})`,
          }}
        />
      );
    }
  }

  // Inner bright core flames
  for (let i = 0; i < 15; i++) {
    const baseX = -120 + i * 18;
    const flamePhase = frame * 0.5 + i * 1.2;
    const waveX = Math.sin(flamePhase) * 10;
    const height = 200 + Math.sin(flamePhase * 0.6) * 80;

    flames.push(
      <div
        key={`core-flame-${i}`}
        style={{
          position: 'absolute',
          left: `calc(50% + ${baseX + waveX}px)`,
          bottom: '50px',
          width: 25,
          height: height,
          background: `linear-gradient(to top,
            rgba(255, 255, 200, 0.9) 0%,
            rgba(255, 230, 100, 0.7) 30%,
            rgba(255, 180, 50, 0.4) 60%,
            transparent 100%)`,
          borderRadius: '50% 50% 20% 20%',
          filter: 'blur(4px)',
          transform: `scaleX(${0.7 + Math.sin(flamePhase) * 0.4})`,
        }}
      />
    );
  }

  // Floating fire particles
  for (let i = 0; i < 40; i++) {
    const particlePhase = frame * 0.3 + i * 2.5;
    const baseX = Math.sin(i * 1.7) * 180;
    const riseY = (particlePhase * 15) % 500;
    const wobbleX = Math.sin(particlePhase * 2) * 20;
    const size = 5 + Math.sin(i) * 3;
    const opacity = Math.max(0, 1 - riseY / 400);

    if (opacity > 0.1) {
      flames.push(
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: `calc(50% + ${baseX + wobbleX}px)`,
            bottom: `${50 + riseY}px`,
            width: size,
            height: size * 1.5,
            background: `radial-gradient(ellipse at center,
              rgba(255, 255, 150, ${opacity}) 0%,
              rgba(255, 180, 50, ${opacity * 0.5}) 50%,
              transparent 100%)`,
            borderRadius: '50%',
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
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {flames}
    </div>
  );
};

// Outer glow effect
const AuraGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.2) * 0.1;

  return (
    <>
      {/* Outer orange glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -45%) scale(${pulse})`,
          width: 500,
          height: 700,
          background: `radial-gradient(ellipse at center 60%,
            rgba(255, 150, 50, 0.6) 0%,
            rgba(255, 100, 30, 0.4) 30%,
            rgba(255, 50, 20, 0.2) 50%,
            transparent 70%)`,
          borderRadius: '40%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />
      {/* Inner bright glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -40%) scale(${pulse * 1.05})`,
          width: 350,
          height: 550,
          background: `radial-gradient(ellipse at center,
            rgba(255, 220, 100, 0.5) 0%,
            rgba(255, 180, 50, 0.3) 40%,
            transparent 60%)`,
          borderRadius: '40%',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

// Dark rocky background
const DarkBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(
          to bottom,
          #1a1510 0%,
          #2a2015 30%,
          #1a1510 50%,
          #252015 70%,
          #151210 100%
        )`,
      }}
    >
      {/* Rocky silhouettes on sides */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 1080 1920"
        preserveAspectRatio="none"
      >
        {/* Left rock formation */}
        <path
          d="M0 400 L80 300 L60 450 L150 350 L100 550 L180 450 L120 650 L200 550 L150 800 L250 650 L180 1000 L50 900 L0 1920 Z"
          fill="#0a0805"
          opacity="0.9"
        />
        <path
          d="M0 500 L50 400 L30 550 L100 450 L70 650 L130 550 L90 800 L0 750 Z"
          fill="#151210"
          opacity="0.8"
        />

        {/* Right rock formation */}
        <path
          d="M1080 400 L1000 300 L1020 450 L930 350 L980 550 L900 450 L960 650 L880 550 L930 800 L830 650 L900 1000 L1030 900 L1080 1920 Z"
          fill="#0a0805"
          opacity="0.9"
        />
        <path
          d="M1080 500 L1030 400 L1050 550 L980 450 L1010 650 L950 550 L990 800 L1080 750 Z"
          fill="#151210"
          opacity="0.8"
        />

        {/* Some green foliage hints */}
        <ellipse cx="50" cy="350" rx="40" ry="30" fill="#1a3020" opacity="0.6" />
        <ellipse cx="1030" cy="380" rx="35" ry="25" fill="#1a3020" opacity="0.6" />
        <ellipse cx="80" cy="500" rx="30" ry="20" fill="#152518" opacity="0.5" />
        <ellipse cx="1000" cy="480" rx="25" ry="18" fill="#152518" opacity="0.5" />
      </svg>

      {/* Ambient fire glow on rocks */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: `radial-gradient(ellipse at 50% 100%,
            rgba(255, 100, 30, 0.15) 0%,
            rgba(255, 50, 20, 0.08) 40%,
            transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at center,
            transparent 30%,
            rgba(0, 0, 0, 0.6) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// Main composition
export const GokuSSJGodGif: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle camera shake for power effect
  const shakeX = Math.sin(frame * 2.5) * 2;
  const shakeY = Math.cos(frame * 3) * 1.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0805',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Background */}
        <DarkBackground />

        {/* Aura glow behind character */}
        <AuraGlow />

        {/* Fire aura behind character */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <FireAura />
        </div>

        {/* Goku character */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -40%)',
            zIndex: 2,
          }}
        >
          <GokuCharacter />
        </div>

        {/* Front fire layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, opacity: 0.4 }}>
          <FireAura />
        </div>
      </div>
    </AbsoluteFill>
  );
};
