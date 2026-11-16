import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {PerspectiveCamera} from '@react-three/drei';
import {useVideoConfig} from 'remotion';
import type {V3} from './props';

/** Camera that is positioned/aimed from props every frame (deterministic for rendering). */
export const Cam: React.FC<{position: V3; target: V3; fov?: number; roll?: number}> = ({position, target, fov = 42, roll = 0}) => {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.position.set(...position);
    c.up.set(Math.sin(roll), Math.cos(roll), 0);
    c.lookAt(...target);
    c.fov = fov;
    c.updateProjectionMatrix();
  });
  return <PerspectiveCamera ref={ref} makeDefault position={position} fov={fov} near={0.1} far={200} />;
};

/** Full-frame 3D canvas for a scene. */
export const Stage: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#1a1238'}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      flat
      dpr={1}
      gl={{antialias: true, preserveDrawingBuffer: true}}
      style={{position: 'absolute', inset: 0, background: bg}}
    >
      {children}
    </ThreeCanvas>
  );
};
