import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {
  Building,
  Diya,
  Emit,
  Glow,
  NeonCross,
  Shelf,
  Sky,
  StringLights,
  TextPlane,
  TiledGround,
  Toon,
  TubeLight,
  MedBox,
  Ink,
} from '../props';
import {canvasTexture} from '../util';

const W = 5.2; // shop width
const H = 3.6; // shop height
const D = 4.2; // shop depth

/** Glass-front counter with boxes inside. */
export const Counter: React.FC<{position?: [number, number, number]; width?: number}> = ({position = [0, 0, -1.1], width = 3.6}) => (
  <group position={position}>
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, 0.9, 0.7]} />
      <Toon color="#a0643f" />
      <Ink t={0.01} />
    </mesh>
    {/* front decorative panel */}
    <mesh position={[0, 0.45, 0.352]}>
      <planeGeometry args={[width - 0.2, 0.6]} />
      <Toon color="#7d4a2d" />
    </mesh>
    {/* glass top case */}
    <mesh position={[0, 1.08, 0]}>
      <boxGeometry args={[width, 0.36, 0.7]} />
      <meshPhysicalMaterial color="#cfefff" transparent opacity={0.22} roughness={0.05} />
    </mesh>
    <mesh position={[0, 1.27, 0]}>
      <boxGeometry args={[width + 0.04, 0.03, 0.74]} />
      <Toon color="#e6f6ff" />
    </mesh>
    {Array.from({length: 9}).map((_, i) => (
      <MedBox
        key={i}
        size={[0.26, 0.16, 0.36]}
        color={['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#3bc9db', '#ff8787'][i]}
        position={[-width / 2 + 0.35 + i * ((width - 0.7) / 8), 0.99, 0]}
      />
    ))}
  </group>
);

/** Interior of the medical shop (open front at z = 0). */
export const ShopInterior: React.FC<{lightsOn?: number; dim?: boolean}> = ({lightsOn = 1, dim}) => {
  const floorTex = useMemo(
    () =>
      canvasTexture(
        128,
        128,
        (g, w, h) => {
          g.fillStyle = '#e9e0d2';
          g.fillRect(0, 0, w, h);
          g.fillStyle = '#d4c6b2';
          g.fillRect(0, 0, w / 2, h / 2);
          g.fillRect(w / 2, h / 2, w / 2, h / 2);
        },
        [6, 5],
      ),
    [],
  );
  const wall = dim ? '#5a4f8a' : '#e8f4ef';
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -D / 2]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <Toon color={dim ? '#8a80b0' : '#ffffff'} map={floorTex} />
      </mesh>
      {/* walls */}
      <mesh position={[0, H / 2, -D]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <Toon color={wall} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * W) / 2, H / 2, -D / 2]} rotation={[0, (-s * Math.PI) / 2, 0]} receiveShadow>
          <planeGeometry args={[D, H]} />
          <Toon color={wall} />
        </mesh>
      ))}
      {/* teal wainscot stripe */}
      <mesh position={[0, 0.5, -D + 0.01]}>
        <planeGeometry args={[W, 1]} />
        <Toon color={dim ? '#3e3570' : '#9fd9c8'} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, H, -D / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <Toon color={dim ? '#2a2350' : '#f4f1ea'} />
      </mesh>

      {/* shelves */}
      <Shelf width={4.6} height={2.7} rows={5} position={[0, 0.25, -D + 0.3]} seed={2} />
      <Shelf width={3.2} height={2.6} rows={5} position={[-W / 2 + 0.28, 0.25, -2.1]} rotation={[0, Math.PI / 2, 0]} seed={5} />
      <Shelf width={3.2} height={2.6} rows={5} position={[W / 2 - 0.28, 0.25, -2.1]} rotation={[0, -Math.PI / 2, 0]} seed={9} />

      {/* small medicine fridge */}
      <group position={[1.75, 0, -1.9]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.7, 1.6, 0.6]} />
          <Toon color="#f1f3f5" />
          <Ink t={0.01} />
        </mesh>
        <mesh position={[0, 0.85, 0.305]}>
          <planeGeometry args={[0.55, 1.3]} />
          <Emit color="#bfe9ff" opacity={0.85} />
        </mesh>
      </group>

      <Counter />

      <TubeLight position={[0, H - 0.12, -1.6]} length={1.4} on={lightsOn} />
      <TubeLight position={[0, H - 0.12, -3.2]} length={1.4} on={lightsOn} />
      {lightsOn > 0.5 && <pointLight position={[0, H - 0.5, -2]} intensity={dim ? 6 : 18 * lightsOn} distance={9} color="#fff3dc" />}
    </group>
  );
};

