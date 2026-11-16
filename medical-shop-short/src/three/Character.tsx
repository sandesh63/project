import React from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {Toon, Ink, Emit, V3, INK} from './props';

export type Mood = 'happy' | 'worried' | 'shock' | 'sly' | 'neutral';

export type ArmPose = {x?: number; z?: number};

export type CharacterProps = {
  position?: V3;
  rotationY?: number;
  scale?: number;
  skin?: string;
  outfit: string;
  vest?: string;
  coat?: string;
  pants?: string;
  hair?: 'black' | 'bald' | 'none';
  cap?: string;
  moustache?: boolean;
  glasses?: boolean;
  mood?: Mood;
  talk?: boolean;
  armL?: ArmPose;
  armR?: ArmPose;
  lean?: number;
  sweat?: boolean;
  seed?: number;
  jump?: number;
  eyeLook?: [number, number];
  holdR?: React.ReactNode;
  holdL?: React.ReactNode;
  badge?: boolean;
};

const HEAD_R = 0.5;
const HEAD_S: V3 = [1, 0.96, 0.9];
/** Z of the head surface at (x,y) in head-local coordinates (for placing features). */
const faceZ = (x: number, y: number) => {
  const nx = x / HEAD_S[0];
  const ny = y / HEAD_S[1];
  return HEAD_S[2] * Math.sqrt(Math.max(0, HEAD_R * HEAD_R - nx * nx - ny * ny));
};

const Arm: React.FC<{side: 1 | -1; pose: ArmPose; color: string; skin: string; hold?: React.ReactNode}> = ({
  side,
  pose,
  color,
  skin,
  hold,
}) => (
  <group position={[0.43 * side, 1.28, 0]} rotation={[pose.x ?? 0, 0, (pose.z ?? 0.16) * side]}>
    <mesh position={[0, -0.27, 0]} castShadow>
      <capsuleGeometry args={[0.095, 0.4, 6, 12]} />
      <Toon color={color} />
      <Ink t={0.012} />
    </mesh>
    <mesh position={[0, -0.56, 0]}>
      <sphereGeometry args={[0.1, 14, 14]} />
      <Toon color={skin} />
      <Ink t={0.012} />
    </mesh>
    {hold && <group position={[0, -0.66, 0.06]}>{hold}</group>}
  </group>
);

