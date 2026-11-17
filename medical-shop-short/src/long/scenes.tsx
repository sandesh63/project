// Long-video scenes (16:9). Built from the same kit as the Short: 2D card characters (reference-repo method),
// detailed pharmacy, sunset journey, heritage building. Every animation is cued to a sentence start (at(n)).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, Easing} from 'remotion';
import {Stage, Cam} from '../three/Stage';
import {MarketStreet, ShopRoom, HeritageCourt, NightLights} from '../v2/sets';
import {Actor, MASCOT, CHEMIST, DISTRIBUTOR} from '../v5/Card';
import {Cel, Glow, Line, Lit, plasterTex} from '../v2/kit';
import {Coin, MedBox, TextPlane, Shelf} from '../three/props';
import {Carton, QuestionMark, Sparkles, Lock, Bill, LightCone} from '../three/sets/scenes3';
import {rupeeNoteTexture, NoteStrip, NOTE_W} from '../v3/Note';
import {JourneyScene2} from '../v5/journey';
import {canvasTexture, lerp, lerp3, pop, prog, rand, roundRect, FONT} from '../three/util';
import {FPS, at} from './timeline';

type V3 = [number, number, number];
const cue = (t: number, t0: number) => Math.round((t - t0) * FPS);
type P = {t0: number};

