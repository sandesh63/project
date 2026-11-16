import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, Easing} from 'remotion';
import {Stage, Cam} from '../Stage';
import {Character, CHEMIST, COMMON_MAN, DISTRIBUTOR} from '../Character';
import {Coin, Emit, Glow, Ink, MedBox, Shelf, Sky, StringLights, TextPlane, TiledGround, Toon, V3} from '../props';
import {lerp, lerp3, pop, prog, rand} from '../util';
import {ShopInterior, ShopStreet} from './Shop';

// ---------- shared bits ----------
const Carton: React.FC<{position?: V3; gift?: boolean; s?: number}> = ({position, gift, s = 0.5}) => (
  <group position={position}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[s, s, s]} />
      <Toon color={gift ? '#ffd23f' : '#c98b52'} />
      <Ink t={0.012} />
    </mesh>
    {!gift && (
      <>
        <mesh position={[0, s / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[s * 0.25, s]} />
          <Toon color="#e8c393" />
        </mesh>
        <mesh position={[0, 0, s / 2 + 0.002]}>
          <planeGeometry args={[s * 0.3, s * 0.09]} />
          <Toon color="#c0392b" />
        </mesh>
        <mesh position={[0, 0, s / 2 + 0.002]}>
          <planeGeometry args={[s * 0.09, s * 0.3]} />
          <Toon color="#c0392b" />
        </mesh>
      </>
    )}
    {gift && (
      <>
        <mesh>
          <boxGeometry args={[s * 0.18, s * 1.01, s * 1.01]} />
          <Toon color="#e63946" />
        </mesh>
        <mesh>
          <boxGeometry args={[s * 1.01, s * 1.01, s * 0.18]} />
          <Toon color="#e63946" />
        </mesh>
        {[-1, 1].map((k) => (
          <mesh key={k} position={[k * s * 0.15, s * 0.62, 0]} rotation={[0, 0, k * 0.6]}>
            <torusGeometry args={[s * 0.14, s * 0.05, 8, 16]} />
            <Toon color="#e63946" />
          </mesh>
        ))}
      </>
    )}
  </group>
);

const QuestionMark: React.FC<{position: V3; color: string; f: number; s?: number}> = ({position, color, f, s = 1}) => (
  <group position={[position[0], position[1] + Math.sin(f * 0.08) * 0.12, position[2]]} rotation={[0, Math.sin(f * 0.05) * 0.6, 0]} scale={s}>
    <mesh position={[0, 0.35, 0]} rotation={[0, 0, -0.6]}>
      <torusGeometry args={[0.28, 0.09, 12, 24, Math.PI * 1.3]} />
      <Emit color={color} />
    </mesh>
    <mesh position={[0.02, -0.05, 0]}>
      <cylinderGeometry args={[0.09, 0.09, 0.28, 12]} />
      <Emit color={color} />
    </mesh>
    <mesh position={[0.02, -0.4, 0]}>
      <sphereGeometry args={[0.11, 14, 14]} />
      <Emit color={color} />
    </mesh>
    <Glow color={color} size={2.4} opacity={0.6} />
  </group>
);

const Sparkles: React.FC<{at: number; f: number; position: V3; color?: string; n?: number; spread?: number}> = ({
  at,
  f,
  position,
  color = '#fff3b0',
  n = 14,
  spread = 1.6,
}) => {
  const t = (f - at) / 30;
  if (t < 0 || t > 1) return null;
  return (
    <group position={position}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r = spread * Easing.out(Easing.cubic)(t) * (0.6 + rand(i) * 0.6);
        return <Glow key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.2]} color={color} size={0.5 * (1 - t) + 0.1} opacity={1 - t} />;
      })}
    </group>
  );
};

