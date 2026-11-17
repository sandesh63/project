import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, Easing} from 'remotion';
import {Stage, Cam} from '../three/Stage';
import {MarketStreet, ShopRoom, HeritageCourt, NightLights} from '../v2/sets';
import {Toon, MASCOT, CHEMIST, DISTRIBUTOR} from '../v2/Toon2';
import {Glow, Cel, Line, Lit, plasterTex, StoneGround, Bulbs} from '../v2/kit';
import {Coin, MedBox, TabletStrip, TextPlane, Shelf} from '../three/props';
import {Carton, QuestionMark, Sparkles, Lock, Bill, LightCone} from '../three/sets/scenes3';
import {rupeeNoteTexture, NoteStrip, NOTE_W} from './Note';
import {lerp, lerp3, pop, prog, rand} from '../three/util';
import {FPS} from './timeline';

type V3 = [number, number, number];
/** frame (relative to scene start) of an absolute VO time */
const cue = (t: number, t0: number) => Math.round((t - t0) * FPS);

/** Front header wall so interior shots are framed by the shop opening. */
const ShopHeader: React.FC = () => {
  const tex = useMemo(() => plasterTex('#e9a07a', 3, 1), []);
  return (
    <group>
      <mesh position={[0, 4.0, 0.05]}>
        <boxGeometry args={[6.2, 2.7, 0.2]} />
        <Cel color="#ffffff" map={tex} />
        <Line />
      </mesh>
      {Array.from({length: 9}).map((_, i) => (
        <mesh key={i} position={[-2.4 + i * 0.6, 2.66, 0.16]} rotation={[0, 0, Math.PI]}>
          <circleGeometry args={[0.3, 16, 0, Math.PI]} />
          <Cel color="#f7e6c8" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

// =====================================================================
// 1. HOOK  (0 – 5.0)
// =====================================================================
export const Hook: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, cue(4.6, t0));
  const turn = prog(f, cue(2.3, t0), cue(3.0, t0));
  return (
    <Stage>
      <Cam position={lerp3([0, 1.7, 15], [0.2, 1.65, 7.6], t)} target={lerp3([0, 4.2, 0], [0, 1.55, 0.4], t)} fov={46} />
      <MarketStreet />
      <Toon
        {...MASCOT}
        position={[-0.55, 0, 2.3]}
        rotY={lerp(-0.6, 0.25, turn)}
        mood={f > cue(2.9, t0) ? 'happy' : 'smile'}
        talk={f < cue(4.6, t0)}
        handR={[-0.3, 1.0, 0.5]}
        holdR={<TabletStrip rotation={[0, 0.2, 0]} scale={1.1} />}
        look={[0.3, 0]}
      />
      <Toon {...CHEMIST} position={[0.95, 0, -1.7]} rotY={-0.25} mood="calm" />
    </Stage>
  );
};

// =====================================================================
// 3. SPLIT  (12.85 – 23.25)
// =====================================================================
const SHARES = [
  {key: 'company', label: 'COMPANY (BAAKI)', share: 0.58, color: '#8ab4ff', at: 21.8},
  {key: 'gst', label: 'GST 5–12%', share: 0.12, color: '#ffb84d', at: 15.2},
  {key: 'dist', label: 'DISTRIBUTOR ~10%', share: 0.1, color: '#ffd23f', at: 17.85},
  {key: 'chem', label: 'CHEMIST ~20%', share: 0.2, color: '#2ee59d', at: 19.9},
];

export const Split: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const tex = useMemo(rupeeNoteTexture, []);
  const appear = pop(f, 3, 20);
  const split = prog(f, cue(13.9, t0), cue(14.6, t0));
  const activeS = [...SHARES].sort((x, y) => y.at - x.at).find((s) => f >= cue(s.at, t0));
  const active = activeS?.key;
  const happy = f >= cue(19.9, t0);
  const GAP = 0.09;
  // horizontal layout of strips after the split, centred
  const totalW = NOTE_W + GAP * 3 * split;
  let acc = 0;
  let xCursor = -totalW / 2;
  return (
    <Stage bg="#2a1f55">
      <Cam position={[0, 2.05, 4.9]} target={[0, 1.85, -1]} fov={52} />
      <color attach="background" args={['#2a1f55']} />
      <NightLights dir={[3, 6, 6]} keyColor="#ffe0bf" keyI={1.5} fill={1.0} />
      <ShopRoom />
      <ShopHeader />
      {/* real-looking ₹100 note, horizontal, splitting into shares */}
      <group position={[0, 2.88 + Math.sin(f * 0.06) * 0.03, 0.9]} scale={appear * 0.72} rotation={[0, Math.sin(f * 0.04) * 0.12 * (1 - split), 0]}>
        {SHARES.map((s) => {
          const u0 = acc;
          acc += s.share;
          const u1 = acc;
          const wStrip = NOTE_W * s.share;
          const x = xCursor + wStrip / 2;
          xCursor += wStrip + GAP * split;
          const on = active === s.key;
          const lift = on ? 0.16 * pop(f, cue(s.at, t0), 12) : 0;
          return (
            <group key={s.key} position={[x, lift, on ? 0.12 : 0]}>
              <NoteStrip tex={tex} u0={u0} u1={u1} />
              {on && <Glow color={s.color} size={1.6} opacity={0.5} position={[0, 0, -0.05]} />}
            </group>
          );
        })}
      </group>
      {/* one label at a time, under the note */}
      {activeS && (
        <group key={activeS.key} position={[0, 2.3, 0.9]} scale={pop(f, cue(activeS.at, t0) - 2, 12)}>
          <TextPlane text={activeS.label} width={1.7} height={0.34} bg={activeS.color} color="#1d1238" font={0.55} border="#1d1238" />
        </group>
      )}
      <Toon
        {...MASCOT}
        position={[-0.6, 0, 0.45]}
        scale={0.8}
        rotY={0.3}
        mood={happy ? 'happy' : 'smile'}
        look={[0.3, 1]}
        handL={[0.5, 0.42, 0.28]}
        handR={happy ? [-0.5, 1.15, 0.3] : [-0.5, 0.42, 0.28]}
      />
      <Toon
        {...CHEMIST}
        position={[0.85, 0, -1.75]}
        rotY={-0.25}
        mood={happy ? 'happy' : 'calm'}
        jump={happy && f < cue(21.5, t0) ? Math.abs(Math.sin((f - cue(19.9, t0)) * 0.3)) * 0.12 : 0}
        handL={happy ? [0.55, 1.2, 0.3] : [0.5, 0.42, 0.28]}
      />
    </Stage>
  );
};

// =====================================================================
// 4. SCHEME  (23.25 – 33.5)
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

export const Scheme: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const giftAt = cue(26.9, t0);
  const giftP = prog(f, giftAt - 10, giftAt, Easing.in(Easing.quad));
  const happy = f > giftAt;
  const coinAt = cue(29.6, t0);
  const wall = useMemo(() => plasterTex('#7a5fb0', 3, 2), []);
  return (
    <Stage bg="#2b1f4f">
      <Cam position={lerp3([0, 2.0, 9.4], [0, 2.05, 8.6], prog(f, 0, 300))} target={[0, 1.55, 0]} fov={46} />
      <color attach="background" args={['#2b1f4f']} />
      <NightLights dir={[4, 7, 6]} keyColor="#ffd9b0" keyI={1.6} fill={1.0} />
      <pointLight position={[0, 3.6, 1.2]} intensity={6} distance={8} color="#ffcf8a" />
      <StoneGround size={[20, 14]} base="#9c7a5e" line="#7a5a44" rep={[10, 7]} />
      <mesh position={[0, 3, -2.2]}>
        <planeGeometry args={[20, 7]} />
        <Cel color="#ffffff" map={wall} />
      </mesh>
      <Shelf width={3.6} height={2.6} rows={4} depth={0.6} position={[-2.7, 0, -1.8]} seed={31} wood="#7a5038" palette={['#c98b52', '#b8783f', '#d9a066']} />
      <Shelf width={3.6} height={2.6} rows={4} depth={0.6} position={[2.7, 0, -1.8]} seed={37} wood="#7a5038" palette={['#c98b52', '#b8783f', '#d9a066']} />
      <mesh position={[0, 3.6, 0.6]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <Lit color="#fff0c4" />
      </mesh>
      <Glow position={[0, 3.6, 0.6]} color="#ffd38a" size={2.2} opacity={0.7} />

      {PYR.map((p, i) => {
        const at = cue(25.3, t0) + i * 4;
        if (f < at) return null;
        const t = prog(f, at, at + 6, Easing.in(Easing.quad));
        return <Carton key={i} position={[p[0], p[1] + (1 - t) * 4, -0.4]} />;
      })}
      {f >= giftAt - 10 && (
        <group position={[0, 2.29 + (1 - giftP) * 4, -0.4]} scale={1 + (happy ? 0.05 * Math.sin(f * 0.25) : 0)}>
          <Carton gift />
          <Glow color="#ffe66b" size={1.8} opacity={0.55} />
        </group>
      )}
      <Sparkles at={giftAt} f={f} position={[0, 2.3, -0.3]} color="#ffe66b" />
      <group position={[0.95, 2.75, -0.3]} scale={pop(f, giftAt + 3)}>
        <TextPlane text="+1 FREE" width={1.2} height={0.4} bg="#e63946" color="#ffffff" font={0.6} border="#1d1238" />
      </group>
      {f > coinAt &&
        Array.from({length: 16}).map((_, i) => {
          const t = (f - (coinAt + i * 3)) / 36;
          if (t < 0 || t > 1) return null;
          return <Coin key={i} position={[(rand(i) - 0.5) * 2.6 * t, 2.4 + 2.2 * t - 3 * t * t, 0.2 + rand(i + 3) * 0.4]} rotation={[f * 0.2, f * 0.3 + i, 0]} scale={1.2} />;
        })}
      <group position={[-0.95, 2.75, -0.3]} scale={pop(f, coinAt)}>
        <TextPlane text="FULL MRP" width={1.3} height={0.4} bg="#2ee59d" color="#1d1238" font={0.6} border="#1d1238" />
      </group>

      <Toon
        {...DISTRIBUTOR}
        position={[-1.15, 0, 0.55]}
        rotY={0.4}
        mood={f > cue(26.0, t0) ? 'sly' : 'happy'}
        talk={f < cue(27.8, t0)}
        handR={f > giftAt ? [-0.3, 1.1, 0.4] : [-0.5, 0.42, 0.28]}
      />
      <Toon
        {...CHEMIST}
        position={[1.15, 0, 0.55]}
        rotY={-0.4}
        mood={happy ? 'happy' : f > cue(25.6, t0) ? 'shock' : 'calm'}
        handL={happy ? [0.55, 1.2 + Math.sin(f * 0.3) * 0.06, 0.3] : [0.5, 0.42, 0.28]}
        handR={happy ? [-0.55, 1.2 + Math.cos(f * 0.3) * 0.06, 0.3] : [-0.5, 0.42, 0.28]}
        jump={happy ? Math.abs(Math.sin(f * 0.22)) * 0.1 : 0}
      />
    </Stage>
  );
};

// =====================================================================
// 5. GOVT – price control  (33.5 – 41.45)
// =====================================================================
export const Govt: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const slam = cue(37.45, t0);
  const lockT = prog(f, slam - 14, slam, Easing.in(Easing.cubic));
  const shake = f >= slam && f < slam + 12 ? Math.sin(f * 2.5) * 0.05 * (1 - (f - slam) / 12) : 0;
  const crane = prog(f, 0, cue(36.5, t0));
  const worried = f > cue(39.2, t0);
  return (
    <Stage bg="#120c33">
      <Cam position={lerp3([0, 5, 16], [0.2 + shake, 2.1 + shake, 8.4], crane)} target={lerp3([0, 5, -4], [0, 2.2, -0.5], crane)} fov={50} />
      <HeritageCourt />
      {/* pedestal with medicines in front of the pool */}
      <group position={[-0.25, 0, -0.3]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.95, 1.05, 0.9, 32]} />
          <Cel color="#7b6bb8" />
          <Line />
        </mesh>
        {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
          <MedBox key={x} position={[x, 1.12, (i % 2) * 0.15]} size={[0.26, 0.4, 0.18]} color={['#ff6b6b', '#4dabf7', '#69db7c', '#ffd43b'][i]} outline />
        ))}
        {f >= slam - 14 && <Lock position={[0, 1.5 + (1 - lockT) * 4, 0.4]} scale={0.8} />}
        {f >= slam && (
          <>
            <Glow position={[0, 1.4, 0.8]} color="#ff4d4d" size={2.8 + Math.sin(f * 0.2) * 0.3} opacity={0.45} />
            <Sparkles at={slam} f={f} position={[0, 1.4, 0.8]} color="#ff9b9b" spread={1.6} />
          </>
        )}
      </group>
      <Toon
        {...CHEMIST}
        position={[1.15, 0, 0.6]}
        rotY={-0.45}
        mood={worried ? 'worried' : 'calm'}
        sweat={worried}
        handL={worried ? [0.6, 0.95, 0.25] : [0.5, 0.42, 0.28]}
        handR={worried ? [-0.6, 0.95, 0.25] : [-0.5, 0.42, 0.28]}
      />
    </Stage>
  );
};

