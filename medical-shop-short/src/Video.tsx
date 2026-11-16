import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, continueRender, delayRender} from 'remotion';
import {FPS, SCENES, SceneId} from './timeline';
import {Captions, CalloutChip, CutIn, DownArrow, Vignette} from './overlay/Overlays';
import {SCENE_COMPONENTS} from './three/sets';

/** Wait for Poppins (incl. the ₹ glyph) before anything draws text into canvases. */
const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load('800 64px Poppins', 'Aa₹1'),
      document.fonts.load('700 64px Poppins', 'Aa₹1'),
    ])
      .catch(() => undefined)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready ? <>{children}</> : null;
};

const SceneBlock: React.FC<{id: SceneId}> = ({id}) => {
  const def = SCENES.find((s) => s.id === id)!;
  const dur = def.end - def.start;
  const Comp = SCENE_COMPONENTS[id];
  return (
    <AbsoluteFill>
      <Comp />
      <Vignette />
      {def.callouts?.map((c, i) => <CalloutChip key={i} c={c} sceneDur={dur} />)}
      <Captions vo={def.vo} duration={dur} />
      {id === 'cta' && <DownArrow from={Math.round(6.5 * FPS)} />}
      <CutIn />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{background: '#0b0620'}}>
      {SCENES.map((s) => (
        <Sequence key={s.id} from={Math.round(s.start * FPS)} durationInFrames={Math.round((s.end - s.start) * FPS)} name={s.id}>
          <SceneBlock id={s.id} />
        </Sequence>
      ))}
    </AbsoluteFill>
  </FontGate>
);

export const SceneOnly: React.FC<{id: SceneId}> = ({id}) => (
  <FontGate>
    <AbsoluteFill style={{background: '#0b0620'}}>
      <SceneBlock id={id} />
    </AbsoluteFill>
  </FontGate>
);