// =====================================================================
// Scene 4 – "10 pe 1 free" scheme
// =====================================================================
const PYR: V3[] = [
  [-0.78, 0.25, 0],
  [-0.26, 0.25, 0],
  [0.26, 0.25, 0],
  [0.78, 0.25, 0],
  [-0.52, 0.76, 0],
  [0, 0.76, 0],
  [0.52, 0.76, 0],
  [-0.26, 1.27, 0],
  [0.26, 1.27, 0],
  [0, 1.78, 0],
];

export const SchemeScene: React.FC = () => {
  const f = useCurrentFrame();
  const giftAt = 150;
  const giftP = prog(f, giftAt, giftAt + 12, Easing.in(Easing.quad));
  const giftBounce = f > giftAt + 12 ? Math.abs(Math.sin((f - giftAt - 12) * 0.35)) * 0.15 * Math.max(0, 1 - (f - giftAt - 12) / 30) : 0;
  const happy = f > giftAt + 10;
  return (
    <Stage bg="#2b1f4f">
      <Cam position={lerp3([0, 2.3, 8.4], [0, 2.4, 7.4], prog(f, 0, 360))} target={[0, 1.6, 0]} fov={44} />
      <hemisphereLight args={['#ffe2c0', '#4a3a70', 1.0]} />
      <directionalLight position={[2, 6, 5]} intensity={1.1} color="#ffe9cf" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3.6, 1.2]} intensity={10} distance={8} color="#ffcf8a" />

      {/* stockroom */}
      <TiledGround size={[16, 12]} base="#8a6a52" line="#6e523f" repeat={[10, 8]} />
      <mesh position={[0, 2.5, -2.2]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <Toon color="#6e5aa8" />
      </mesh>
      <Shelf width={4.4} height={2.6} rows={4} depth={0.6} position={[-2.6, 0, -1.8]} seed={31} wood="#7a5038" palette={['#c98b52', '#b8783f', '#d9a066']} />
      <Shelf width={4.4} height={2.6} rows={4} depth={0.6} position={[2.6, 0, -1.8]} seed={37} wood="#7a5038" palette={['#c98b52', '#b8783f', '#d9a066']} />
      {/* hanging bulb */}
      <mesh position={[0, 4.2, 0.6]}>
        <cylinderGeometry args={[0.01, 0.01, 1.2, 4]} />
        <meshBasicMaterial color="#1d1238" />
      </mesh>
      <mesh position={[0, 3.55, 0.6]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <Emit color="#fff0c4" />
      </mesh>
      <Glow position={[0, 3.55, 0.6]} color="#ffd38a" size={2.2} opacity={0.7} />

      {/* the stack */}
      {PYR.map((p, i) => {
        const at = 40 + i * 9;
        const t = prog(f, at, at + 9, Easing.in(Easing.quad));
        if (f < at) return null;
        return <Carton key={i} position={[p[0], p[1] + (1 - t) * 4, p[2] + 0.2]} />;
      })}
      {f >= giftAt && (
        <group position={[0, 2.3 + (1 - giftP) * 4 + giftBounce, 0.2]} scale={1 + 0.06 * Math.sin(f * 0.25) * (happy ? 1 : 0)}>
          <Carton gift />
          <Glow color="#ffe66b" size={1.8} opacity={0.55} />
        </group>
      )}
      <Sparkles at={giftAt + 12} f={f} position={[0, 2.3, 0.3]} color="#ffe66b" />
      {/* "+1" tag */}
      <group position={[0.75, 2.75, 0.4]} scale={pop(f, giftAt + 14)}>
        <TextPlane text="+1 FREE" width={1.3} height={0.42} bg="#e63946" color="#ffffff" font={0.6} border="#1d1238" />
      </group>

      {/* coins fountain once he sells it at full MRP */}
      {f > 240 &&
        Array.from({length: 16}).map((_, i) => {
          const t0 = 240 + i * 4;
          const t = (f - t0) / 40;
          if (t < 0 || t > 1) return null;
          const dir = (rand(i) - 0.5) * 3;
          return (
            <Coin
              key={i}
              position={[dir * t, 2.4 + 2.6 * t - 3.2 * t * t, 0.6 + rand(i + 3) * 0.5]}
              rotation={[f * 0.2, f * 0.3 + i, 0]}
              scale={1.3}
            />
          );
        })}
      <group position={[0, 3.35, 0.4]} scale={pop(f, 245)}>
        <TextPlane text="FULL MRP" width={1.6} height={0.42} bg="#2ee59d" color="#1d1238" font={0.6} border="#1d1238" />
      </group>

      <Character
        {...DISTRIBUTOR}
        position={[-1.3, 0, 0.45]}
        rotationY={0.45}
        mood={f > 120 ? 'sly' : 'happy'}
        talk={f > 20 && f < 140}
        armR={{x: -0.2, z: f > giftAt ? 1.9 : 0.3}}
        armL={{z: 0.25}}
      />
      <Character
        {...CHEMIST}
        position={[1.3, 0, 0.45]}
        rotationY={-0.45}
        mood={happy ? 'happy' : f > 100 ? 'shock' : 'neutral'}
        armL={{z: happy ? 2.5 + Math.sin(f * 0.3) * 0.2 : 0.2}}
        armR={{z: happy ? 2.5 + Math.cos(f * 0.3) * 0.2 : 0.2}}
        jump={happy ? Math.abs(Math.sin(f * 0.22)) * 0.15 : 0}
        eyeLook={[-0.5, 0.5]}
      />
    </Stage>
  );
};

