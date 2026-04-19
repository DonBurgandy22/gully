import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  Easing,
} from 'remotion';
import { Goku } from './Goku';
import { Aura } from './Aura';
import { EnergyParticles } from './EnergyParticles';
import { Background } from './Background';

export const GokuSSJGodTransformation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline phases (in seconds)
  const BUILDUP_START = 0;
  const BUILDUP_END = 2;
  const POWER_SURGE_START = 2;
  const POWER_SURGE_END = 4;
  const TRANSFORMATION_START = 4;
  const TRANSFORMATION_END = 6;
  const REVEAL_START = 6;
  const REVEAL_END = 8;

  // Calculate current phase progress
  const buildupProgress = interpolate(
    frame,
    [BUILDUP_START * fps, BUILDUP_END * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const powerSurgeProgress = interpolate(
    frame,
    [POWER_SURGE_START * fps, POWER_SURGE_END * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const transformationProgress = interpolate(
    frame,
    [TRANSFORMATION_START * fps, TRANSFORMATION_END * fps],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }
  );

  const revealProgress = interpolate(
    frame,
    [REVEAL_START * fps, REVEAL_END * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Overall transformation state
  const isTransforming = frame >= POWER_SURGE_START * fps && frame < TRANSFORMATION_END * fps;

  // Aura intensity builds up through phases
  const auraIntensity = interpolate(
    frame,
    [
      BUILDUP_START * fps,
      BUILDUP_END * fps,
      POWER_SURGE_END * fps,
      TRANSFORMATION_END * fps,
      REVEAL_END * fps,
    ],
    [0, 0.3, 0.8, 1, 0.75],
    { extrapolateRight: 'clamp' }
  );

  // Energy particle intensity
  const particleIntensity = interpolate(
    frame,
    [POWER_SURGE_START * fps, POWER_SURGE_END * fps, TRANSFORMATION_END * fps],
    [0, 0.5, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Camera zoom effect
  const cameraZoom = interpolate(
    frame,
    [
      BUILDUP_START * fps,
      POWER_SURGE_START * fps,
      TRANSFORMATION_START * fps,
      TRANSFORMATION_END * fps,
      REVEAL_END * fps,
    ],
    [1, 1.05, 1.15, 1.25, 1.1],
    { extrapolateRight: 'clamp' }
  );

  // Flash effect at transformation peak
  const flashOpacity = interpolate(
    frame,
    [
      (TRANSFORMATION_START + 0.8) * fps,
      (TRANSFORMATION_START + 1) * fps,
      (TRANSFORMATION_START + 1.5) * fps,
    ],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Aura colors - SSJ God signature red/crimson
  const auraColorProgress = interpolate(transformationProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Start with golden/yellow, transition to SSJ God red
  const primaryAuraColor = `rgb(${Math.round(255)}, ${Math.round(200 - 150 * auraColorProgress)}, ${Math.round(50 + 30 * (1 - auraColorProgress))})`;
  const secondaryAuraColor = `rgb(${Math.round(255)}, ${Math.round(100 - 60 * auraColorProgress)}, ${Math.round(80 + 20 * (1 - auraColorProgress))})`;

  // Final SSJ God colors (deep crimson red)
  const ssjGodPrimary = `rgb(220, 45, 55)`;
  const ssjGodSecondary = `rgb(255, 80, 100)`;

  // Blend to SSJ God colors
  const finalPrimaryColor = transformationProgress > 0.5 ? ssjGodPrimary : primaryAuraColor;
  const finalSecondaryColor = transformationProgress > 0.5 ? ssjGodSecondary : secondaryAuraColor;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#87ceeb',
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
          transform: `scale(${cameraZoom})`,
          transformOrigin: 'center 55%',
        }}
      >
        {/* Background with icy mountains */}
        <Background transformationIntensity={powerSurgeProgress} />

        {/* Energy particles (behind Goku) */}
        <EnergyParticles
          intensity={particleIntensity}
          color={finalSecondaryColor}
        />

        {/* Aura effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -35%)',
          }}
        >
          <Aura
            intensity={auraIntensity}
            color={finalPrimaryColor}
            secondaryColor={finalSecondaryColor}
          />
        </div>

        {/* Goku character */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -25%)',
          }}
        >
          <Goku
            transformationProgress={transformationProgress}
            isTransforming={isTransforming}
          />
        </div>
      </div>

      {/* Flash overlay at transformation peak */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(255, 220, 220, ${flashOpacity}), rgba(255, 80, 100, ${flashOpacity * 0.6}))`,
          pointerEvents: 'none',
        }}
      />

      {/* Title text - Gathering Energy */}
      <Sequence from={0} durationInFrames={2 * fps} premountFor={fps}>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(frame, [0, fps * 0.5, fps * 1.5, fps * 2], [0, 1, 1, 0], {
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <h2
            style={{
              color: 'white',
              fontSize: 28,
              fontFamily: 'Arial Black, Arial, sans-serif',
              textShadow: '0 0 20px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.5)',
              margin: 0,
              letterSpacing: 2,
            }}
          >
            Gathering Energy...
          </h2>
        </div>
      </Sequence>

      {/* Title text - Super Saiyan God */}
      <Sequence from={4 * fps} durationInFrames={4 * fps} premountFor={fps}>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              frame,
              [4 * fps, 4.5 * fps, 7 * fps, 8 * fps],
              [0, 1, 1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
          }}
        >
          <h1
            style={{
              color: '#dc2d37',
              fontSize: 52,
              fontFamily: 'Arial Black, Arial, sans-serif',
              textShadow: '0 0 30px rgba(220, 45, 55, 0.9), 0 0 60px rgba(255, 80, 100, 0.5), 2px 2px 4px rgba(0,0,0,0.5)',
              margin: 0,
              letterSpacing: 6,
              WebkitTextStroke: '1px #fff',
            }}
          >
            SUPER SAIYAN GOD
          </h1>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
