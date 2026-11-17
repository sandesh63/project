import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Sequence, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, SECTIONS, SectionId, WORDS, CALLOUTS, Word} from './timeline';
import {Intro, Chain, Split, Costs, License, Income, Expenses, Generic, Counter, Risks, Outro} from './scenes';

const FONT = 'Poppins, sans-serif';

// screen zones (16:9): callouts top band 5–13%, captions lower band 82–92%
const CALLOUT_TOP = '5%';
const CAPTION_TOP = '82%';

const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [h] = useState(() => delayRender('fonts'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load('800 64px Poppins', 'Aa₹1✓✗'),
      document.fonts.load('700 64px Poppins', 'Aa₹1'),
      document.fonts.load('700 46px Poppins', 'भारतीय रिज़र्व बैंक १००'),
      document.fonts.load('600 22px Poppins', 'मैं धारक'),
    ])
      .catch(() => undefined)
      .then(() => {
        setOk(true);
        continueRender(h);
      });
  }, [h]);
  return ok ? <>{children}</> : null;
};

const COMP: Record<SectionId, React.FC<{t0: number}>> = {
  intro: Intro,
  chain: Chain,
  split: Split,
  costs: Costs,
  license: License,
  income: Income,
  expenses: Expenses,
  generic: Generic,
  counter: Counter,
  risks: Risks,
  outro: Outro,
};

type Chunk = {words: Word[]; start: number; end: number};
const buildChunks = (): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const next = WORDS[i + 1];
    cur.push(w);
    const len = cur.reduce((a, b) => a + b.text.length, 0);
    const gap = next ? next.start - w.end : 1;
    if (cur.length >= 3 || len >= 18 || /[.,!?…:]$/.test(w.text) || gap > 0.15) flush();
  });
  flush();
  out.forEach((c, i) => {
    const n = out[i + 1];
    c.end = n ? Math.min(n.start, c.end + 0.35) : c.end + 0.5;
  });
  return out;
};
const HOT = /₹|\d|%|GST|MRP|profit|margin|secrets?|chemist|license|generic|discount/i;

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(buildChunks, []);
  const c = chunks.find((k) => t >= k.start && t < k.end);
  if (!c) return null;
  const s = spring({frame: frame - Math.round(c.start * fps), fps, config: {damping: 13, stiffness: 230, mass: 0.6}});
  return (
    <AbsoluteFill style={{top: CAPTION_TOP, alignItems: 'center', justifyContent: 'flex-start'}}>
      <div style={{display: 'flex', gap: 18, transform: `scale(${0.8 + 0.2 * s})`}}>
        {c.words.map((w, i) => {
          const on = t >= w.start && t < w.end + 0.04;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 64,
                color: on ? (HOT.test(w.text) ? '#3dffb0' : '#ffe14d') : '#ffffff',
                WebkitTextStroke: '8px #120a2a',
                paintOrder: 'stroke fill',
                textShadow: '0 5px 0 rgba(10,4,30,0.55)',
                transform: on ? 'scale(1.06)' : 'none',
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

const Callouts: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = CALLOUTS.find((k) => frame >= k.at * fps && frame <= k.until * fps);
  if (!c) return null;
  const a = Math.round(c.at * fps);
  const b = Math.round(c.until * fps);
  const s = spring({frame: frame - a, fps, config: {damping: 9, stiffness: 180}});
  const out = interpolate(frame, [b - 6, b], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{top: CALLOUT_TOP, alignItems: 'center'}}>
      <div
        style={{
          transform: `scale(${s * out}) rotate(${-2 + Math.sin((frame - a) * 0.15) * 1}deg)`,
          background: c.color,
          color: '#140a2e',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 58,
          padding: '10px 34px',
          borderRadius: 22,
          border: '6px solid #140a2e',
          boxShadow: '0 10px 0 #140a2e',
          whiteSpace: 'nowrap',
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(10,4,30,0.45) 100%)'}} />;

const Dissolve: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 7], [1, 0], {extrapolateRight: 'clamp'});
  return o > 0 ? <AbsoluteFill style={{background: '#0b0620', opacity: o}} /> : null;
};

export const LongVideo: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{background: '#0b0620'}}>
      {SECTIONS.map((s) => {
        const C = COMP[s.id];
        const from = Math.round(s.start * FPS);
        const dur = Math.round(s.end * FPS) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <C t0={s.start} />
            <Dissolve />
          </Sequence>
        );
      })}
      <Grade />
      <Callouts />
      <Captions />
    </AbsoluteFill>
  </FontGate>
);