// ---------------------------------------------------------------- hisaab board
type Row = {text: string; at: number; color?: string; strong?: boolean};
const boardTex = (title: string) =>
  canvasTexture(1024, 1280, (g, w, h) => {
    g.fillStyle = '#7a4a2a';
    roundRect(g, 0, 0, w, h, 30);
    g.fill();
    g.fillStyle = '#25433a';
    roundRect(g, 34, 34, w - 68, h - 68, 18);
    g.fill();
    // chalk dust
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(255,255,255,${0.02 + rand(i) * 0.04})`;
      g.fillRect(rand(i + 1) * w, rand(i + 2) * h, 3 + rand(i + 3) * 8, 2);
    }
    g.fillStyle = '#ffe9a8';
    g.font = `800 74px ${FONT}`;
    g.textAlign = 'center';
    g.fillText(title, w / 2, 130);
    g.strokeStyle = 'rgba(255,233,168,0.7)';
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(110, 165);
    g.lineTo(w - 110, 165);
    g.stroke();
  });

export const Board: React.FC<{title: string; rows: Row[]; t0: number; position?: V3; rotation?: V3; scale?: number; visible?: boolean}> = ({
  title,
  rows,
  t0,
  position = [0, 0, 0],
  rotation,
  scale = 1,
  visible = true,
}) => {
  const f = useCurrentFrame();
  const tex = useMemo(() => boardTex(title), [title]);
  if (!visible) return null;
  const W = 2.4;
  const H = 3.0;
  const rowH = (H - 0.75) / Math.max(rows.length, 5);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[W, H, 0.06]} />
        <meshBasicMaterial attach="material-4" map={tex} toneMapped={false} />
        <meshToonMaterial attach="material-0" color="#5e3820" />
        <meshToonMaterial attach="material-1" color="#5e3820" />
        <meshToonMaterial attach="material-2" color="#5e3820" />
        <meshToonMaterial attach="material-3" color="#5e3820" />
        <meshToonMaterial attach="material-5" color="#5e3820" />
        <Line />
      </mesh>
      {rows.map((r, i) => {
        const a = cue(r.at, t0);
        if (f < a) return null;
        return (
          <group key={i} position={[0, H / 2 - 0.62 - i * rowH, 0.04]} scale={pop(f, a, 12)}>
            <TextPlane
              text={r.text}
              width={W - 0.25}
              height={rowH * 0.82}
              color={r.color ?? '#ffffff'}
              bg={r.strong ? 'rgba(255,210,63,0.18)' : undefined}
              font={0.62}
              glow={r.strong}
            />
          </group>
        );
      })}
    </group>
  );
};

// a small floating info card (icons + text) used for checklists / risk cards
const InfoCard: React.FC<{text: string; color: string; position: V3; show: number; f: number; w?: number}> = ({text, color, position, show, f, w = 1.4}) => (
  <group position={position} scale={pop(f, show, 12)}>
    <TextPlane text={text} width={w} height={0.36} bg={color} color="#1d1238" font={0.5} border="#1d1238" />
  </group>
);

const InsideLights: React.FC<{dim?: boolean}> = ({dim}) => (
  <>
    <color attach="background" args={['#2a1f55']} />
    <NightLights dir={[3, 6, 6]} keyColor="#ffe0bf" keyI={dim ? 0.6 : 1.4} fill={dim ? 0.6 : 1.0} />
  </>
);

/** front header so the open shop front frames interior shots */
const ShopHeader: React.FC = () => {
  const tex = useMemo(() => plasterTex('#e9a07a', 3, 1), []);
  return (
    <mesh position={[0, 4.0, 0.05]}>
      <boxGeometry args={[7, 2.7, 0.2]} />
      <Cel color="#ffffff" map={tex} />
      <Line />
    </mesh>
  );
};

// ---------------------------------------------------------------- 1. intro
export const Intro: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const end = cue(at(5), t0);
  const walk = prog(f, 0, cue(at(2), t0));
  return (
    <Stage>
      <Cam position={lerp3([0, 2.4, 14], [0.4, 1.9, 8.2], prog(f, 0, end))} target={lerp3([0, 3.2, 0], [0, 1.7, 0.6], prog(f, 0, end))} fov={34} />
      <MarketStreet />
      <Actor {...MASCOT} position={[lerp(-3.4, -1.1, walk), 0, 2.4]} rotY={0.3} walk={walk < 1} mood={f > cue(at(2), t0) ? 'happy' : 'smile'} talk={f > cue(at(3), t0) && f < cue(at(4), t0)} />
      <Actor {...CHEMIST} position={[1.0, 0, -1.7]} rotY={-0.3} mood="smile" handL={f > cue(at(4), t0) ? [0.55, 1.2, 0.3] : undefined} />
      <Actor {...DISTRIBUTOR} position={[2.8, 0, 2.1]} rotY={-0.4} mood="calm" />
    </Stage>
  );
};

// ---------------------------------------------------------------- 2. chain (journey) – reuse the sunset journey, time-scaled
export const Chain: React.FC<P> = ({t0}) => {
  // original journey is 237 frames long; stretch it over this section
  const dur = (at(7) - 0.25 - t0) * FPS;
  return <JourneyScene2 fs={237 / dur} fov={34} />;
};

// ---------------------------------------------------------------- 3. ₹100 split: margins + GST
const SHARES = [
  {key: 'company', label: 'BAAKI: COMPANY', share: 0.62, color: '#8ab4ff', at: at(9) - 0.6},
  {key: 'gst', label: 'GST ~5%', share: 0.05, color: '#ffb84d', at: at(9) + 0.6},
  {key: 'dist', label: 'DISTRIBUTOR 8–10%', share: 0.1, color: '#ffd23f', at: at(8) + 0.2},
  {key: 'chem', label: 'CHEMIST 16–20%', share: 0.2, color: '#2ee59d', at: at(8) + 3.9},
];
export const Split: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const tex = useMemo(rupeeNoteTexture, []);
  const appear = pop(f, 3, 20);
  const split = prog(f, cue(at(7) + 0.4, t0), cue(at(7) + 1.4, t0));
  const activeS = [...SHARES].sort((a, b) => b.at - a.at).find((s) => f >= cue(s.at, t0));
  const GAP = 0.09;
  let acc = 0;
  let x = -(NOTE_W + GAP * 3 * split) / 2;
  return (
    <Stage>
      <Cam position={[0, 2.1, 6.4]} target={[0, 1.85, -1]} fov={36} />
      <MarketStreet />
      <group position={[0.35, 2.3 + Math.sin(f * 0.06) * 0.03, 1.4]} scale={appear * 0.78}>
        {SHARES.map((s) => {
          const u0 = acc;
          acc += s.share;
          const u1 = acc;
          const w = NOTE_W * s.share;
          const cx = x + w / 2;
          x += w + GAP * split;
          const on = activeS?.key === s.key;
          return (
            <group key={s.key} position={[cx, on ? 0.15 * pop(f, cue(s.at, t0), 12) : 0, on ? 0.12 : 0]}>
              <NoteStrip tex={tex} u0={u0} u1={u1} />
              {on && <Glow color={s.color} size={1.6} opacity={0.5} position={[0, 0, -0.05]} />}
            </group>
          );
        })}
      </group>
      {activeS && (
        <group key={activeS.key} position={[0.35, 1.68, 1.4]} scale={pop(f, cue(activeS.at, t0) - 2, 12)}>
          <TextPlane text={activeS.label} width={1.9} height={0.34} bg={activeS.color} color="#1d1238" font={0.55} border="#1d1238" />
        </group>
      )}
      <Actor {...MASCOT} position={[-1.9, 0, 0.3]} rotY={0.4} mood={f > cue(at(10), t0) ? 'happy' : 'smile'} look={[0.4, 1]} />
      <Actor {...CHEMIST} position={[1.6, 0, -1.75]} rotY={-0.3} mood="smile" talk={f > cue(at(8), t0) && f < cue(at(9), t0)} />
    </Stage>
  );
};

// ---------------------------------------------------------------- 4. opening costs
export const Costs: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  // camera visits: wide → shelves (stock) → counter (interior) → fridge/PC → door (deposit) → board (total)
  const keys: [number, V3, V3][] = [
    [0, [0.2, 2.1, 5.2], [0, 1.7, -1.2]],
    [cue(at(13), t0), [-0.8, 1.9, 2.4], [-0.9, 1.5, -3.2]],
    [cue(at(15), t0), [0.6, 1.8, 2.2], [0.3, 1.1, -1.1]],
    [cue(at(16), t0), [0.3, 1.9, 1.8], [2.3, 1.1, -2.6]],
    [cue(at(18), t0), [0.2, 2.1, 5.2], [0, 1.7, -1.2]],
    [cue(at(19), t0), [-0.2, 2.0, 5.4], [-0.9, 1.8, -0.6]],
  ];
  let pos = keys[0][1];
  let tgt = keys[0][2];
  for (let i = 1; i < keys.length; i++) {
    const t = prog(f, keys[i][0], keys[i][0] + 24);
    pos = lerp3(pos, keys[i][1], t);
    tgt = lerp3(tgt, keys[i][2], t);
  }
  const tags: {text: string; at: number; until: number; pos: V3; color: string}[] = [
    {text: 'STOCK ₹5–8 LAKH', at: at(13) + 0.3, until: at(15) - 0.2, pos: [-0.9, 2.5, -2.6], color: '#ffd23f'},
    {text: 'INTERIOR ₹2–3 LAKH', at: at(15) + 0.3, until: at(16) - 0.2, pos: [0.3, 1.75, -0.6], color: '#ff9f43'},
    {text: 'FRIDGE + PC ₹50K–1 LAKH', at: at(16) + 0.3, until: at(18) - 0.2, pos: [2.0, 2.0, -2.0], color: '#4dabf7'},
  ];
  const wide = f < cue(at(13), t0) || f > cue(at(18) + 0.6, t0);
  return (
    <Stage>
      <Cam position={pos} target={tgt} fov={38} />
      <MarketStreet />
      {tags.map((t, i) => {
        const a = cue(t.at, t0);
        if (f < a || f > cue(t.until, t0)) return null;
        return (
          <group key={i} position={t.pos} scale={pop(f, a, 12)}>
            <TextPlane text={t.text} width={1.5} height={0.3} bg={t.color} color="#1d1238" font={0.5} border="#1d1238" />
          </group>
        );
      })}
      <Board
        visible={wide}
        t0={t0}
        title="KHARCHA"
        position={[-1.7, 1.45, 0.9]}
        rotation={[0, 0.4, 0]}
        scale={0.6}
        rows={[
          {text: 'Stock: ₹5–8 lakh', at: at(13) + 0.3},
          {text: 'Interior: ₹2–3 lakh', at: at(15) + 0.3},
          {text: 'Fridge + PC: ₹0.5–1 lakh', at: at(16) + 0.3},
          {text: 'Deposit: ₹0.5–2 lakh', at: at(18) + 0.3},
          {text: 'TOTAL: ₹8–15 lakh', at: at(19) + 0.5, color: '#ffd23f', strong: true},
        ]}
      />
      {(f < cue(at(13), t0) || f > cue(at(18) + 0.8, t0)) && <Actor {...MASCOT} position={[1.3, 0, 0.6]} rotY={-0.4} mood={f > cue(at(19), t0) ? 'shock' : 'smile'} />}
      <Actor {...CHEMIST} position={[-0.2, 0, -1.75]} mood="smile" talk={f < cue(at(12), t0)} />
    </Stage>
  );
};

// ---------------------------------------------------------------- 5. licence & rules
const licenseTex = () =>
  canvasTexture(768, 1000, (g, w, h) => {
    g.fillStyle = '#fffaf0';
    roundRect(g, 0, 0, w, h, 16);
    g.fill();
    g.strokeStyle = '#7b5a2a';
    g.lineWidth = 14;
    roundRect(g, 18, 18, w - 36, h - 36, 12);
    g.stroke();
    g.fillStyle = '#1d1238';
    g.textAlign = 'center';
    g.font = `800 64px ${FONT}`;
    g.fillText('DRUG LICENSE', w / 2, 140);
    g.font = `700 40px ${FONT}`;
    g.fillText('Retail • Form 20 & 21', w / 2, 210);
    g.fillStyle = 'rgba(29,18,56,0.3)';
    for (let i = 0; i < 9; i++) g.fillRect(110, 300 + i * 52, w - 220, 12);
    g.fillStyle = '#1d1238';
    g.font = `600 30px ${FONT}`;
    g.fillText('Drug Control Department', w / 2, h - 120);
  });

export const License: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const tex = useMemo(licenseTex, []);
  const stamp = cue(at(23) + 1.0, t0);
  const toShop = prog(f, cue(at(24) - 0.3, t0), cue(at(24) + 0.6, t0));
  return (
    <Stage bg="#120c33">
      {toShop < 1 ? (
        <>
          <Cam position={lerp3([0, 3, 15], [0.4, 2.2, 9], prog(f, 0, cue(at(23), t0)))} target={[0, 2.6, -2]} fov={36} />
          <HeritageCourt />
          <group position={[1.6, 2.4, 1.5]} rotation={[0, -0.2, 0]} scale={pop(f, cue(at(22) + 0.5, t0), 16)}>
            <mesh>
              <planeGeometry args={[1.2, 1.56]} />
              <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
            {f >= stamp && (
              <group position={[0.25, -0.45, 0.02]} scale={1 + 0.4 * (1 - pop(f, stamp, 8))} rotation={[0, 0, -0.3]}>
                <mesh>
                  <ringGeometry args={[0.16, 0.2, 32]} />
                  <meshBasicMaterial color="#d62828" transparent opacity={0.9} />
                </mesh>
                <TextPlane text="APPROVED" width={0.5} height={0.12} color="#d62828" font={0.7} position={[0, 0, 0.001]} />
              </group>
            )}
          </group>
          <Actor {...MASCOT} position={[-1.4, 0.9, -1.6]} scale={0.8} rotY={0.4} mood="smile" />
        </>
      ) : (
        <>
          <Cam position={[0.1, 2.05, 5.0]} target={[0, 1.8, -1]} fov={36} />
          <MarketStreet />
          {/* pharmacist with degree scroll */}
          <Actor {...CHEMIST} position={[-0.4, 0, -1.75]} mood="happy" handR={[-0.5, 1.1, 0.3]} />
          <group position={[-0.4, 1.95, -1.3]} scale={pop(f, cue(at(24) + 2.5, t0), 12)}>
            <TextPlane text="D.Pharm / B.Pharm ✓" width={1.4} height={0.3} bg="#ffffff" color="#1d1238" font={0.5} border="#1d1238" />
          </group>
          <Board
            t0={t0}
            title="ZAROORI"
            position={[1.7, 1.45, 0.9]}
            rotation={[0, -0.35, 0]}
            scale={0.62}
            rows={[
              {text: 'Pharmacist ✓', at: at(24) + 1},
              {text: 'Dukaan 10 sq m+ ✓', at: at(26) + 1.2},
              {text: 'Fridge ✓', at: at(26) + 3.5},
              {text: 'GST + Shop Reg. ✓', at: at(26) + 5.2},
              {text: 'Fees: kuch hazaar', at: at(27) + 0.5, color: '#ffd23f'},
              {text: 'Time: 1–2 mahine', at: at(27) + 3.6, color: '#ffd23f'},
            ]}
          />
          <Actor {...MASCOT} position={[-1.7, 0, 0.6]} rotY={0.3} mood={f > cue(at(25), t0) ? 'worried' : 'smile'} />
        </>
      )}
    </Stage>
  );
};

// ---------------------------------------------------------------- 6. income
export const Income: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  // customers walking across the street to the shop
  const walkers = [0, 1, 2].map((i) => {
    const start = cue(at(29) + i * 1.6, t0);
    const t = prog(f, start, start + 90, Easing.linear);
    return {x: lerp(-5.5 - i, -1.6 + i * 1.1, t), on: f > start, moving: t > 0 && t < 1, i};
  });
  return (
    <Stage>
      <Cam position={[0.6, 2.2, 10]} target={[0.4, 1.9, 0.4]} fov={34} />
      <MarketStreet />
      {walkers.map((w) =>
        w.on ? (
          <Actor key={w.i} {...(w.i === 1 ? DISTRIBUTOR : MASCOT)} position={[w.x, 0, 1.7 + w.i * 0.25]} rotY={0.6} walk={w.moving} mood="smile" seed={w.i + 4} scale={0.95} />
        ) : null,
      )}
      <Actor {...CHEMIST} position={[-0.6, 0, -1.7]} mood={f > cue(at(33), t0) ? 'happy' : 'smile'} handL={f > cue(at(34), t0) ? [0.6, 1.2, 0.3] : undefined} />
      {f > cue(at(29), t0) &&
        Array.from({length: 10}).map((_, i) => {
          const t = ((f - cue(at(29), t0) + i * 9) % 60) / 60;
          return <Coin key={i} position={[-0.6 + (rand(i) - 0.5) * 1.2, 1.4 + t * 1.4, -1.2]} rotation={[f * 0.2, i, 0]} scale={0.9 * (1 - t * 0.5)} />;
        })}
      <Board
        t0={t0}
        title="KAMAAI"
        position={[2.55, 2.55, 1.4]}
        rotation={[0, -0.3, 0]}
        scale={0.62}
        rows={[
          {text: 'Roz sale: ₹20,000', at: at(29) + 0.5},
          {text: '× 30 din = ₹6 lakh', at: at(30) + 0.3},
          {text: 'Avg margin: ~20%', at: at(31) + 2.5},
          {text: 'Gross: ≈ ₹1.2 lakh', at: at(32) + 0.6, color: '#3dffb0', strong: true},
          {text: 'Lekin… kharche?', at: at(34), color: '#ff8a8a'},
        ]}
      />
    </Stage>
  );
};

// ---------------------------------------------------------------- 7. expenses
const BILLS = [
  {label: 'KIRAYA', color: '#e63946', at: 35},
  {label: 'SALARY', color: '#3d6fd8', at: 36},
  {label: 'BIJLI BILL', color: '#e67700', at: 37},
  {label: 'SOFTWARE', color: '#7b2cbf', at: 38},
];
export const Expenses: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const landed = BILLS.filter((b) => f > cue(at(b.at), t0) + 10).length + (f > cue(at(39), t0) ? 1 : 0) + (f > cue(at(42), t0) ? 2 : 0);
  const coins = Math.max(2, 14 - landed * 1.8);
  const worried = f > cue(at(36), t0);
  const flick = f > cue(at(37), t0) && f < cue(at(37) + 3, t0) ? (rand(Math.floor(f / 3)) > 0.35 ? 1 : 0.35) : 1;
  return (
    <Stage>
      <Cam position={[0.3, 2.15, 4.8]} target={[0.1, 1.6, -1.2]} fov={38} />
      <MarketStreet />
      <Actor {...CHEMIST} position={[-0.3, 0, -1.75]} mood={worried ? 'worried' : 'smile'} sweat={f > cue(at(38), t0)} />
      <group position={[0.65, 1.28, -0.95]}>
        {Array.from({length: Math.round(coins)}).map((_, i) => (
          <Coin key={i} position={[(i % 2) * 0.01, 0.02 + i * 0.045, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.1} />
        ))}
        <TextPlane text="PROFIT" width={0.7} height={0.2} position={[0, Math.round(coins) * 0.045 + 0.22, 0]} color="#2ee59d" font={0.8} glow />
      </group>
      {BILLS.map((b, i) => {
        const a = cue(at(b.at), t0);
        if (f < a) return null;
        const t = prog(f, a, a + 12, Easing.in(Easing.quad));
        const wob = (1 - t) * Math.sin(f * 0.5 + i) * 0.5;
        return (
          <group key={b.label} position={[-1.15 + i * 0.12, 1.32 + i * 0.03 + (1 - t) * 2.4, -0.9 + i * 0.05]} rotation={[0.35 + wob, (i - 1.5) * 0.25, wob * 0.5]}>
            <Bill label={b.label} color={b.color} />
          </group>
        );
      })}
      {f >= cue(at(39), t0) && (
        <group position={[0.15, 1.32 + (1 - prog(f, cue(at(39), t0), cue(at(39), t0) + 12, Easing.in(Easing.quad))) * 2.4, -0.8]}>
          <MedBox size={[0.42, 0.3, 0.3]} color="#adb5bd" position={[0, 0.15, 0]} outline />
          <group position={[0, 0.5, 0.1]} scale={pop(f, cue(at(39), t0) + 12)}>
            <TextPlane text="EXPIRED" width={0.8} height={0.22} bg="#ff2d2d" color="#ffffff" font={0.62} />
          </group>
        </group>
      )}
      {/* online pharmacy phone with discount */}
      {f >= cue(at(41), t0) && (
        <group position={[-1.0, 2.35, -0.6]} scale={pop(f, cue(at(41), t0), 14)} rotation={[0, 0.25, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.9, 0.05]} />
            <Cel color="#2b2d42" />
            <Line />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.44, 0.8]} />
            <Lit color="#e9f2ff" />
          </mesh>
          <TextPlane text="-20%" width={0.4} height={0.2} position={[0, 0.12, 0.04]} color="#e63946" font={0.8} />
          <TextPlane text="ONLINE" width={0.4} height={0.1} position={[0, -0.12, 0.04]} color="#1d1238" font={0.8} />
        </group>
      )}
      <Board
        t0={t0}
        title="KHARCHE"
        position={[1.7, 1.45, 0.9]}
        rotation={[0, -0.4, 0]}
        scale={0.6}
        rows={[
          {text: 'Kiraya: ₹20–30K', at: at(35)},
          {text: 'Salary: ₹25–30K', at: at(36)},
          {text: 'Bijli: ₹4–5K', at: at(37) + 1.5},
          {text: 'Software: ₹3–5K', at: at(38)},
          {text: 'Expiry loss: ₹5–6K', at: at(39)},
          {text: 'Discount: 5–10%', at: at(42) + 1, color: '#ff8a8a'},
          {text: 'NET: ₹40–60K', at: at(43) + 1.2, color: '#3dffb0', strong: true},
        ]}
      />
    </Stage>
  );
};

// ---------------------------------------------------------------- 8. secret 1: generic
const janAushadhiTex = () =>
  canvasTexture(640, 160, (g, w, h) => {
    g.fillStyle = '#0f9d58';
    roundRect(g, 0, 0, w, h, 20);
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = `800 56px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('JAN AUSHADHI KENDRA', w / 2, h / 2 + 3);
  });