export const Character: React.FC<CharacterProps> = ({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  skin = '#fde6d2',
  outfit,
  vest,
  coat,
  pants = '#3b3355',
  hair = 'black',
  cap,
  moustache,
  glasses,
  mood = 'happy',
  talk,
  armL = {},
  armR = {},
  lean = 0,
  sweat,
  seed = 0,
  jump = 0,
  eyeLook = [0, 0],
  holdR,
  holdL,
  badge,
}) => {
  const f = useCurrentFrame();
  // idle breathing + blink
  const breathe = 1 + Math.sin(f * 0.12 + seed) * 0.012;
  const blinkCycle = (f + seed * 37) % 96;
  const blink = blinkCycle < 4 ? 0.12 : 1;
  const mouthOpen = talk ? 0.35 + 0.65 * Math.abs(Math.sin(f * 0.55 + seed)) * (0.6 + 0.4 * Math.sin(f * 0.17)) : 0;

  const eyeY = mood === 'sly' ? 0.45 : mood === 'shock' ? 1.35 : 1;
  const browTilt = mood === 'worried' ? 0.35 : mood === 'sly' ? -0.25 : mood === 'shock' ? 0.15 : 0;
  const browLift = mood === 'shock' ? 0.07 : mood === 'worried' ? 0.03 : 0;

  const ex = 0.155;
  const ey = 0.06;
  const ez = faceZ(ex, ey);
  const my = -0.14;
  const mz = faceZ(0, my);

  return (
    <group position={[position[0], position[1] + jump, position[2]]} rotation={[0, rotationY, 0]} scale={scale}>
      <group rotation={[lean, 0, 0]} scale={[1, breathe, 1]}>
        {/* legs */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.16 * s, 0, 0]}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <capsuleGeometry args={[0.085, 0.32, 6, 10]} />
              <Toon color={pants} />
              <Ink t={0.012} />
            </mesh>
            <mesh position={[0, 0.05, 0.06]} scale={[1, 0.55, 1.5]}>
              <sphereGeometry args={[0.1, 12, 10]} />
              <Toon color="#2a1f3d" />
            </mesh>
          </group>
        ))}

        {/* torso */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <capsuleGeometry args={[0.4, 0.55, 10, 24]} />
          <Toon color={outfit} />
          <Ink />
        </mesh>
        {/* kurta buttons */}
        {!coat &&
          [1.15, 1.0, 0.85].map((y) => (
            <mesh key={y} position={[0, y, 0.395]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <Toon color="#c9b8a0" />
            </mesh>
          ))}
        {/* open vest / coat: cylinder shell with a gap at the front */}
        {(vest || coat) && (
          <mesh position={[0, coat ? 0.88 : 1.0, 0]} rotation={[0, Math.PI / 2 + 0.35, 0]}>
            <cylinderGeometry args={[0.425, coat ? 0.47 : 0.43, coat ? 0.95 : 0.6, 28, 1, true, 0, Math.PI * 2 - 0.7]} />
            <Toon color={(coat ?? vest)!} side={THREE.DoubleSide} />
            <Ink t={0.012} />
          </mesh>
        )}
        {badge && (
          <group position={[-0.2, 1.08, 0.4]}>
            <mesh>
              <boxGeometry args={[0.1, 0.03, 0.01]} />
              <Emit color="#20c997" />
            </mesh>
            <mesh>
              <boxGeometry args={[0.03, 0.1, 0.01]} />
              <Emit color="#20c997" />
            </mesh>
          </group>
        )}

        <Arm side={1} pose={armL} color={coat ?? outfit} skin={skin} hold={holdL} />
        <Arm side={-1} pose={armR} color={coat ?? outfit} skin={skin} hold={holdR} />

        {/* head */}
        <group position={[0, 1.88, 0]}>
          <mesh scale={HEAD_S} castShadow>
            <sphereGeometry args={[HEAD_R, 32, 32]} />
            <Toon color={skin} />
            <Ink />
          </mesh>
          {/* ears */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.48 * s, 0, 0]} scale={[0.5, 1, 0.8]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <Toon color={skin} />
            </mesh>
          ))}

          {/* hair */}
          {hair === 'black' && (
            <mesh scale={[1.04, 0.98, 0.95]} position={[0, 0.03, -0.02]} rotation={[-0.35, 0, 0]}>
              <sphereGeometry args={[HEAD_R, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
              <Toon color="#1e1630" side={THREE.DoubleSide} />
            </mesh>
          )}
          {hair === 'bald' &&
            [-1, 1].map((s) => (
              <mesh key={s} position={[0.43 * s, 0.12, -0.08]} scale={[0.5, 0.8, 1]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <Toon color="#c9c4d6" />
              </mesh>
            ))}
          {cap && (
            <group position={[0, 0.3, 0]}>
              <mesh scale={[1, 0.6, 1]}>
                <sphereGeometry args={[0.47, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <Toon color={cap} side={THREE.DoubleSide} />
                <Ink t={0.012} />
              </mesh>
              <mesh position={[0, 0.0, 0.42]} rotation={[0.25, 0, 0]} scale={[1, 0.15, 0.7]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 20, 1, false, -Math.PI / 2, Math.PI]} />
                <Toon color={cap} />
              </mesh>
            </group>
          )}

          {/* eyes */}
          {[-1, 1].map((s) => (
            <group key={s} position={[ex * s + eyeLook[0] * 0.03, ey + eyeLook[1] * 0.02, ez]}>
              {mood === 'shock' && (
                <mesh scale={[1, 1.2, 0.3]}>
                  <sphereGeometry args={[0.085, 14, 14]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              )}
              <mesh scale={[1, 1.25 * blink * eyeY, 0.4]} position={[0, 0, 0.012]}>
                <sphereGeometry args={[mood === 'shock' ? 0.04 : 0.05, 12, 12]} />
                <meshBasicMaterial color={INK} />
              </mesh>
              <mesh position={[0.014, 0.016, 0.03]}>
                <sphereGeometry args={[0.012, 6, 6]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* brow */}
              <mesh position={[0, 0.11 + browLift, 0]} rotation={[0, 0, Math.PI / 2 - browTilt * s]}>
                <capsuleGeometry args={[0.016, 0.08, 4, 8]} />
                <meshBasicMaterial color={INK} />
              </mesh>
            </group>
          ))}
          {/* blush */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.27 * s, -0.08, faceZ(0.27, -0.08) - 0.005]} scale={[1, 0.6, 0.3]}>
              <sphereGeometry args={[0.055, 10, 10]} />
              <meshBasicMaterial color="#ffb3b3" transparent opacity={0.65} />
            </mesh>
          ))}

          {/* glasses */}
          {glasses &&
            [-1, 1].map((s) => (
              <mesh key={s} position={[ex * s, ey, ez + 0.03]}>
                <torusGeometry args={[0.085, 0.012, 8, 24]} />
                <meshBasicMaterial color={INK} />
              </mesh>
            ))}
          {glasses && (
            <mesh position={[0, ey + 0.01, ez + 0.035]}>
              <boxGeometry args={[0.08, 0.015, 0.01]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          )}

          {/* nose */}
          <mesh position={[0, -0.03, faceZ(0, -0.03) + 0.005]} scale={[1, 0.8, 0.8]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <Toon color="#f6cdb3" />
          </mesh>

          {/* moustache */}
          {moustache &&
            [-1, 1].map((s) => (
              <mesh key={s} position={[0.065 * s, -0.085, faceZ(0.065, -0.085) + 0.01]} rotation={[0, 0, (Math.PI / 2 - 0.35) * s]}>
                <capsuleGeometry args={[0.024, 0.08, 4, 8]} />
                <meshBasicMaterial color="#2a1a14" />
              </mesh>
            ))}

          {/* mouth */}
          {talk || mood === 'shock' ? (
            <mesh position={[0, my, mz]} scale={[mood === 'shock' ? 0.8 : 1, mood === 'shock' ? 1.2 : 0.25 + mouthOpen * 0.9, 0.3]}>
              <sphereGeometry args={[0.065, 14, 14]} />
              <meshBasicMaterial color="#5a1f2e" />
            </mesh>
          ) : (
            <mesh
              position={[0, my + (mood === 'worried' ? -0.03 : 0.02), mz]}
              rotation={[0, 0, mood === 'worried' ? 0 : Math.PI]}
            >
              <torusGeometry args={[mood === 'sly' ? 0.07 : 0.06, 0.014, 6, 16, Math.PI]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          )}

          {/* sweat drops */}
          {sweat &&
            [0, 1].map((i) => {
              const t = ((f + i * 22) % 44) / 44;
              return (
                <mesh key={i} position={[0.36 - i * 0.72 * 0.15, 0.3 - t * 0.5, 0.35]} scale={[0.7, 1, 0.7]}>
                  <sphereGeometry args={[0.05, 10, 10]} />
                  <meshBasicMaterial color="#8fd3ff" transparent opacity={1 - t} />
                </mesh>
              );
            })}
        </group>
      </group>
    </group>
  );
};

// ---------- cast presets ----------
export const COMMON_MAN: Partial<CharacterProps> & {outfit: string} = {
  outfit: '#fbf5ea',
  vest: '#3d6fd8',
  pants: '#f0e6d6',
  hair: 'black',
  moustache: true,
};

export const CHEMIST: Partial<CharacterProps> & {outfit: string} = {
  outfit: '#2bb3a0',
  coat: '#ffffff',
  pants: '#3b3355',
  hair: 'bald',
  glasses: true,
  badge: true,
  seed: 3,
};

export const DISTRIBUTOR: Partial<CharacterProps> & {outfit: string} = {
  outfit: '#ff8c42',
  pants: '#2f3e66',
  hair: 'black',
  cap: '#e63946',
  moustache: true,
  seed: 7,
};
