import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage, Cam} from '../three/Stage';
import {MarketStreet} from '../v2/sets';
import {Card, MASCOT, CHEMIST, DISTRIBUTOR} from './Card';
import {Pen, bodyFront} from './toon';

/** flat sheet: expressions of the cast drawn straight to canvas */
export const CastSheet: React.FC = () => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useLayoutEffect(() => {
    const g = ref.current!.getContext('2d')!;
    const items: [typeof MASCOT, any][] = [
      [MASCOT, {expr: 'smile', mode: 'stand'}],
      [CHEMIST, {expr: 'neutral', mode: 'stand'}],
      [DISTRIBUTOR, {expr: 'grin', mode: 'stand'}],
      [MASCOT, {expr: 'shock', mode: 'stand', wave: 1}],
      [CHEMIST, {expr: 'nervous', mode: 'stand'}],
      [DISTRIBUTOR, {expr: 'stern', mode: 'stroll', phase: 0.25}],
    ];
    items.forEach(([o, op], i) => {
      g.setTransform(0.58, 0, 0, 0.58, (i % 3) * 360, Math.floor(i / 3) * 620 + 160);
      bodyFront(new Pen(g), o, {seed: i + 1, ...op});
    });
  }, []);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#ffcf8a, #c25a7a 55%, #3a2470)'}}>
      <canvas ref={ref} width={1080} height={1920} />
    </AbsoluteFill>
  );
};

/** the cast standing in the 3D street */
export const CastInWorld: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage>
        <Cam position={[0, 1.7, 8.6]} target={[0, 1.6, 0.5]} fov={46} />
        <MarketStreet />
        <Card outfit={MASCOT} opts={{expr: 'smile', mode: 'stand', seed: 2, blink: (f % 90) < 4}} position={[-1.05, 0, 2.2]} height={2.7} tint="#fff1e4" />
        <Card outfit={DISTRIBUTOR} opts={{expr: 'grin', mode: 'stroll', phase: (f / 30) % 1, seed: 5}} position={[1.1, 0, 2.0]} height={2.75} tint="#fff1e4" />
        <Card outfit={CHEMIST} opts={{expr: 'neutral', mode: 'stand', seed: 3}} position={[0.2, 0, -1.6]} height={2.6} tint="#fff6ea" />
      </Stage>
    </AbsoluteFill>
  );
};
