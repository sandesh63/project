import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import {FPS, WIDTH, HEIGHT, TOTAL_FRAMES, SCENES} from './timeline';
import {Video, SceneOnly} from './Video';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MedicalShort" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {SCENES.map((s) => (
      <Composition
        key={s.id}
        id={`scene-${s.id}`}
        component={SceneOnly}
        defaultProps={{id: s.id}}
        durationInFrames={Math.round((s.end - s.start) * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
