// 2D cartoon card standing in the 3D world (camera-facing billboard), as in the reference repo's cast.ts.
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Pen, bodyFront, Outfit, FrontOpts} from './toon';

const CW = 720; // canvas px for the 600 x 1000 design card
const CH = 1200;

export type CardProps = {
  outfit: Outfit;
  opts?: FrontOpts;
  /** world height of the whole card (soles are 2.5 % above its bottom edge) */
  height?: number;
  position?: [number, number, number];
  tint?: string;
  shadow?: boolean;
  flip?: boolean;
};

export const Card: React.FC<CardProps> = ({outfit, opts = {}, height = 2.6, position = [0, 0, 0], tint = '#ffffff', shadow = true, flip}) => {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = CW;
    c.height = CH;
    return c;
  }, []);
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [canvas]);
  const key = JSON.stringify([outfit, opts]);
  useMemo(() => {
    const g = canvas.getContext('2d')!;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, CW, CH);
    g.setTransform(CW / 600, 0, 0, CH / 1000, 0, 0);
    bodyFront(new Pen(g), outfit, opts);
    tex.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const group = useRef<THREE.Group>(null);
  const {camera} = useThree();
  useLayoutEffect(() => {
    const gr = group.current;
    if (!gr) return;
    const dx = camera.position.x - gr.position.x;
    const dz = camera.position.z - gr.position.z;
    gr.rotation.set(0, Math.atan2(dx, dz), 0);
  });

  const w = height * 0.6;
  return (
    <group ref={group} position={position}>
      {shadow && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} renderOrder={1}>
          <circleGeometry args={[w * 0.32, 32]} />
          <meshBasicMaterial color="#1a0d2a" transparent opacity={0.38} depthWrite={false} />
        </mesh>
      )}
      <mesh position={[0, height * 0.5 - height * 0.025, 0]} scale={[flip ? -1 : 1, 1, 1]} renderOrder={2}>
        <planeGeometry args={[w, height]} />
        <meshBasicMaterial map={tex} color={tint} transparent alphaTest={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------- our cast ----------
export const MASCOT: Outfit = {
  jacket: '#fbf6ec', pants: '#e9e1d2', boots: '#6b3a22', hat: 'hair', hair: '#1d1526',
  moustache: '#1d1526', vest: '#2f6fe4', collar: '#d64550', skin: '#ffe2c2',
};
export const CHEMIST: Outfit = {
  jacket: '#27b5a2', pants: '#3b3f52', boots: '#2a1f30', hat: 'bald', coat: '#ffffff',
  glasses: true, stethoscope: true, skin: '#f5c9a0', build: 'stout',
};
export const DISTRIBUTOR: Outfit = {
  jacket: '#ff8a3d', pants: '#f3ede2', boots: '#7a3b1e', hat: 'turban',
  turban: ['#e63946', '#ffd23f', '#2a9d8f', '#f77f00'], moustache: '#2a1a14', collar: '#7b2cbf', skin: '#ecd0b6',
};

// ---------- drop-in replacement for the old 3D <Toon> (same props) ----------
import {useCurrentFrame} from 'remotion';
import type {Expr} from './toon';

type ActorProps = Outfit & {
  position?: [number, number, number];
  rotY?: number;
  scale?: number;
  mood?: 'smile' | 'happy' | 'worried' | 'shock' | 'sly' | 'calm';
  talk?: boolean;
  handL?: [number, number, number];
  handR?: [number, number, number];
  holdR?: React.ReactNode;
  jump?: number;
  sweat?: boolean;
  look?: [number, number];
  lean?: number;
  seed?: number;
  walk?: boolean;
  tint?: string;
};

const MOOD: Record<string, Expr> = {smile: 'smile', happy: 'grin', worried: 'nervous', shock: 'shock', sly: 'stern', calm: 'neutral'};

export const Actor: React.FC<ActorProps> = (props) => {
  const {position = [0, 0, 0], rotY = 0, scale = 1, mood = 'smile', talk, handL, handR, holdR, jump = 0, sweat, look = [0, 0], lean, seed = 1, walk, tint, ...outfit} = props;
  void holdR;
  void lean;
  const f = useCurrentFrame();
  let expr: Expr = MOOD[mood] ?? 'smile';
  if (sweat && mood !== 'shock') expr = 'nervous';
  if (talk && mood !== 'shock') expr = Math.floor((f + seed * 3) / 4) % 2 ? (mood === 'happy' ? 'laugh' : 'relief_open') : expr;
  const raised = (h?: [number, number, number]) => !!h && h[1] > 0.85;
  const wave = raised(handR) || raised(handL) ? 0.5 + 0.5 * Math.sin(f * 0.35) : undefined;
  const facing: -1 | 0 | 1 = rotY > 0.2 ? 1 : rotY < -0.2 ? -1 : 0;
  const opts = {
    expr,
    mode: walk ? ('stroll' as const) : ('stand' as const),
    phase: walk ? (f / 24) % 1 : 0,
    blink: (f + seed * 37) % 100 < 4,
    wave,
    facing,
    look: look[0],
    seed: seed + 1,
  };
  // old 3D characters were ~2.2 units tall; card characters fill ~0.78 of the card height
  const h = 2.85 * scale;
  return <Card outfit={outfit as Outfit} opts={opts} height={h} position={[position[0], position[1] + jump, position[2]]} tint={tint ?? '#fff3e6'} />;
};