export const Generic: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const jan = useMemo(janAushadhiTex, []);
  const reveal = prog(f, cue(at(44) + 1.5, t0), cue(at(44) + 2.6, t0));
  const showJan = f > cue(at(47), t0);
  return (
    <Stage bg="#120b2c">
      <Cam position={lerp3([0.1, 1.9, 5.4], [-0.1, 2.0, 4.6], reveal)} target={lerp3([0, 1.6, 0], [-0.2, 1.6, -2.4], reveal)} fov={38} />
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
      </group>
      {/* branded vs generic margin bars */}
      {f > cue(at(45), t0) && (
        <group position={[1.7, 0.9, -0.8]} rotation={[0, -0.4, 0]}>
          {[
            {label: 'BRANDED', v: 0.2, col: '#8ab4ff', x: -0.35, a: at(45)},
            {label: 'GENERIC', v: 0.55, col: '#3dffb0', x: 0.35, a: at(45) + 4},
          ].map((b) => {
            const t = prog(f, cue(b.a, t0), cue(b.a, t0) + 20);
            const h = b.v * 3 * t;
            return (
              <group key={b.label} position={[b.x, 0, 0]}>
                <mesh position={[0, h / 2, 0]}>
                  <boxGeometry args={[0.45, Math.max(0.01, h), 0.3]} />
                  <Cel color={b.col} />
                  <Line />
                </mesh>
                <TextPlane text={`${Math.round(b.v * 100 * t)}%`} width={0.5} height={0.18} position={[0, h + 0.15, 0]} color="#ffffff" font={0.8} />
                <TextPlane text={b.label} width={0.6} height={0.12} position={[0, -0.1, 0.16]} color="#ffffff" font={0.8} />
              </group>
            );
          })}
        </group>
      )}
      {showJan && (
        <group position={[-0.2, 3.05, -2.7]} scale={pop(f, cue(at(47), t0), 14)}>
          <mesh>
            <planeGeometry args={[1.9, 0.48]} />
            <meshBasicMaterial map={jan} toneMapped={false} />
          </mesh>
          <Glow color="#59ffbf" size={2.5} opacity={0.25} />
        </group>
      )}
      <Actor {...CHEMIST} position={[lerp(0, -1.3, reveal), 0, lerp(0.7, -0.3, reveal)]} rotY={lerp(0, 0.5, reveal)} mood={f < cue(at(44) + 1.5, t0) ? 'sly' : 'happy'} talk={f < cue(at(44) + 1.4, t0)} />
    </Stage>
  );
};

