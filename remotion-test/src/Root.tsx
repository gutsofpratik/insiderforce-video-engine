import React from 'react';
import { Composition } from 'remotion';
import { InsiderForceDemoShort } from './InsiderForceDemoShort';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="InsiderForceDemoShort"
      component={InsiderForceDemoShort}
      durationInFrames={420}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