// =====================================================================
// Scene 5 – Government price control
// =====================================================================
const Lock: React.FC<{position: V3; scale?: number}> = ({position, scale = 1}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.55, 0]}>
      <torusGeometry args={[0.38, 0.1, 12, 24, Math.PI]} />
      <meshToonMaterial color="#c7cede" />
      <Ink t={0.015} />
    </mesh>
    {[-0.38, 0.38].map((x) => (
      <mesh key={x} position={[x, 0.42, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 12]} />
        <meshToonMaterial color="#c7cede" />
      </mesh>
    ))}
    <mesh castShadow>
      <boxGeometry args={[1.1, 0.9, 0.35]} />
      <meshToonMaterial color="#ffc93c" emissive="#5a3a00" />
      <Ink t={0.02} />
    </mesh>
    <mesh position={[0, 0.06, 0.18]}>
      <circleGeometry args={[0.1, 16]} />
      <meshBasicMaterial color="#1d1238" />
    </mesh>
    <mesh position={[0, -0.1, 0.18]}>
      <planeGeometry args={[0.07, 0.22]} />
      <meshBasicMaterial color="#1d1238" />
    </mesh>
  </group>
);

const GovtBuilding: React.FC<{f: number}> = ({f}) => {
  const flagWave = Math.sin(f * 0.15) * 0.15;
  return (
    <group position={[0, 0, -7]}>
      {/* steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.15 + i * 0.3, 1.6 - i * 0.35]} receiveShadow castShadow>
          <boxGeometry args={[9 - i * 0.4, 0.3, 2]} />
          <Toon color="#e9e3f5" />
        </mesh>
      ))}
      {/* main hall */}
      <mesh position={[0, 2.6, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[8.2, 4.2, 3]} />
        <Toon color="#f3e3c3" />
        <Ink t={0.03} />
      </mesh>
      {/* glowing windows */}
      {[-3, -1.8, 1.8, 3].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.4, 1.11]}>
            <planeGeometry args={[0.6, 1.4]} />
            <Emit color="#ffcf7a" />
          </mesh>
          <Glow position={[x, 2.4, 1.3]} color="#ffcf7a" size={1.4} opacity={0.35} />
        </group>
      ))}
      {/* columns */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
        <group key={x} position={[x, 0.9, 1.5]}>
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 3.8, 16]} />
            <Toon color="#fff8ea" />
            <Ink t={0.015} />
          </mesh>
          <mesh position={[0, 3.85, 0]}>
            <boxGeometry args={[0.6, 0.15, 0.6]} />
            <Toon color="#e9dcc0" />
          </mesh>
        </group>
      ))}
      {/* entablature + pediment */}
      <mesh position={[0, 4.95, 1.0]} castShadow>
        <boxGeometry args={[6.4, 0.45, 1.6]} />
        <Toon color="#f3e3c3" />
        <Ink t={0.02} />
      </mesh>
      <mesh position={[0, 5.55, 1.0]} rotation={[Math.PI / 2, 0, 0]} scale={[3.3, 1, 0.8]}>
        <cylinderGeometry args={[1, 1, 1.6, 3]} />
        <Toon color="#eedbb7" />
      </mesh>
      {/* drum + dome + spire */}
      <mesh position={[0, 5.3, -0.6]}>
        <cylinderGeometry args={[1.7, 1.8, 1.4, 32]} />
        <Toon color="#efe2c9" />
        <Ink t={0.02} />
      </mesh>
      <mesh position={[0, 6.0, -0.6]}>
        <sphereGeometry args={[1.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Toon color="#f6d6a0" />
        <Ink t={0.02} />
      </mesh>
      <mesh position={[0, 8.2, -0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 1.6, 6]} />
        <meshBasicMaterial color="#3a2d5a" />
      </mesh>
      {/* tricolour */}
      <group position={[0.45, 8.6, -0.6]} rotation={[0, flagWave, 0]}>
        {['#ff9933', '#ffffff', '#138808'].map((c, i) => (
          <mesh key={c} position={[0, 0.22 - i * 0.22, 0]}>
            <planeGeometry args={[0.9, 0.22]} />
            <meshBasicMaterial color={c} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[0.05, 0.075, 20]} />
          <meshBasicMaterial color="#000080" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <Glow position={[0, 6.6, -0.2]} color="#ffe2a8" size={6} opacity={0.18} />
    </group>
  );
};

export const GovtScene: React.FC = () => {
  const f = useCurrentFrame();
  const slam = 132;
  const lockT = prog(f, slam - 22, slam, Easing.in(Easing.cubic));
  const shake = f >= slam && f < slam + 14 ? Math.sin(f * 2.5) * 0.06 * (1 - (f - slam) / 14) : 0;
  const crane = prog(f, 0, 120);
  return (
    <Stage bg="#2a1f55">
      <Cam
        position={lerp3([0, 7.5, 15], [0.4 + shake, 2.6 + shake, 7.2], crane)}
        target={lerp3([0, 4.5, -7], [0, 2.0, -0.5], crane)}
        fov={46}
      />
      <Sky
        stops={[
          [0, '#141040'],
          [0.42, '#3b2a7a'],
          [0.6, '#b85a8a'],
          [0.7, '#ff9f6b'],
          [1, '#2a1f55'],
        ]}
      />
      <fog attach="fog" args={['#4b347e', 20, 55]} />
      <hemisphereLight args={['#ffd0b0', '#3a2d6e', 1.0]} />
      <directionalLight position={[-6, 9, 8]} intensity={1.2} color="#ffd8b8" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />
      <TiledGround size={[50, 40]} base="#b9a9d9" line="#9a89c0" repeat={[25, 20]} />
      <GovtBuilding f={f} />
      {/* garden hedges */}
      {[-5.5, 5.5].map((x) => (
        <mesh key={x} position={[x, 0.4, -3.5]}>
          <boxGeometry args={[2.5, 0.8, 1]} />
          <Toon color="#3fae6a" />
          <Ink t={0.015} />
        </mesh>
      ))}
      {[-3.6, 3.6].map((x) => (
        <group key={x} position={[x, 0, -2.4]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 3.2, 8]} />
            <Toon color="#2b2350" />
          </mesh>
          <mesh position={[0, 3.25, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <Emit color="#ffe2a8" />
          </mesh>
          <Glow position={[0, 3.25, 0]} color="#ffcf7a" size={1.8} opacity={0.6} />
        </group>
      ))}

      {/* pedestal with medicines */}
      <group position={[0, 0, 0.6]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.35, 0.9, 32]} />
          <Toon color="#7b6bb8" />
          <Ink t={0.02} />
        </mesh>
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <MedBox key={x} position={[x, 1.12, (i % 2) * 0.2]} size={[0.32, 0.44, 0.2]} color={['#ff6b6b', '#4dabf7', '#69db7c', '#ffd43b'][i]} outline />
        ))}
        {f >= slam - 22 && <Lock position={[0, 1.55 + (1 - lockT) * 5, 0.45]} scale={0.95} />}
        {f >= slam && (
          <>
            <Glow position={[0, 1.4, 0.8]} color="#ff4d4d" size={3.2 + Math.sin(f * 0.2) * 0.3} opacity={0.45} />
            <Sparkles at={slam} f={f} position={[0, 1.4, 0.8]} color="#ff9b9b" spread={2} />
          </>
        )}
      </group>

      <Character
        {...CHEMIST}
        position={[1.45, 0, 1.9]}
        rotationY={-0.5}
        mood={f > 185 ? 'worried' : 'neutral'}
        sweat={f > 200}
        armL={{z: f > 185 ? 1.1 : 0.2}}
        armR={{z: f > 185 ? 1.1 : 0.2}}
      />
    </Stage>
  );
};