// ---------------------------------------------------------------- 9. secret 2: the other counter
const ProductRow: React.FC<{f: number; t0: number}> = ({f, t0}) => {
  const items: {label: string; color: string; kind: 'jar' | 'box' | 'bottle'; a: number}[] = [
    {label: 'COSMETICS', color: '#ff8fd8', kind: 'bottle', a: at(49) + 3.2},
    {label: 'PROTEIN', color: '#ffd43b', kind: 'jar', a: at(49) + 4.6},
    {label: 'BABY', color: '#9fd8ff', kind: 'box', a: at(49) + 6.0},
    {label: 'SUGAR-FREE', color: '#b197fc', kind: 'box', a: at(49) + 8.2},
    {label: 'BP MACHINE', color: '#ffffff', kind: 'box', a: at(49) + 10.3},
  ];
  return (
    <group position={[0.4, 1.32, -1.0]}>
      {items.map((it, i) => {
        const a = cue(it.a, t0);
        const s = pop(f, a, 12);
        const x = -1.2 + i * 0.6;
        return (
          <group key={it.label} position={[x, 0, 0]} scale={s}>
            {it.kind === 'jar' ? (
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.4, 20]} />
                <Cel color={it.color} />
                <Line t={40} />
              </mesh>
            ) : it.kind === 'bottle' ? (
              <mesh position={[0, 0.22, 0]}>
                <cylinderGeometry args={[0.09, 0.12, 0.44, 16]} />
                <Cel color={it.color} />
                <Line t={40} />
              </mesh>
            ) : (
              <mesh position={[0, 0.17, 0]}>
                <boxGeometry args={[0.38, 0.34, 0.24]} />
                <Cel color={it.color} />
                <Line />
              </mesh>
            )}
            <TextPlane text={it.label} width={0.56} height={0.12} position={[0, 0.55, 0.1]} bg="#1d1238" color="#ffffff" font={0.6} />
          </group>
        );
      })}
    </group>
  );
};

