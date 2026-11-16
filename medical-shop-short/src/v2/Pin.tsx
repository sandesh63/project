// v2 character: one merged bowling-pin body (head + torso), thin stick limbs,
// thick ink outline, flat cel shading – modelled on the reference style.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {Cel, Hull, INK, V3} from './kit';

export type Mood = 'happy' | 'worried' | 'shock' | 'sly' | 'calm' | 'smile';

// profile (radius, height) of the pin silhouette
const PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.3, 0.0],
  [0.4, 0.06],
  [0.44, 0.2],
  [0.45, 0.55],
  [0.43, 0.85],
  [0.39, 1.02],
  [0.37, 1.1], // gentle neck
  [0.39, 1.2],
  [0.42, 1.38],
  [0.42, 1.55],
  [0.38, 1.72],
  [0.28, 1.86],
  [0.14, 1.93],
  [0.0, 1.95],
];
const NECK = 1.1;
const curve = new THREE.SplineCurve(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)));
const pts = curve.getPoints(60);
const radiusAt = (y: number) => {
  let best = pts[0];
  for (const p of pts) if (Math.abs(p.y - y) < Math.abs(best.y - y)) best = p;
  return best.x;
};
const lathe = (y0: number, y1: number) => new THREE.LatheGeometry(pts.filter((p) => p.y >= y0 - 0.001 && p.y <= y1 + 0.001), 40);

