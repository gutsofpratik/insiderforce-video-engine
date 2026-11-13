import React from 'react';
import { Composition } from 'remotion';
import { ClaudeMcpShort } from './ClaudeMcpShort';
import { Top3ClaudeSkillsShort } from './Top3ClaudeSkillsShort';
import {
  TOP3_CLAUDE_SKILLS_DEFAULT_PROPS,
  top3ClaudeSkillsSchema,
} from './top3SkillsTextLayer';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Top3ClaudeSkillsShort"
        component={Top3ClaudeSkillsShort}
        schema={top3ClaudeSkillsSchema}
        defaultProps={TOP3_CLAUDE_SKILLS_DEFAULT_PROPS}
        durationInFrames={2100}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeMcpShort"
        component={ClaudeMcpShort}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
