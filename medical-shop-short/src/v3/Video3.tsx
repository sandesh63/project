import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, FRAMES, SCENES, SceneId, WORDS, CALLOUTS, SFX, Word} from './timeline';
import {Hook, Split, Scheme, Govt, Expenses, Cliff, Cta} from './scenes';
import {JourneyScene} from '../three/sets/scenes2';

const FONT = 'Poppins, sans-serif';

// ---------- fixed screen zones (no text ever overlaps) ----------
// callouts: top band 7%–15%   |   captions: 74%–81%   |   CTA arrow: 84%–94%
const CALLOUT_TOP = '7%';
const CAPTION_TOP = '74%';
const ARROW_TOP = '84%';

const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [h] = useState(() => delayRender('fonts'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.all([document.fonts.load('800 64px Poppins', 'Aa₹1'), document.fonts.load('700 64px Poppins', 'Aa₹1'), document.fonts.load('700 46px Poppins', 'भारतीय रिज़र्व बैंक १००'), document.fonts.load('600 22px Poppins', 'मैं धारक')])
      .catch(() => undefined)
      .then(() => {
        setOk(true);
        continueRender(h);
      });
  }, [h]);
  return ok ? <>{children}</> : null;
};

const SCENE_COMP: Record<SceneId, React.FC<{t0: number}>> = {
  hook: Hook,
  journey: () => <JourneyScene />,
  split: Split,
  scheme: Scheme,
  govt: Govt,
  expenses: Expenses,
  cliff: Cliff,
  cta: Cta,
};

// ---------- captions ----------
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
    if (cur.length >= 2 || len >= 13 || /[.,!?…:]$/.test(w.text) || gap > 0.15) flush();
  });
  flush();
  // each chunk stays until the next starts (no two chunks on screen at once)
  out.forEach((c, i) => {
    const n = out[i + 1];
    c.end = n ? Math.min(n.start, c.end + 0.35) : c.end + 0.5;
  });
  return out;
};
const HOT = /₹|\d|%|GST|MRP|FREE|free|profit|margin|secrets?|chemist|link|company|distributor/i;

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
      <div style={{display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960, transform: `scale(${0.75 + 0.25 * s})`}}>
        {c.words.map((w, i) => {
          const on = t >= w.start && t < w.end + 0.04;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 88,
                lineHeight: 1.08,
                color: on ? (HOT.test(w.text) ? '#3dffb0' : '#ffe14d') : '#ffffff',
                WebkitTextStroke: '9px #120a2a',
                paintOrder: 'stroke fill',
                textShadow: '0 7px 0 rgba(10,4,30,0.55)',
                display: 'inline-block',
                transform: on ? 'scale(1.07)' : 'none',
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
          transform: `scale(${s * out}) rotate(${-3 + Math.sin((frame - a) * 0.15) * 1.2}deg)`,
          background: c.color,
          color: '#140a2e',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 78,
          padding: '14px 40px',
          borderRadius: 26,
          border: '7px solid #140a2e',
          boxShadow: '0 12px 0 #140a2e',
          whiteSpace: 'nowrap',
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

const DownArrow: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 10}});
  const bob = Math.abs(Math.sin((frame - from) * 0.22)) * 26;
  return (
    <AbsoluteFill style={{top: ARROW_TOP, alignItems: 'center'}}>
      <svg width={170} height={190} viewBox="0 0 220 240" style={{transform: `translateY(${bob}px) scale(${s})`}}>
        <path d="M70 10 h80 v110 h55 L110 230 L15 120 h55 z" fill="#ffe14d" stroke="#120a2a" strokeWidth={14} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 58%, rgba(10,4,30,0.5) 100%)', pointerEvents: 'none'}} />
);

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 1, 4], [0.9, 0.9, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#fffaf0', opacity: o}} />;
};

const CutIn: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5], [1, 0], {extrapolateRight: 'clamp'});
  return o > 0 ? <AbsoluteFill style={{background: '#0b0620', opacity: o}} /> : null;
};

export const Video3: React.FC<{withAudio?: boolean}> = ({withAudio = false}) => {
  const end = FRAMES;
  return (
    <FontGate>
      <AbsoluteFill style={{background: '#0b0620'}}>
        {SCENES.map((s) => {
          const C = SCENE_COMP[s.id];
          const from = Math.round(s.start * FPS);
          const dur = Math.round(s.end * FPS) - from;
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              <C t0={s.start} />
              <CutIn />
            </Sequence>
          );
        })}
        <Sequence from={Math.round(5.0 * FPS) - 1} durationInFrames={5}>
          <Flash />
        </Sequence>
        <Grade />
        <Callouts />
        <Captions />
        <DownArrow from={Math.round(68.6 * FPS)} />

        {withAudio && (
          <>
            <Audio src={staticFile('vo.mp3')} volume={1} />
            <Audio
              src={staticFile('music.mp3')}
              volume={(f) => interpolate(f, [0, 15, end - 45, end], [0, 0.13, 0.13, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
            />
            <Sequence from={0} durationInFrames={Math.round(5 * FPS)}>
              <Audio src={staticFile('sfx/market.mp3')} volume={0.12} />
            </Sequence>
            <Sequence from={Math.round(62.15 * FPS)} durationInFrames={end - Math.round(62.15 * FPS)}>
              <Audio src={staticFile('sfx/market.mp3')} startFrom={30 * FPS} volume={0.1} />
            </Sequence>
            {SFX.map((x, i) => (
              <Sequence key={i} from={Math.round(x.at * FPS)} durationInFrames={Math.round(6 * FPS)}>
                <Audio src={staticFile(`sfx/${x.file}.mp3`)} volume={x.vol} />
              </Sequence>
            ))}
          </>
        )}
      </AbsoluteFill>
    </FontGate>
  );
};