// =====================================================================
// Scene 6 – Expenses eat the margin
// =====================================================================
const Bill: React.FC<{label: string; color: string}> = ({label, color}) => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[0.9, 0.02, 0.62]} />
      <Toon color="#fffaf0" />
      <Ink t={0.008} />
    </mesh>
    <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <TextPlane text={label} width={0.85} height={0.3} color={color} font={0.62} position={[0, 0.1, 0]} />
      {[-0.1, -0.18].map((y) => (
        <mesh key={y} position={[0, y, 0.001]}>
          <planeGeometry args={[0.6, 0.03]} />
          <meshBasicMaterial color="#c9c2d9" />
        </mesh>
      ))}
    </group>
  </group>
);

const BILLS = [
  {label: 'KIRAYA', color: '#e63946', at: 70},
  {label: 'SALARY', color: '#3d6fd8', at: 115},
  {label: 'BIJLI BILL', color: '#e67700', at: 160},
];

export const ExpensesScene: React.FC = () => {
  const f = useCurrentFrame();
  const landed = BILLS.filter((b) => f > b.at + 12).length + (f > 222 ? 1 : 0);
  const coins = Math.max(2, 12 - landed * 2.5);
  const worried = f > 110;
  const flick = f > 175 && f < 300 ? (rand(Math.floor(f / 3)) > 0.35 ? 1 : 0) : 1;
  return (
    <Stage>
      <Cam position={lerp3([0.2, 2.45, 4.6], [0.1, 2.3, 3.7], prog(f, 0, 360))} target={[0, 1.55, -1.3]} fov={44} roll={Math.sin(f * 0.05) * 0.006} />
      <color attach="background" args={['#2a1f55']} />
      <hemisphereLight args={['#fff3dc', '#5a4a90', 0.55 + 0.45 * flick]} />
      <directionalLight position={[2, 6, 5]} intensity={0.9 * flick + 0.2} castShadow shadow-mapSize={[1024, 1024]} />
      <ShopInterior lightsOn={flick} />

      <Character {...CHEMIST} position={[0, 0, -1.75]} mood={worried ? 'worried' : 'happy'} sweat={f > 150} armL={{z: worried ? 0.9 : 0.3}} armR={{z: worried ? 0.9 : 0.3}} />

      {/* coin stack = profit, shrinking */}
      <group position={[0.95, 1.29, -0.95]}>
        {Array.from({length: Math.round(coins)}).map((_, i) => (
          <Coin key={i} position={[(i % 2) * 0.01, 0.02 + i * 0.045, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.1} />
        ))}
        <TextPlane text="PROFIT" width={0.7} height={0.2} position={[0, Math.round(coins) * 0.045 + 0.25, 0]} color="#2ee59d" font={0.8} glow />
      </group>

      {/* bills raining onto the counter */}
      {BILLS.map((b, i) => {
        if (f < b.at) return null;
        const t = prog(f, b.at, b.at + 14, Easing.in(Easing.quad));
        const y = 1.32 + i * 0.03 + (1 - t) * 2.8;
        const wob = (1 - t) * Math.sin(f * 0.5 + i) * 0.5;
        return (
          <group key={b.label} position={[-0.7 + i * 0.12, y, -0.9 + i * 0.05]} rotation={[0.25 + wob, (i - 1) * 0.25, wob * 0.5]}>
            <Bill label={b.label} color={b.color} />
          </group>
        );
      })}
      {/* expired stock */}
      {f >= 205 && (
        <group position={[-0.35, 1.32 + (1 - prog(f, 205, 220, Easing.in(Easing.quad))) * 2.8, -0.85]}>
          <MedBox size={[0.42, 0.3, 0.3]} color="#adb5bd" position={[0, 0.15, 0]} outline />
          <group position={[0, 0.2, 0.17]} scale={pop(f, 222)}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.5, 0.07]} />
              <Emit color="#ff2d2d" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <planeGeometry args={[0.5, 0.07]} />
              <Emit color="#ff2d2d" />
            </mesh>
          </group>
          <group position={[0, 0.55, 0.1]} scale={pop(f, 224)}>
            <TextPlane text="EXPIRED" width={0.8} height={0.24} bg="#ff2d2d" color="#ffffff" font={0.62} />
          </group>
        </group>
      )}
    </Stage>
  );
};