// =====================================================================
// 6. EXPENSES  (41.45 – 50.85)
// =====================================================================
const BILLS = [
  {label: 'KIRAYA', color: '#e63946', at: 44.3},
  {label: 'SALARY', color: '#3d6fd8', at: 45.6},
  {label: 'BIJLI BILL', color: '#e67700', at: 47.0},
];

export const Expenses: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const expAt = cue(48.4, t0);
  const landed = BILLS.filter((b) => f > cue(b.at, t0) + 10).length + (f > expAt + 10 ? 1 : 0);
  const coins = Math.max(2, 12 - landed * 2.5);
  const worried = f > cue(44.4, t0);
  const flick = f > cue(47.2, t0) && f < cue(50.2, t0) ? (rand(Math.floor(f / 3)) > 0.35 ? 1 : 0.35) : 1;
  return (
    <Stage bg="#2a1f55">
      <Cam position={[0.1, 2.15, 4.5]} target={[0, 1.6, -1.2]} fov={50} />
      <color attach="background" args={['#2a1f55']} />
      <NightLights dir={[3, 6, 6]} keyColor="#ffe0bf" keyI={0.6 + 0.9 * flick} fill={0.5 + 0.5 * flick} />
      <ShopRoom />
      <ShopHeader />
      <Toon {...CHEMIST} position={[0, 0, -1.75]} mood={worried ? 'worried' : 'smile'} sweat={f > cue(46, t0)} handL={worried ? [0.62, 0.9, 0.3] : [0.5, 0.42, 0.28]} handR={worried ? [-0.62, 0.9, 0.3] : [-0.5, 0.42, 0.28]} />
      {/* profit coin stack shrinking */}
      <group position={[0.95, 1.28, -0.95]}>
        {Array.from({length: Math.round(coins)}).map((_, i) => (
          <Coin key={i} position={[(i % 2) * 0.01, 0.02 + i * 0.045, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.1} />
        ))}
        <TextPlane text="PROFIT" width={0.7} height={0.2} position={[0, Math.round(coins) * 0.045 + 0.22, 0]} color="#2ee59d" font={0.8} glow />
      </group>
      {BILLS.map((b, i) => {
        const at = cue(b.at, t0);
        if (f < at) return null;
        const t = prog(f, at, at + 12, Easing.in(Easing.quad));
        const wob = (1 - t) * Math.sin(f * 0.5 + i) * 0.5;
        return (
          <group key={b.label} position={[-0.75 + i * 0.12, 1.32 + i * 0.03 + (1 - t) * 2.4, -0.9 + i * 0.05]} rotation={[0.35 + wob, (i - 1) * 0.25, wob * 0.5]}>
            <Bill label={b.label} color={b.color} />
          </group>
        );
      })}
      {f >= expAt && (
        <group position={[0.35, 1.32 + (1 - prog(f, expAt, expAt + 12, Easing.in(Easing.quad))) * 2.4, -0.8]}>
          <MedBox size={[0.42, 0.3, 0.3]} color="#adb5bd" position={[0, 0.15, 0]} outline />
          <group position={[0, 0.2, 0.17]} scale={pop(f, expAt + 12)}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.5, 0.07]} />
              <Lit color="#ff2d2d" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <planeGeometry args={[0.5, 0.07]} />
              <Lit color="#ff2d2d" />
            </mesh>
          </group>
          <group position={[0, 0.52, 0.1]} scale={pop(f, expAt + 14)}>
            <TextPlane text="EXPIRED" width={0.8} height={0.24} bg="#ff2d2d" color="#ffffff" font={0.62} />
          </group>
        </group>
      )}
    </Stage>
  );
};