/** Shop facade + its street block. Interior is visible through the open front. */
export const ShopStreet: React.FC<{neonFlicker?: number; dim?: boolean; lightsOn?: number}> = ({neonFlicker = 1, dim, lightsOn = 1}) => {
  const f = useCurrentFrame();
  return (
    <group>
      <Sky
        stops={[
          [0, '#120c33'],
          [0.45, '#2b1d63'],
          [0.62, '#6a3a8f'],
          [0.72, '#d9707f'],
          [1, '#2a1f55'],
        ]}
      />
      <fog attach="fog" args={['#2a1f5a', 14, 45]} />
      <hemisphereLight args={['#8f7cff', '#2a1a40', 0.9]} />
      <directionalLight
        position={[-6, 10, 8]}
        intensity={1.1}
        color="#b9b2ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <TiledGround position={[0, 0, 4]} size={[60, 40]} base="#4a3d80" line="#33295e" />
      {/* step / plinth in front of shop */}
      <mesh position={[0, 0.08, 0.35]} receiveShadow castShadow>
        <boxGeometry args={[W + 0.4, 0.16, 0.7]} />
        <Toon color="#8d84b8" />
      </mesh>

      {/* facade wall around the opening */}
      <group>
        <mesh position={[0, H + 0.9, 0.02]} castShadow>
          <boxGeometry args={[W + 0.6, 1.8, 0.3]} />
          <Toon color="#f2d9a6" />
          <Ink t={0.01} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (W / 2 + 0.15), H / 2, 0.02]} castShadow>
            <boxGeometry args={[0.3, H, 0.3]} />
            <Toon color="#f2d9a6" />
            <Ink t={0.01} />
          </mesh>
        ))}
        {/* rolled-up shutter */}
        <mesh position={[0, H - 0.12, 0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, W, 16]} />
          <Toon color="#9aa3b5" />
        </mesh>
        {/* signboard */}
        <mesh position={[0, H + 0.75, 0.2]}>
          <boxGeometry args={[W - 0.4, 0.95, 0.08]} />
          <Toon color="#0f7a5c" />
          <Ink t={0.01} />
        </mesh>
        <TextPlane text="SEHAT MEDICAL STORE" width={W - 0.7} height={0.62} position={[0, H + 0.77, 0.25]} color="#fffbe6" font={0.52} glow />
        <Glow position={[0, H + 0.75, 0.6]} color="#5dffc0" size={4.5} opacity={0.18 * neonFlicker} />
        <NeonCross position={[W / 2 + 0.55, H + 0.55, 0.45]} scale={0.95} flicker={neonFlicker} />
        {/* awning stripes */}
        <group position={[0, H + 0.05, 0.6]} rotation={[0.45, 0, 0]}>
          {Array.from({length: 10}).map((_, i) => (
            <mesh key={i} position={[-W / 2 + 0.26 + i * ((W - 0.52) / 9), 0, 0]}>
              <boxGeometry args={[(W - 0.2) / 10, 0.04, 0.8]} />
              <Toon color={i % 2 ? '#ffffff' : '#20b486'} />
            </mesh>
          ))}
        </group>
      </group>

      <ShopInterior lightsOn={lightsOn} dim={dim} />

      {/* neighbouring buildings */}
      <Building position={[-5.4, 0, -0.6]} size={[5, 7.5, 3]} color="#c8708a" seed={3} awning="#ffb347" />
      <Building position={[5.6, 0, -0.6]} size={[5.4, 6.2, 3]} color="#6b8fd6" seed={8} awning="#ff6b6b" />
      <Building position={[-10, 0, -1.5]} size={[4.5, 9, 3]} color="#8f6bd6" seed={12} />
      <Building position={[10.4, 0, -1.4]} size={[4.5, 8.5, 3]} color="#d68f6b" seed={15} />
      <Building position={[0, 0, -7]} size={[8, 11, 2]} color="#4b3f86" seed={21} />

      {/* festive string lights */}
      <StringLights from={[-7.8, 6.2, 1.2]} to={[-2.9, 5.6, 0.4]} sag={0.5} count={10} />
      <StringLights from={[-2.9, 5.6, 0.4]} to={[2.9, 5.6, 0.4]} sag={0.55} count={14} phase={1} />
      <StringLights from={[2.9, 5.6, 0.4]} to={[8.2, 5.4, 1.2]} sag={0.5} count={10} phase={2} />
      <StringLights from={[-6, 5.5, 1.5]} to={[-1, 4.8, 9]} sag={0.9} count={14} phase={3} />
      <StringLights from={[6, 5.2, 1.5]} to={[1, 4.8, 9]} sag={0.9} count={14} phase={2} />

      {/* diyas along the step */}
      {[-2.4, -1.8, 1.8, 2.4].map((x, i) => (
        <Diya key={x} position={[x, 0.17, 0.55]} f={f} seed={i} />
      ))}
      <pointLight position={[0, 0.6, 1.2]} intensity={3} distance={4} color="#ffb04a" />

      {/* street lamp */}
      {[-4.2, 4.4].map((x) => (
        <group key={x} position={[x, 0, 2.6]}>
          <mesh position={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 4.2, 10]} />
            <Toon color="#2b2350" />
          </mesh>
          <mesh position={[0, 4.25, 0]}>
            <sphereGeometry args={[0.22, 14, 14]} />
            <Emit color="#ffe2a8" />
          </mesh>
          <Glow position={[0, 4.25, 0]} color="#ffcf7a" size={2.4} opacity={0.6} />
          <pointLight position={[0, 4, 0.3]} intensity={6} distance={7} color="#ffcf7a" />
        </group>
      ))}

      {/* drifting dust motes */}
      {Array.from({length: 18}).map((_, i) => {
        const x = ((i * 1.37) % 9) - 4.5;
        const y = 0.8 + ((i * 0.71 + f * 0.004 * (1 + (i % 3))) % 4);
        const z = 1 + ((i * 0.53) % 4);
        return <Glow key={i} position={[x + Math.sin(f * 0.02 + i) * 0.2, y, z]} color="#ffd79a" size={0.12} opacity={0.7} />;
      })}
    </group>
  );
};

export const SHOP_DIMS = {W, H, D};
export const _unused = THREE;