// =====================================================================
// Scene 7 – Cliffhanger
// =====================================================================
const LightCone: React.FC<{position: V3; color: string; h?: number; r?: number; o?: number}> = ({position, color, h = 3.4, r = 1.3, o = 0.16}) => (
  <mesh position={position}>
    <coneGeometry args={[r, h, 32, 1, true]} />
    <meshBasicMaterial color={color} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
  </mesh>
);

export const CliffScene: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = prog(f, 120, 175);
  const pan = prog(f, 265, 310);
  const camPos = lerp3(lerp3([0.1, 2.15, 3.9], [0, 2.3, 5.4], reveal), [1.4, 2.2, 4.6], pan);
  const camTgt = lerp3(lerp3([0, 1.85, 0.6], [-0.2, 1.8, -2.6], reveal), [1.7, 1.5, -2.4], pan);
  const chemX = lerp(0, -1.3, reveal);
  return (
    <Stage bg="#120b2c">
      <Cam position={camPos} target={camTgt} fov={44} />
      <color attach="background" args={['#120b2c']} />
      <hemisphereLight args={['#7a5cff', '#1a1035', 0.55]} />
      <pointLight position={[0, 2.6, 2.2]} intensity={4} distance={5} color="#b48cff" />
      <ShopInterior lightsOn={0} dim />

      {/* mystery generic shelf in a spotlight */}
      <group position={[-0.2, 0, -2.9]}>
        <Shelf width={1.9} height={2.2} rows={4} position={[0, 0.2, 0]} seed={77} palette={['#2ee59d', '#20c997', '#96f2d7', '#ffffff']} />
        <TextPlane text="GENERIC" width={1.8} height={0.45} position={[0, 2.75, 0.1]} color="#3dffb0" font={0.72} glow />
        <Glow position={[0, 1.4, 0.4]} color="#3dffb0" size={3.6} opacity={0.4} />
        <spotLight position={[0, 3.5, 1.2]} angle={0.5} penumbra={0.6} intensity={30} distance={8} color="#a8ffe0" />
        <LightCone position={[0, 1.9, 0.5]} color="#a8ffe0" />
        <QuestionMark position={[0.75, 3.35, 0.4]} color="#ff4fd8" f={f} s={0.9} />
      </group>

      {/* the "other counter": cosmetics / protein / FMCG */}
      <group position={[1.75, 0, -2.3]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.4, 1.0, 0.6]} />
          <Toon color="#5a3d8a" />
          <Ink t={0.01} />
        </mesh>
        {Array.from({length: 6}).map((_, i) => (
          <group key={i} position={[-0.5 + (i % 3) * 0.5, 1.15, (i < 3 ? -0.12 : 0.15)]}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.12, i % 2 ? 0.34 : 0.24, 16]} />
              <Toon color={['#ff8fd8', '#ffd43b', '#b197fc', '#ff6b9a', '#ffffff', '#ffa94d'][i]} />
              <Ink t={0.008} />
            </mesh>
            <mesh position={[0, i % 2 ? 0.2 : 0.15, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
              <Toon color="#ffffff" />
            </mesh>
          </group>
        ))}
        <Glow position={[0, 1.2, 0.4]} color="#ff4fd8" size={3} opacity={0.35 * (0.3 + 0.7 * pan)} />
        <spotLight position={[0, 3.2, 1]} angle={0.5} penumbra={0.6} intensity={18 * (0.2 + pan)} distance={7} color="#ffb3ec" />
        <LightCone position={[0, 1.8, 0.2]} color="#ffb3ec" r={1.0} o={0.12 * (0.3 + pan)} />
        <QuestionMark position={[0, 2.4, 0.2]} color="#ffd23f" f={f + 20} s={pan} />
      </group>

      <Character
        {...CHEMIST}
        position={[chemX, 0, lerp(0.7, -0.6, reveal)]}
        rotationY={lerp(0, 0.6, reveal)}
        lean={lerp(0.12, 0, reveal)}
        mood={f < 120 ? 'sly' : 'happy'}
        talk={f > 10 && f < 115}
        armR={{x: -1.4, z: 0.1}}
        eyeLook={[f < 120 ? 0.6 : 0.8, 0]}
      />
    </Stage>
  );
};

