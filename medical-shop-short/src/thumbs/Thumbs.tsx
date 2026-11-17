// YouTube thumbnails rendered from the same 3D world + 2D cast, with bold English text.
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/poppins/800.css';
import {Stage, Cam} from '../three/Stage';
import {MarketStreet} from '../v2/sets';
import {Card, CHEMIST, MASCOT} from '../v5/Card';
import {Glow} from '../v2/kit';
import {rupeeNoteTexture, NOTE_W, NOTE_H} from '../v3/Note';
import {Coin} from '../three/props';

const F = 'Poppins, sans-serif';
const stroke = (px: number, color = '#140a2e') => ({WebkitTextStroke: `${px}px ${color}`, paintOrder: 'stroke fill' as const});

const Note: React.FC<{position: [number, number, number]; rotation?: [number, number, number]; scale?: number}> = ({position, rotation, scale = 1}) => {
  const tex = useMemo(rupeeNoteTexture, []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <planeGeometry args={[NOTE_W, NOTE_H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.01]} scale={[1.03, 1.06, 1]}>
        <planeGeometry args={[NOTE_W, NOTE_H]} />
        <meshBasicMaterial color="#1d1238" />
      </mesh>
    </group>
  );
};

/** 16:9 long-video thumbnail (render 1920x1080, export 1280x720) */
export const ThumbLong: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <Cam position={[1.0, 1.7, 5.6]} target={[1.0, 1.55, 0.2]} fov={34} />
      <MarketStreet />
      <Card outfit={CHEMIST} opts={{expr: 'shock', mode: 'stand', seed: 3, wave: 1}} position={[-0.45, 0, 1.6]} height={2.8} tint="#fff6ea" />
      <Note position={[0.75, 2.05, 2.1]} rotation={[0, -0.35, 0.18]} scale={0.38} />
      <Glow position={[0.75, 2.05, 2.0]} color="#ffe14d" size={2.2} opacity={0.4} />
      {[[-1.25, 2.3], [0.35, 1.25], [-1.4, 1.0], [1.25, 2.6]].map(([x, y], i) => (
        <Coin key={i} position={[x, y, 2.3]} rotation={[0.4 + i, 0.6 * i, 0]} scale={1.4} />
      ))}
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,4,30,0) 30%, rgba(10,4,30,0.75) 62%, rgba(10,4,30,0.9) 100%)'}} />
    <AbsoluteFill style={{left: '50%', width: '48%', justifyContent: 'center', gap: 6}}>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 108, lineHeight: 1.0, color: '#ffffff', ...stroke(14)}}>MEDICAL SHOP</div>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 92, lineHeight: 1.05, color: '#ffe14d', ...stroke(14)}}>REAL PROFIT?</div>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 150, lineHeight: 1.0, color: '#3dffb0', ...stroke(16)}}>₹40–60K</div>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: '#ffffff', ...stroke(10)}}>EVERY MONTH</div>
      <div
        style={{
          marginTop: 22,
          alignSelf: 'flex-start',
          background: '#ff2d55',
          color: '#ffffff',
          fontFamily: F,
          fontWeight: 800,
          fontSize: 60,
          padding: '8px 30px',
          borderRadius: 18,
          border: '7px solid #140a2e',
          transform: 'rotate(-3deg)',
          boxShadow: '0 10px 0 #140a2e',
        }}
      >
        + 2 SECRETS
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** 9:16 Shorts thumbnail / cover (1080x1920) */
export const ThumbShort: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <Cam position={[0, 1.75, 7.6]} target={[0, 1.6, 0.8]} fov={44} />
      <MarketStreet />
      <Card outfit={CHEMIST} opts={{expr: 'grin', mode: 'stand', seed: 3}} position={[0.55, 0, 1.4]} height={2.9} tint="#fff6ea" />
      <Card outfit={MASCOT} opts={{expr: 'shock', mode: 'stand', seed: 2, wave: 1}} position={[-0.6, 0, 2.0]} height={2.8} tint="#fff6ea" />
      <Note position={[0, 2.65, 2.6]} rotation={[0, 0, -0.12]} scale={0.5} />
      <Glow position={[0, 2.65, 2.5]} color="#ffe14d" size={3} opacity={0.4} />
    </Stage>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,4,30,0.85) 0%, rgba(10,4,30,0.2) 34%, rgba(10,4,30,0) 55%, rgba(10,4,30,0.7) 100%)'}} />
    <AbsoluteFill style={{top: '5%', alignItems: 'center'}}>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 120, lineHeight: 1.0, color: '#ffffff', textAlign: 'center', ...stroke(16)}}>₹100 MEDICINE</div>
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 92, lineHeight: 1.15, color: '#ffe14d', textAlign: 'center', ...stroke(14)}}>CHEMIST EARNS?</div>
    </AbsoluteFill>
    <AbsoluteFill style={{top: '74%', alignItems: 'center'}}>
      <div
        style={{
          background: '#3dffb0',
          color: '#140a2e',
          fontFamily: F,
          fontWeight: 800,
          fontSize: 150,
          padding: '6px 50px',
          borderRadius: 30,
          border: '10px solid #140a2e',
          transform: 'rotate(-4deg)',
          boxShadow: '0 16px 0 #140a2e',
        }}
      >
        ₹ ??
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