/** Thin limb from a to b. */
const Stick: React.FC<{a: V3; b: V3; r?: number; color?: string}> = ({a, b, r = 0.03, color = INK}) => {
  const {pos, quat, len} = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return {pos: va.add(vb).multiplyScalar(0.5), quat: q, len: d.length()};
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <capsuleGeometry args={[r, len, 4, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

export type PinProps = {
  position?: V3;
  rotY?: number;
  scale?: number;
  skin?: string;
  cloth: string;
  clothDark?: string;
  vest?: string;
  coat?: string;
  hair?: 'black' | 'bald' | 'none';
  turban?: string[];
  moustache?: boolean;
  glasses?: boolean;
  mood?: Mood;
  talk?: boolean;
  /** hand targets in body space (x right of character, y up, z forward) */
  handL?: V3;
  handR?: V3;
  holdR?: React.ReactNode;
  lean?: number;
  jump?: number;
  sweat?: boolean;
  seed?: number;
  look?: [number, number];
  stethoscope?: boolean;
  necklace?: boolean;
};

export const Pin: React.FC<PinProps> = ({
  position = [0, 0, 0],
  rotY = 0,
  scale = 1,
  skin = '#fbe3cf',
  cloth,
  clothDark,
  vest,
  coat,
  hair = 'black',
  turban,
  moustache,
  glasses,
  mood = 'smile',
  talk,
  handL = [0.62, 0.55, 0.1],
  handR = [-0.62, 0.55, 0.1],
  holdR,
  lean = 0,
  jump = 0,
  sweat,
  seed = 0,
  look = [0, 0],
  stethoscope,
  necklace,
}) => {
  const f = useCurrentFrame();
  const body = useMemo(() => lathe(0, NECK), []);
  const head = useMemo(() => lathe(NECK, 1.95), []);
  const blink = (f + seed * 31) % 100 < 4;
  const mouth = talk ? 0.25 + 0.75 * Math.abs(Math.sin(f * 0.55 + seed)) : 0;
  const breathe = 1 + Math.sin(f * 0.1 + seed) * 0.01;

  // face sits on the head front; head centre ~ y 1.48, radius ~0.42
  const hy = 1.5;
  const fz = (x: number, y: number) => Math.sqrt(Math.max(0, radiusAt(y) ** 2 - x * x));
  const eyeY = hy + 0.06;
  const ex = 0.14;
  const lidded = mood === 'calm' || mood === 'sly';

  const shoulderL: V3 = [0.4, 0.92, 0];
  const shoulderR: V3 = [-0.4, 0.92, 0];
  const elbow = (s: V3, h: V3): V3 => [(s[0] + h[0]) / 2 + Math.sign(s[0]) * 0.06, (s[1] + h[1]) / 2 - 0.05, (s[2] + h[2]) / 2];

  return (
    <group position={[position[0], position[1] + jump, position[2]]} rotation={[0, rotY, 0]} scale={scale}>
      {/* stick legs */}
      <Stick a={[0.15, 0.08, 0]} b={[0.17, -0.05, 0.02]} r={0.035} />
      <Stick a={[-0.15, 0.08, 0]} b={[-0.17, -0.05, 0.02]} r={0.035} />
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, -0.05, 0.08]} scale={[1, 0.5, 1.6]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshBasicMaterial color={INK} />
        </mesh>
      ))}

      <group rotation={[lean, 0, 0]} position={[0, 0.0, 0]} scale={[1, breathe, 1]}>
        {/* torso (clothing) */}
        <mesh geometry={body} castShadow>
          <Cel color={cloth} />
          <Hull t={0.028} />
        </mesh>
        {/* kurta placket + buttons */}
        {!coat && (
          <>
            <mesh position={[0, 0.78, fz(0, 0.78) + 0.004]}>
              <planeGeometry args={[0.07, 0.42]} />
              <meshBasicMaterial color={clothDark ?? '#d9cdb8'} />
            </mesh>
            {[0.68, 0.8, 0.92].map((y) => (
              <mesh key={y} position={[0, y, fz(0, y) + 0.01]}>
                <circleGeometry args={[0.018, 10]} />
                <meshBasicMaterial color={INK} />
              </mesh>
            ))}
          </>
        )}
        {/* vest / coat as a slightly larger open shell, opening at the front */}
        {(vest || coat) && (
          <mesh scale={[1.045, 1, 1.045]}>
            <latheGeometry args={[pts.filter((p) => p.y >= (coat ? 0.05 : 0.3) && p.y <= NECK - 0.02), 40, coat ? 0.5 : 0.75, Math.PI * 2 - (coat ? 1.0 : 1.5)]} />
            <Cel color={(coat ?? vest)!} side={THREE.DoubleSide} />
            <Hull t={0.012} />
          </mesh>
        )}
        {/* pocket with pen */}
        {(vest || coat) && (
          <group position={[-0.22, 0.78, fz(0.22, 0.78) + 0.02]} rotation={[0, -0.5, 0]}>
            <mesh>
              <planeGeometry args={[0.14, 0.12]} />
              <meshBasicMaterial color={clothDark ?? '#2a4fa8'} />
            </mesh>
            <mesh position={[0.03, 0.08, 0.005]}>
              <planeGeometry args={[0.025, 0.1]} />
              <meshBasicMaterial color="#e63946" />
            </mesh>
          </group>
        )}
        {stethoscope && (
          <mesh position={[0, 0.98, 0.05]} rotation={[1.25, 0, 0]}>
            <torusGeometry args={[0.33, 0.018, 6, 32, Math.PI]} />
            <meshBasicMaterial color="#2b2d42" />
          </mesh>
        )}
        {necklace && (
          <mesh position={[0, 1.02, 0.02]} rotation={[1.3, 0, 0]}>
            <torusGeometry args={[0.36, 0.02, 6, 32, Math.PI]} />
            <meshBasicMaterial color="#e8b923" />
          </mesh>
        )}

        {/* head */}
        <mesh geometry={head} castShadow>
          <Cel color={skin} />
          <Hull t={0.028} />
        </mesh>
        {/* hair cap */}
        {hair === 'black' && !turban && (
          <mesh position={[0, 0.0, -0.01]} scale={[1.03, 1, 1.03]} rotation={[-0.32, 0, 0]}>
            <latheGeometry args={[pts.filter((p) => p.y >= 1.62), 40]} />
            <Cel color="#1b1428" side={THREE.DoubleSide} />
          </mesh>
        )}
        {hair === 'bald' &&
          [-1, 1].map((s) => (
            <mesh key={s} position={[0.38 * s, 1.55, -0.1]} scale={[0.4, 0.9, 0.9]}>
              <sphereGeometry args={[0.15, 12, 10]} />
              <Cel color="#e8e6ef" />
              <Hull t={0.01} />
            </mesh>
          ))}
        {turban && (
          <group position={[0, 1.66, 0]}>
            {turban.map((c, i) => (
              <mesh key={i} position={[0, i * 0.075, 0]} rotation={[0.12 * (i % 2 ? 1 : -1), 0, 0.05 * (i % 2 ? 1 : -1)]}>
                <torusGeometry args={[0.37 - i * 0.03, 0.06, 10, 28]} />
                <Cel color={c} />
              </mesh>
            ))}
            <mesh position={[0, 0.12, 0]} scale={[1, 0.55, 1]}>
              <sphereGeometry args={[0.36, 20, 12]} />
              <Cel color={turban[0]} />
              <Hull t={0.02} />
            </mesh>
          </group>
        )}

        {/* eyes */}
        {[-1, 1].map((s) => {
          const x = ex * s + look[0] * 0.025;
          const y = eyeY + look[1] * 0.02;
          const z = fz(Math.abs(x), y);
          const shock = mood === 'shock';
          return (
            <group key={s} position={[x, y, z]} rotation={[0, Math.asin(Math.min(1, x / radiusAt(y))) , 0]}>
              {shock && (
                <mesh position={[0, 0, 0.004]}>
                  <circleGeometry args={[0.075, 20]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              )}
              <mesh position={[0, 0, 0.008]} scale={[1, blink ? 0.12 : lidded ? 0.55 : 1.15, 1]}>
                <circleGeometry args={[shock ? 0.035 : 0.045, 16]} />
                <meshBasicMaterial color={INK} />
              </mesh>
              {lidded && !blink && (
                <mesh position={[0, 0.03, 0.01]}>
                  <planeGeometry args={[0.12, 0.022]} />
                  <meshBasicMaterial color={INK} />
                </mesh>
              )}
              {/* brow */}
              <mesh
                position={[0, 0.1 + (mood === 'shock' ? 0.04 : 0), 0.01]}
                rotation={[0, 0, (mood === 'worried' ? 0.4 : mood === 'sly' ? -0.3 : 0.05) * s]}
              >
                <planeGeometry args={[0.1, 0.022]} />
                <meshBasicMaterial color={INK} />
              </mesh>
            </group>
          );
        })}
        {/* glasses */}
        {glasses &&
          [-1, 1].map((s) => (
            <mesh key={s} position={[ex * s, eyeY, fz(ex, eyeY) + 0.025]} rotation={[0, 0.33 * s, 0]}>
              <ringGeometry args={[0.075, 0.092, 24]} />
              <meshBasicMaterial color={INK} side={THREE.DoubleSide} />
            </mesh>
          ))}
        {/* blush */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.25 * s, hy - 0.08, fz(0.25, hy - 0.08) + 0.003]} rotation={[0, 0.6 * s, 0]}>
            <circleGeometry args={[0.05, 14]} />
            <meshBasicMaterial color="#ff9e9e" transparent opacity={0.6} />
          </mesh>
        ))}
        {/* nose */}
        <mesh position={[0, hy - 0.02, fz(0, hy - 0.02) + 0.01]}>
          <circleGeometry args={[0.022, 10]} />
          <meshBasicMaterial color="#e3a98a" />
        </mesh>
        {/* handlebar moustache with curled tips */}
        {moustache &&
          [-1, 1].map((sd) => (
            <group key={sd} position={[0, hy - 0.085, fz(0.05, hy - 0.085) + 0.012]} scale={[sd, 1, 1]}>
              <mesh position={[0.065, -0.005, 0]} rotation={[0, 0, Math.PI / 2 + 0.25]}>
                <capsuleGeometry args={[0.026, 0.09, 4, 8]} />
                <meshBasicMaterial color={INK} />
              </mesh>
              <mesh position={[0.135, 0.012, -0.01]} rotation={[0, 0.3, -0.4]}>
                <torusGeometry args={[0.028, 0.013, 6, 12, Math.PI * 1.4]} />
                <meshBasicMaterial color={INK} />
              </mesh>
            </group>
          ))}
        {/* mouth */}
        {talk || mood === 'shock' ? (
          <mesh position={[0, hy - 0.17, fz(0, hy - 0.17) + 0.008]} scale={[1, mood === 'shock' ? 1.2 : 0.35 + mouth * 0.9, 1]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color="#4a1426" />
          </mesh>
        ) : (
          <mesh position={[0, hy - (mood === 'worried' ? 0.2 : 0.16), fz(0, hy - 0.17) + 0.008]} rotation={[0, 0, mood === 'worried' ? 0 : Math.PI]}>
            <ringGeometry args={[0.045, 0.06, 16, 1, 0, Math.PI]} />
            <meshBasicMaterial color={INK} side={THREE.DoubleSide} />
          </mesh>
        )}
        {sweat &&
          [0, 1].map((i) => {
            const t = ((f + i * 20) % 40) / 40;
            return (
              <mesh key={i} position={[0.34 - i * 0.05, 1.75 - t * 0.4, 0.3]} scale={[0.7, 1, 0.7]}>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshBasicMaterial color="#8fd3ff" transparent opacity={1 - t} />
              </mesh>
            );
          })}

        {/* stick arms + round hands */}
        <Stick a={shoulderL} b={elbow(shoulderL, handL)} />
        <Stick a={elbow(shoulderL, handL)} b={handL} />
        <Stick a={shoulderR} b={elbow(shoulderR, handR)} />
        <Stick a={elbow(shoulderR, handR)} b={handR} />
        {[handL, handR].map((h, i) => (
          <mesh key={i} position={h}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <Cel color={skin} />
            <Hull t={0.015} />
          </mesh>
        ))}
        {holdR && <group position={[handR[0], handR[1], handR[2] + 0.06]}>{holdR}</group>}
      </group>
    </group>
  );
};

export const MASCOT: PinProps = {
  cloth: '#fbf6ec',
  clothDark: '#d8ccb6',
  vest: '#2f6fe4',
  hair: 'black',
  moustache: true,
};

export const CHEMIST: PinProps = {
  cloth: '#27b5a2',
  clothDark: '#1d7f73',
  coat: '#ffffff',
  hair: 'bald',
  glasses: true,
  stethoscope: true,
  seed: 3,
};

export const DISTRIBUTOR: PinProps = {
  cloth: '#ff8a3d',
  clothDark: '#c45f1f',
  turban: ['#e63946', '#ffd23f', '#2a9d8f', '#e63946'],
  moustache: true,
  seed: 7,
};