// =====================================================================
// Scene 8 – CTA
// =====================================================================
export const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const point = f > 150;
  return (
    <Stage>
      <Cam position={lerp3([0, 2.6, 8.6], [0, 2.25, 6.4], prog(f, 0, 300))} target={[0, 1.85, 0]} fov={44} />
      <ShopStreet />
      <Character
        {...COMMON_MAN}
        position={[0, 0.16, 1.7]}
        rotationY={0}
        mood="happy"
        talk={f < 270}
        armR={point ? {x: -0.75, z: 0.15} : {z: 2.3 + Math.sin(f * 0.35) * 0.35}}
        armL={point ? {x: -0.75, z: 0.15} : {z: 0.25}}
        jump={point ? Math.abs(Math.sin((f - 150) * 0.2)) * 0.12 : 0}
      />
      <Character {...CHEMIST} position={[1.05, 0, -1.75]} rotationY={-0.3} armL={{z: 2.4 + Math.sin(f * 0.3) * 0.2}} mood="happy" />
      <Sparkles at={195} f={f} position={[0, 3.6, 2]} color="#ffe14d" n={18} spread={2.4} />
      <Sparkles at={215} f={f} position={[-1.2, 4.2, 1.5]} color="#ff7ad9" n={14} spread={1.8} />
      <Sparkles at={235} f={f} position={[1.3, 4.0, 1.5]} color="#7affd4" n={14} spread={1.8} />
      <StringLights from={[-3, 4.4, 3.5]} to={[3, 4.4, 3.5]} sag={0.5} count={12} phase={1} />
    </Stage>
  );
};

export const _m = useMemo;
export const _s = Sky;
