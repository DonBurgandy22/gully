import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

type GokuProps = {
  transformationProgress: number;
  isTransforming: boolean;
};

export const Goku: React.FC<GokuProps> = ({ transformationProgress, isTransforming }) => {
  const frame = useCurrentFrame();

  // Hair color transition from black to vibrant red (SSJ God)
  const hairColor = interpolate(
    transformationProgress,
    [0, 1],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const blackHair = { r: 20, g: 20, b: 25 };
  const redHair = { r: 220, g: 45, b: 55 }; // Vibrant red like reference

  const currentHairColor = `rgb(${
    Math.round(blackHair.r + (redHair.r - blackHair.r) * hairColor)
  }, ${
    Math.round(blackHair.g + (redHair.g - blackHair.g) * hairColor)
  }, ${
    Math.round(blackHair.b + (redHair.b - blackHair.b) * hairColor)
  })`;

  // Darker shade for hair shadows
  const hairShadowColor = `rgb(${
    Math.round((blackHair.r + (redHair.r - blackHair.r) * hairColor) * 0.7)
  }, ${
    Math.round((blackHair.g + (redHair.g - blackHair.g) * hairColor) * 0.6)
  }, ${
    Math.round((blackHair.b + (redHair.b - blackHair.b) * hairColor) * 0.6)
  })`;

  // Eye color transition - black to red
  const eyeColor = interpolate(transformationProgress, [0, 0.5, 1], [0, 0, 1], {
    extrapolateRight: 'clamp',
  });
  const currentEyeColor = `rgb(${Math.round(20 + 200 * eyeColor)}, ${Math.round(20 + 20 * eyeColor)}, ${Math.round(20 + 30 * eyeColor)})`;

  // Skin tone - anime style peach/tan
  const skinBase = '#f5d0a9';
  const skinShadow = '#d4a574';

  // Shake effect during transformation
  const shakeIntensity = isTransforming ? 4 : 0;
  const shakeX = isTransforming ? Math.sin(frame * 2.5) * shakeIntensity : 0;
  const shakeY = isTransforming ? Math.cos(frame * 3) * shakeIntensity : 0;

  // Scale pulse during transformation
  const scalePulse = isTransforming ? 1 + Math.sin(frame * 0.3) * 0.015 : 1;

  // Muscle tension during transformation
  const muscleTense = isTransforming ? 1.02 : 1;

  return (
    <div
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${scalePulse})`,
        position: 'relative',
        width: 280,
        height: 500,
      }}
    >
      <svg
        width="280"
        height="500"
        viewBox="0 0 280 500"
        style={{ overflow: 'visible' }}
      >
        {/* Boots */}
        {/* Left boot */}
        <path
          d="M95 440 L85 495 L120 495 L125 440 Z"
          fill="#1a3a6e"
          stroke="#0d1f3c"
          strokeWidth="1"
        />
        <path
          d="M85 495 L85 500 L120 500 L120 495 Z"
          fill="#c41e3a"
        />
        <path
          d="M95 470 L85 470 L85 475 L95 475 Z"
          fill="#8b7355"
        />

        {/* Right boot */}
        <path
          d="M155 440 L160 495 L195 495 L185 440 Z"
          fill="#1a3a6e"
          stroke="#0d1f3c"
          strokeWidth="1"
        />
        <path
          d="M160 495 L160 500 L195 500 L195 495 Z"
          fill="#c41e3a"
        />
        <path
          d="M185 470 L195 470 L195 475 L185 475 Z"
          fill="#8b7355"
        />

        {/* Pants/Gi bottom - Orange */}
        <path
          d="M90 280 L80 440 L130 440 L140 300 L150 440 L200 440 L190 280 Z"
          fill="#ff8c00"
          stroke="#cc7000"
          strokeWidth="1"
        />
        {/* Pants folds/details */}
        <path
          d="M100 320 Q105 380 95 420"
          fill="none"
          stroke="#cc7000"
          strokeWidth="2"
        />
        <path
          d="M180 320 Q175 380 185 420"
          fill="none"
          stroke="#cc7000"
          strokeWidth="2"
        />
        <path
          d="M130 310 L130 380"
          fill="none"
          stroke="#cc7000"
          strokeWidth="1"
        />
        <path
          d="M150 310 L150 380"
          fill="none"
          stroke="#cc7000"
          strokeWidth="1"
        />

        {/* Belt - Blue */}
        <path
          d="M90 275 L90 290 L190 290 L190 275 Z"
          fill="#1a3a6e"
        />
        {/* Belt knot */}
        <ellipse cx="140" cy="282" rx="8" ry="6" fill="#0d1f3c" />

        {/* Torso/Gi top - Orange */}
        <path
          d="M85 175 L75 280 L205 280 L195 175 Z"
          fill="#ff8c00"
        />

        {/* Blue undershirt visible at neck */}
        <path
          d="M110 155 L100 180 L180 180 L170 155 Z"
          fill="#1a3a6e"
        />

        {/* Gi collar/opening showing blue */}
        <path
          d="M115 180 L130 240 L140 240 L140 200 L140 240 L150 240 L165 180 Z"
          fill="#1a3a6e"
        />

        {/* Kanji symbol on gi */}
        <circle cx="175" cy="210" r="15" fill="#fff" opacity="0.9" />
        <text x="175" y="216" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1a3a6e">悟</text>

        {/* Arms - muscular anime style */}
        {/* Left arm */}
        <path
          d={`M75 180
              Q55 200 45 240
              Q40 260 50 280
              L65 280
              Q75 260 70 240
              Q65 220 85 195 Z`}
          fill={skinBase}
          stroke={skinShadow}
          strokeWidth="1"
          transform={`scale(${muscleTense} 1)`}
          style={{ transformOrigin: '60px 230px' }}
        />
        {/* Left forearm */}
        <path
          d="M50 280 Q35 320 30 360 L55 365 Q55 325 65 285 Z"
          fill={skinBase}
        />
        {/* Left wristband */}
        <rect x="28" y="355" width="30" height="20" rx="3" fill="#1a3a6e" />
        {/* Left fist */}
        <ellipse cx="42" cy="390" rx="18" ry="15" fill={skinBase} stroke={skinShadow} strokeWidth="1" />

        {/* Right arm */}
        <path
          d={`M205 180
              Q225 200 235 240
              Q240 260 230 280
              L215 280
              Q205 260 210 240
              Q215 220 195 195 Z`}
          fill={skinBase}
          stroke={skinShadow}
          strokeWidth="1"
          transform={`scale(${muscleTense} 1)`}
          style={{ transformOrigin: '220px 230px' }}
        />
        {/* Right forearm */}
        <path
          d="M230 280 Q245 320 250 360 L225 365 Q225 325 215 285 Z"
          fill={skinBase}
        />
        {/* Right wristband */}
        <rect x="222" y="355" width="30" height="20" rx="3" fill="#1a3a6e" />
        {/* Right fist */}
        <ellipse cx="238" cy="390" rx="18" ry="15" fill={skinBase} stroke={skinShadow} strokeWidth="1" />

        {/* Neck */}
        <rect x="125" y="145" width="30" height="25" fill={skinBase} />
        {/* Neck muscles */}
        <path d="M130 150 L125 170" stroke={skinShadow} strokeWidth="1" fill="none" />
        <path d="M150 150 L155 170" stroke={skinShadow} strokeWidth="1" fill="none" />

        {/* Head */}
        <ellipse cx="140" cy="115" rx="45" ry="50" fill={skinBase} />

        {/* Face shadow */}
        <path
          d="M100 100 Q105 130 120 145 Q140 155 160 145 Q175 130 180 100"
          fill={skinShadow}
          opacity="0.3"
        />

        {/* Eyes */}
        {/* Left eye */}
        <ellipse cx="120" cy="110" rx="12" ry="8" fill="white" />
        <ellipse cx="122" cy="110" rx="6" ry="6" fill={currentEyeColor} />
        <circle cx="124" cy="108" r="2" fill="white" />

        {/* Right eye */}
        <ellipse cx="160" cy="110" rx="12" ry="8" fill="white" />
        <ellipse cx="158" cy="110" rx="6" ry="6" fill={currentEyeColor} />
        <circle cx="160" cy="108" r="2" fill="white" />

        {/* Eyebrows - angry/intense expression */}
        <path
          d="M105 95 Q115 92 130 98"
          fill="none"
          stroke={currentHairColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M175 95 Q165 92 150 98"
          fill="none"
          stroke={currentHairColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M140 115 L138 125 L142 125"
          fill="none"
          stroke={skinShadow}
          strokeWidth="1.5"
        />

        {/* Mouth - yelling expression during transformation */}
        {isTransforming ? (
          <>
            <path
              d="M125 138 Q140 155 155 138"
              fill="#300"
              stroke="#200"
              strokeWidth="1"
            />
            <path
              d="M128 140 L152 140"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </>
        ) : (
          <path
            d="M130 140 Q140 145 150 140"
            fill="none"
            stroke={skinShadow}
            strokeWidth="2"
          />
        )}

        {/* Ears */}
        <ellipse cx="95" cy="115" rx="6" ry="10" fill={skinBase} stroke={skinShadow} strokeWidth="1" />
        <ellipse cx="185" cy="115" rx="6" ry="10" fill={skinBase} stroke={skinShadow} strokeWidth="1" />

        {/* HAIR - SSJ God spiky style */}
        {/* Main hair mass */}
        <path
          d="M95 90
             Q80 70 85 40
             L95 60
             Q90 30 100 5
             L110 45
             Q110 15 125 -10
             L130 40
             Q135 0 145 -15
             L150 35
             Q155 -5 170 -10
             L165 45
             Q175 10 190 15
             L180 55
             Q195 35 205 50
             L185 75
             Q200 70 195 90
             L185 85
             Q190 100 185 110
             L175 95
             Q170 90 165 95
             L140 80
             L115 95
             Q110 90 105 95
             L95 110
             Q90 100 95 90 Z"
          fill={currentHairColor}
        />

        {/* Hair shadow/depth */}
        <path
          d="M100 85 Q95 70 100 50 L105 65 Q105 45 115 25 L118 50"
          fill={hairShadowColor}
          opacity="0.6"
        />
        <path
          d="M165 85 Q170 70 165 50 L160 65 Q160 45 150 25 L148 50"
          fill={hairShadowColor}
          opacity="0.6"
        />

        {/* Front hair bangs */}
        <path
          d="M105 95 L100 110 L110 100 L105 115 L118 105 Z"
          fill={currentHairColor}
        />
        <path
          d="M175 95 L180 110 L170 100 L175 115 L162 105 Z"
          fill={currentHairColor}
        />

        {/* Center spike bangs */}
        <path
          d="M130 85 L125 100 L135 90 L130 105 L140 92 L145 105 L150 90 L155 100 L150 85"
          fill={currentHairColor}
        />

        {/* Side hair spikes */}
        <path
          d="M90 100 L70 85 L85 95 L65 75 L82 90 L60 60 L80 85"
          fill={currentHairColor}
        />
        <path
          d="M190 100 L210 85 L195 95 L215 75 L198 90 L220 60 L200 85"
          fill={currentHairColor}
        />

        {/* Back hair spikes (visible) */}
        <path
          d="M85 50 L55 30 L80 45 L50 10 L75 40 L45 -10 L72 35"
          fill={hairShadowColor}
        />
        <path
          d="M195 50 L225 30 L200 45 L230 10 L205 40 L235 -10 L208 35"
          fill={hairShadowColor}
        />
      </svg>

      {/* Aura glow effect on character during transformation */}
      {transformationProgress > 0.5 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            boxShadow: `0 0 ${30 * transformationProgress}px rgba(255, 50, 80, ${0.3 * transformationProgress})`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
