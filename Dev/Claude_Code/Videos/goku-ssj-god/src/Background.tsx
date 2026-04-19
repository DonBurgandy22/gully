import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

type BackgroundProps = {
  transformationIntensity: number;
};

export const Background: React.FC<BackgroundProps> = ({ transformationIntensity }) => {
  const frame = useCurrentFrame();

  // Screen shake during intense moments
  const shakeX = transformationIntensity > 0.5
    ? Math.sin(frame * 3) * transformationIntensity * 5
    : 0;
  const shakeY = transformationIntensity > 0.5
    ? Math.cos(frame * 2.7) * transformationIntensity * 5
    : 0;

  // Light beam angle animation
  const beamAngle = frame * 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        overflow: 'hidden',
      }}
    >
      {/* Sky gradient - bright blue like reference */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            to bottom,
            #4a90d9 0%,
            #6ab4f5 30%,
            #87ceeb 50%,
            #b8e0f7 70%,
            #e8f4fc 100%
          )`,
        }}
      />

      {/* Light beams from top left - like in reference */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
        }}
        viewBox="0 0 1080 1920"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Main light beams */}
        <path
          d={`M-100 -100 L300 ${400 + Math.sin(beamAngle) * 20} L400 ${500 + Math.sin(beamAngle) * 20} L-100 100 Z`}
          fill="url(#beamGradient)"
        />
        <path
          d={`M0 -200 L500 ${600 + Math.sin(beamAngle + 1) * 30} L600 ${700 + Math.sin(beamAngle + 1) * 30} L100 -100 Z`}
          fill="url(#beamGradient)"
          opacity="0.6"
        />
        <path
          d={`M-50 0 L400 ${800 + Math.sin(beamAngle + 2) * 25} L500 ${900 + Math.sin(beamAngle + 2) * 25} L50 100 Z`}
          fill="url(#beamGradient)"
          opacity="0.4"
        />
      </svg>

      {/* Icy mountains - back layer */}
      <svg
        style={{
          position: 'absolute',
          bottom: '15%',
          left: 0,
          right: 0,
          height: '60%',
        }}
        viewBox="0 0 1080 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountainBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a8c8e8" />
            <stop offset="50%" stopColor="#c8dff5" />
            <stop offset="100%" stopColor="#e0eef9" />
          </linearGradient>
          <linearGradient id="mountainBackShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7aa8d0" />
            <stop offset="100%" stopColor="#a0c4e4" />
          </linearGradient>
        </defs>

        {/* Distant mountains */}
        <path
          d="M-50 800 L100 300 L200 450 L350 200 L500 400 L600 250 L750 380 L900 150 L1000 350 L1130 800 Z"
          fill="url(#mountainBack)"
        />
        {/* Shadow on left side of peaks */}
        <path
          d="M100 300 L200 450 L150 450 L100 350 Z"
          fill="url(#mountainBackShadow)"
          opacity="0.5"
        />
        <path
          d="M350 200 L500 400 L420 400 L350 280 Z"
          fill="url(#mountainBackShadow)"
          opacity="0.5"
        />
        <path
          d="M600 250 L750 380 L670 380 L600 300 Z"
          fill="url(#mountainBackShadow)"
          opacity="0.5"
        />
        <path
          d="M900 150 L1000 350 L950 350 L900 220 Z"
          fill="url(#mountainBackShadow)"
          opacity="0.5"
        />
      </svg>

      {/* Icy mountains - front layer */}
      <svg
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          height: '50%',
        }}
        viewBox="0 0 1080 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountainFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d0e8f8" />
            <stop offset="30%" stopColor="#e8f4fc" />
            <stop offset="100%" stopColor="#f5fafd" />
          </linearGradient>
          <linearGradient id="mountainFrontShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9ec5e8" />
            <stop offset="100%" stopColor="#c0ddf0" />
          </linearGradient>
          <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8f4fc" />
          </linearGradient>
        </defs>

        {/* Main icy peaks */}
        <path
          d="M-100 600 L50 350 L150 450 L280 180 L400 380 L500 250 L620 350 L780 100 L900 300 L1000 200 L1180 600 Z"
          fill="url(#mountainFront)"
        />

        {/* Shadow areas */}
        <path
          d="M280 180 L400 380 L320 380 L280 260 Z"
          fill="url(#mountainFrontShadow)"
          opacity="0.6"
        />
        <path
          d="M500 250 L620 350 L550 350 L500 290 Z"
          fill="url(#mountainFrontShadow)"
          opacity="0.6"
        />
        <path
          d="M780 100 L900 300 L820 300 L780 180 Z"
          fill="url(#mountainFrontShadow)"
          opacity="0.7"
        />
        <path
          d="M1000 200 L1100 350 L1030 350 L1000 260 Z"
          fill="url(#mountainFrontShadow)"
          opacity="0.5"
        />

        {/* Snow caps */}
        <path
          d="M280 180 L300 220 L260 220 Z"
          fill="url(#snowCap)"
        />
        <path
          d="M780 100 L810 160 L750 160 Z"
          fill="url(#snowCap)"
        />
        <path
          d="M1000 200 L1025 250 L975 250 Z"
          fill="url(#snowCap)"
        />
      </svg>

      {/* Snow/ice ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20%',
          background: `linear-gradient(
            to bottom,
            #e8f4fc 0%,
            #f0f8ff 30%,
            #ffffff 100%
          )`,
        }}
      />

      {/* Snow mist/fog layer */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: 0,
          right: 0,
          height: '15%',
          background: `linear-gradient(
            to top,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Floating ice particles during transformation */}
      {transformationIntensity > 0.3 && (
        <>
          {[...Array(15)].map((_, i) => {
            const baseX = (i * 73) % 100;
            const floatHeight = Math.sin(frame * 0.08 + i * 0.5) * 30 * transformationIntensity;
            const particleSize = 3 + (i % 4) * 2;

            return (
              <div
                key={`ice-${i}`}
                style={{
                  position: 'absolute',
                  bottom: `${20 + floatHeight + (i % 5) * 8}%`,
                  left: `${baseX}%`,
                  width: particleSize,
                  height: particleSize,
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  opacity: transformationIntensity * 0.8,
                  boxShadow: '0 0 10px rgba(200, 230, 255, 0.8)',
                }}
              />
            );
          })}
        </>
      )}

      {/* Floating rocks during transformation */}
      {transformationIntensity > 0.4 && (
        <>
          {[...Array(10)].map((_, i) => {
            const baseX = (i * 97 + 20) % 100;
            const floatHeight = Math.sin(frame * 0.06 + i) * 25 * transformationIntensity;
            const rockSize = 15 + (i % 3) * 12;

            return (
              <div
                key={`rock-${i}`}
                style={{
                  position: 'absolute',
                  bottom: `${15 + floatHeight + (i % 4) * 6}%`,
                  left: `${baseX}%`,
                  width: rockSize,
                  height: rockSize * 0.7,
                  background: `linear-gradient(135deg, #8ba5c0, #5a7a9a)`,
                  borderRadius: '30% 70% 50% 50%',
                  opacity: transformationIntensity * 0.9,
                  boxShadow: `0 ${5 + floatHeight * 0.3}px 15px rgba(0,0,0,0.2)`,
                }}
              />
            );
          })}
        </>
      )}

      {/* Red energy tint during transformation */}
      {transformationIntensity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 60%, rgba(255, 50, 80, ${transformationIntensity * 0.2}), transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Vignette effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,30,60,${0.2 + transformationIntensity * 0.2}) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
