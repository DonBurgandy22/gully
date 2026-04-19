import React from 'react';
import { Composition } from 'remotion';
import { GokuSSJGodTransformation } from './GokuSSJGodTransformation';
import { GokuSSJGodGif } from './GokuSSJGodGif';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* GIF Recreation - looping aura animation */}
      <Composition
        id="GokuSSJGodGif"
        component={GokuSSJGodGif}
        durationInFrames={90} // 3 seconds loop at 30fps
        fps={30}
        width={480}
        height={360} // Match GIF aspect ratio
      />
      <Composition
        id="GokuSSJGodGif-HD"
        component={GokuSSJGodGif}
        durationInFrames={90}
        fps={30}
        width={960}
        height={720}
      />
      {/* Original transformation animations */}
      <Composition
        id="GokuSSJGod"
        component={GokuSSJGodTransformation}
        durationInFrames={8 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GokuSSJGod-Landscape"
        component={GokuSSJGodTransformation}
        durationInFrames={8 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GokuSSJGod-Square"
        component={GokuSSJGodTransformation}
        durationInFrames={8 * 30}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