// =====================================================================
// 7. CLIFFHANGER  (50.85 – 62.15)
// =====================================================================
export const Cliff: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const reveal = prog(f, cue(53.0, t0), cue(54.4, t0));
  const pan = prog(f, cue(58.7, t0), cue(59.8, t0));
  const camPos = lerp3(lerp3([0.05, 1.6, 4.4], [-0.2, 2.1, 5.6], reveal), [1.2, 2.1, 4.9], pan);
  const camTgt = lerp3(lerp3([0, 1.15, 0.6], [-0.35, 1.6, -2.4], reveal), [1.55, 1.45, -2.2], pan);
  return (
    <Stage bg="#120b2c">
      <Cam position={camPos} target={camTgt} fov={46} />
      <color attach="background" args={['#120b2c']} />
      <hemisphereLight args={['#7a5cff', '#1a1035', 0.7]} />
      <pointLight position={[0, 2.6, 2.4]} intensity={3} distance={5} color="#b48cff" />
      <ShopRoom dim />
      <ShopHeader />
      <group position={[-0.2, 0, -2.9]}>
        <Shelf width={1.9} height={2.0} rows={4} position={[0, 0.2, 0]} seed={77} palette={['#2ee59d', '#20c997', '#96f2d7', '#ffffff']} />
        <TextPlane text="GENERIC" width={1.6} height={0.4} position={[0, 2.5, 0.1]} color="#3dffb0" font={0.72} glow />
        <Glow position={[0, 1.3, 0.4]} color="#3dffb0" size={3.4} opacity={0.4} />
        <spotLight position={[0, 3.2, 1.2]} angle={0.5} penumbra={0.6} intensity={25} distance={8} color="#a8ffe0" />
        <LightCone position={[0, 1.6, 0.5]} color="#a8ffe0" h={2.8} />
        <QuestionMark position={[0.75, 2.2, 0.4]} color="#ff4fd8" f={f} s={0.6} />
      </group>
      <group position={[1.6, 0, -2.2]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.3, 1.0, 0.6]} />
          <Cel color="#5a3d8a" />
          <Line />
        </mesh>
        {Array.from({length: 6}).map((_, i) => (
          <mesh key={i} position={[-0.45 + (i % 3) * 0.45, 1.15, i < 3 ? -0.12 : 0.15]}>
            <cylinderGeometry args={[0.11, 0.11, i % 2 ? 0.32 : 0.24, 16]} />
            <Cel color={['#ff8fd8', '#ffd43b', '#b197fc', '#ff6b9a', '#ffffff', '#ffa94d'][i]} />
            <Line />
          </mesh>
        ))}
        <Glow position={[0, 1.2, 0.4]} color="#ff4fd8" size={2.8} opacity={0.35 * (0.3 + 0.7 * pan)} />
        <spotLight position={[0, 3, 1]} angle={0.5} penumbra={0.6} intensity={16 * (0.2 + pan)} distance={7} color="#ffb3ec" />
        <QuestionMark position={[0, 2.0, 0.2]} color="#ffd23f" f={f + 20} s={0.6 * pan} />
      </group>
      <Toon
        {...CHEMIST}
        position={[lerp(0, -0.95, reveal), 0, lerp(0.6, -0.3, reveal)]}
        rotY={lerp(0, 0.55, reveal)}
        lean={lerp(0.1, 0, reveal)}
        mood={f < cue(53.0, t0) ? 'sly' : 'happy'}
        talk={f < cue(52.7, t0)}
        handR={[-0.2, 1.25, 0.45]}
      />
    </Stage>
  );
};

