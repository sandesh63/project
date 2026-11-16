import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Callout} from '../timeline';

const FONT = 'Poppins, sans-serif';

type Word = {text: string; start: number; end: number};

/** Spread words across [from, to] seconds, weighted by length (until real VO timings exist). */
const timeWords = (vo: string, from: number, to: number): Word[] => {
  const words = vo.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.replace(/[^\p{L}\p{N}₹%]/gu, '').length + 2 + (/[.,!?…:]$/.test(w) ? 3 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = from;
  return words.map((w, i) => {
    const d = ((to - from) * weights[i]) / total;
    const out = {text: w, start: t, end: t + d};
    t += d;
    return out;
  });
};

/** Group into 1–3 word chunks, breaking after punctuation. */
const chunk = (words: Word[]) => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w) => {
    cur.push(w);
    const len = cur.reduce((a, b) => a + b.text.length, 0);
    if (cur.length >= 3 || /[.,!?…:]$/.test(w.text) || len > 14) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
};

const KEY = /₹|\d|%|GST|MRP|FREE|free|profit|margin|secret|chemist|link/i;

export const Captions: React.FC<{vo: string; duration: number}> = ({vo, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunk(timeWords(vo, 0.15, duration - 0.3)), [vo, duration]);
  const idx = chunks.findIndex((c) => t >= c[0].start && t < c[c.length - 1].end);
  if (idx < 0) return null;
  const c = chunks[idx];
  const local = frame - Math.round(c[0].start * fps);
  const s = spring({frame: local, fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', top: '57%'}}>
      <div
        style={{
          transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 30}px)`,
          display: 'flex',
          gap: 22,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 940,
        }}
      >
        {c.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.05;
          const hot = KEY.test(w.text);
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 92,
                lineHeight: 1.05,
                color: active ? (hot ? '#3dffb0' : '#ffe14d') : '#ffffff',
                WebkitTextStroke: '14px #120a2a',
                paintOrder: 'stroke fill',
                textShadow: '0 8px 0 rgba(10,4,30,0.55)',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                display: 'inline-block',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const CalloutChip: React.FC<{c: Callout; sceneDur: number}> = ({c, sceneDur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = Math.round(c.at * fps);
  const b = Math.round((c.until ?? sceneDur - 0.15) * fps);
  if (frame < a || frame > b) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 9, stiffness: 180}});
  const out = interpolate(frame, [b - 6, b], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wobble = Math.sin((frame - a) * 0.15) * 1.5;
  return (
    <AbsoluteFill style={{alignItems: 'center', top: '11%'}}>
      <div
        style={{
          transform: `scale(${s * out}) rotate(${-4 + wobble}deg)`,
          background: c.color ?? '#ffd23f',
          color: '#140a2e',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 86,
          padding: '18px 44px',
          borderRadius: 28,
          border: '8px solid #140a2e',
          boxShadow: '0 14px 0 #140a2e, 0 0 60px rgba(255,255,255,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

/** Big bouncing arrow pointing at the "related video" button. */
export const DownArrow: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 10}});
  const bob = Math.abs(Math.sin((frame - from) * 0.22)) * 40;
  return (
    <AbsoluteFill style={{alignItems: 'center', top: '76%'}}>
      <svg width={220} height={240} viewBox="0 0 220 240" style={{transform: `translateY(${bob}px) scale(${s})`}}>
        <path d="M70 10 h80 v110 h55 L110 230 L15 120 h55 z" fill="#ffe14d" stroke="#120a2a" strokeWidth={14} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(8,3,25,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);

/** Quick fade from black at a cut. */
export const CutIn: React.FC<{frames?: number}> = ({frames = 6}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, frames], [1, 0], {extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: '#0b0620', opacity: o}} />;
};