export const Counter: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const services = prog(f, cue(at(51) - 0.2, t0), cue(at(51) + 0.8, t0));
  return (
    <Stage>
      <Cam position={lerp3([0.4, 2.0, 4.6], [0.3, 2.2, 5.4], services)} target={[0.3, 1.7, -1.0]} fov={38} />
      <MarketStreet />
      <ProductRow f={f} t0={t0} />
      <Glow position={[0.4, 1.7, -0.7]} color="#ff4fd8" size={4} opacity={0.18} />
      {[
        {text: 'SAMPLE COLLECTION', color: '#9fd8ff', pos: [-1.3, 2.15, 1.3] as V3, a: at(51) + 1.6},
        {text: 'HOME DELIVERY', color: '#ffd23f', pos: [0.3, 2.4, 1.3] as V3, a: at(51) + 3.4},
        {text: 'MONTHLY ORDER', color: '#2ee59d', pos: [1.4, 2.15, 1.3] as V3, a: at(51) + 5.2},
      ].map((c) => (
        <InfoCard key={c.text} text={c.text} color={c.color} position={c.pos} show={cue(c.a, t0)} f={f} />
      ))}
      <Actor {...CHEMIST} position={[-1.0, 0, -1.75]} rotY={0.2} mood={f > cue(at(52), t0) ? 'happy' : 'smile'} talk={f < cue(at(49) + 3, t0)} />
      <Actor {...MASCOT} position={[1.7, 0, 0.5]} rotY={-0.45} mood={f > cue(at(50), t0) ? 'shock' : 'smile'} />
      <Sparkles at={cue(at(52), t0)} f={f} position={[0.4, 2.2, 0]} color="#ffe14d" n={18} spread={1.8} />
    </Stage>
  );
};