// =====================================================================
// 8. CTA  (62.15 – end)
// =====================================================================
export const Cta: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const point = f > cue(68.6, t0);
  return (
    <Stage>
      <Cam position={lerp3([0, 1.8, 9.6], [0, 1.65, 7.4], prog(f, 0, 240))} target={[0, 1.65, 0.8]} fov={46} />
      <MarketStreet />
      <Toon
        {...MASCOT}
        position={[0, 0, 2.2]}
        mood="happy"
        talk={f < cue(69.9, t0)}
        handR={point ? [-0.35, 0.35, 0.6] : [-0.55, 1.25 + Math.sin(f * 0.35) * 0.08, 0.3]}
        handL={point ? [0.35, 0.35, 0.6] : [0.5, 0.42, 0.28]}
        jump={point ? Math.abs(Math.sin((f - cue(68.6, t0)) * 0.25)) * 0.1 : 0}
      />
      <Toon {...CHEMIST} position={[1.0, 0, -1.7]} rotY={-0.3} mood="happy" handL={[0.55, 1.2 + Math.sin(f * 0.3) * 0.06, 0.3]} />
      <Sparkles at={cue(68.7, t0)} f={f} position={[0, 3.2, 2.4]} color="#ffe14d" n={18} spread={1.8} />
      <Bulbs from={[-2.6, 4.2, 4]} to={[2.6, 4.2, 4]} sag={0.4} n={12} />
    </Stage>
  );
};

export const _unused = {useMemo, Glow, StoneGround};