// ---------------------------------------------------------------- 10. risks
export const Risks: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  const happy = f > cue(at(56), t0);
  return (
    <Stage>
      <Cam position={[0.2, 2.1, 5.0]} target={[0.1, 1.75, -1.0]} fov={38} />
      <MarketStreet dim={!happy} />
      {[
        {text: 'ONLINE COMPETITION', color: '#ff8a8a', pos: [-1.3, 2.2, 1.3] as V3, a: at(54) + 0.3},
        {text: 'EXPIRY', color: '#ffb84d', pos: [-1.3, 1.75, 1.3] as V3, a: at(54) + 2.4},
        {text: 'UDHAAR', color: '#ffd23f', pos: [1.35, 2.2, 1.3] as V3, a: at(54) + 4.2},
        {text: 'SAKHT NIYAM', color: '#9fd8ff', pos: [1.35, 1.75, 1.3] as V3, a: at(54) + 6.0},
      ].map((c) => (
        <InfoCard key={c.text} text={c.text} color={c.color} position={c.pos} show={cue(c.a, t0)} f={f} w={1.3} />
      ))}
      {f > cue(at(55), t0) && f < cue(at(56), t0) && (
        <group position={[0.1, 2.55, 1.4]} scale={pop(f, cue(at(55), t0), 12)}>
          <TextPlane text="BINA PRESCRIPTION = GALAT ✗" width={2.6} height={0.36} bg="#ff2d2d" color="#ffffff" font={0.5} border="#1d1238" />
        </group>
      )}
      <Actor {...CHEMIST} position={[0.1, 0, -1.75]} mood={happy ? 'happy' : 'worried'} sweat={!happy && f > cue(at(54), t0)} />
      {happy && <Sparkles at={cue(at(56), t0)} f={f} position={[0.1, 2.4, -1]} color="#3dffb0" n={18} spread={1.6} />}
    </Stage>
  );
};

// ---------------------------------------------------------------- 11. outro
export const Outro: React.FC<P> = ({t0}) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam position={lerp3([0, 2.0, 9.4], [0.2, 1.9, 8.2], prog(f, 0, 600))} target={[0.2, 1.75, 0.8]} fov={34} />
      <MarketStreet />
      <Actor {...MASCOT} position={[-0.9, 0, 2.2]} rotY={0.2} mood="happy" talk={f < cue(at(58) + 3, t0)} handR={f > cue(at(63), t0) ? [-0.55, 1.25, 0.3] : undefined} />
      <Actor {...CHEMIST} position={[1.0, 0, -1.7]} rotY={-0.3} mood="smile" handL={f > cue(at(64), t0) ? [0.55, 1.2, 0.3] : undefined} />
      <Actor {...DISTRIBUTOR} position={[2.5, 0, 2.0]} rotY={-0.4} mood="happy" />
      {f > cue(at(59), t0) && f < cue(at(63), t0) && (
        <group position={[2.3, 3.0, 1.2]} rotation={[0, -0.2, 0]} scale={pop(f, cue(at(59), t0), 14)}>
          <TextPlane text="Sab numbers andaaza hain" width={2.4} height={0.36} bg="#fffaf0" color="#1d1238" font={0.5} border="#1d1238" />
          <TextPlane text="Expert se salaah lein" width={2.4} height={0.36} bg="#fffaf0" color="#1d1238" font={0.5} border="#1d1238" position={[0, -0.45, 0]} />
        </group>
      )}
      <Sparkles at={cue(at(63), t0)} f={f} position={[-0.9, 3.0, 2.4]} color="#ffe14d" n={18} spread={1.8} />
    </Stage>
  );
};

export const _u = {Carton, QuestionMark, Lock, THREE, Coin};
