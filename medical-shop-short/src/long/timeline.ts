// Long video (16:9, 30 fps) timeline, locked to public/vo_long.mp3 (313.18 s).
// clauses.json = the 64 script sentences aligned to the voiceover pauses (scripts/align_long.py).
import CL from './clauses.json';

export const FPS = 30;
export const DURATION = 314.2;
export const FRAMES = Math.round(DURATION * FPS);

export type Clause = {t0: number; t1: number; section: string; text: string};
export const CLAUSES = CL as Clause[];

const SPOKEN: Record<string, number> = {'₹100': 10, '₹20': 6, '₹20,000': 12, '₹5': 5, '₹2': 5, '₹50': 7, '₹8': 5, '₹1': 4, '₹25': 8, '₹4': 5, '₹3': 5, '₹40': 7, '₹6': 5, MRP: 9, GST: 9, 'C&F': 8, '20%': 12, '50%': 14};
export type Word = {text: string; start: number; end: number};
export const WORDS: Word[] = CLAUSES.flatMap((c) => {
  const toks = c.text.split(/\s+/).filter(Boolean);
  const weight = (t: string) => {
    const bare = t.replace(/[^\p{L}\p{N}₹%&,]/gu, '').replace(/,$/, '');
    return (SPOKEN[bare] ?? (/^\d+$/.test(bare) ? 5 : bare.length)) + 1.5 + (/[,…!?.]$/.test(t) ? 1.5 : 0);
  };
  const total = toks.reduce((a, t) => a + weight(t), 0);
  let t = c.t0;
  return toks.map((tok) => {
    const d = ((c.t1 - c.t0) * weight(tok)) / total;
    const w = {text: tok, start: t, end: t + d};
    t += d;
    return w;
  });
});

/** start time of the n-th sentence (1-based) – used to cue animations */
export const at = (n: number) => CLAUSES[n - 1].t0;

export type SectionId = 'intro' | 'chain' | 'split' | 'costs' | 'license' | 'income' | 'expenses' | 'generic' | 'counter' | 'risks' | 'outro';
export const SECTIONS: {id: SectionId; start: number; end: number}[] = [
  {id: 'intro', start: 0, end: at(5) - 0.3},
  {id: 'chain', start: at(5) - 0.3, end: at(7) - 0.25},
  {id: 'split', start: at(7) - 0.25, end: at(11) - 0.3},
  {id: 'costs', start: at(11) - 0.3, end: at(21) - 0.3},
  {id: 'license', start: at(21) - 0.3, end: at(28) - 0.3},
  {id: 'income', start: at(28) - 0.3, end: at(35) - 0.3},
  {id: 'expenses', start: at(35) - 0.3, end: at(44) - 0.3},
  {id: 'generic', start: at(44) - 0.3, end: at(49) - 0.3},
  {id: 'counter', start: at(49) - 0.3, end: at(53) - 0.3},
  {id: 'risks', start: at(53) - 0.3, end: at(57) - 0.3},
  {id: 'outro', start: at(57) - 0.3, end: DURATION},
];

// top-band callouts (one at a time)
export const CALLOUTS: {text: string; at: number; until: number; color: string}[] = [
  {text: '2 SECRETS', at: at(2) + 0.6, until: at(3), color: '#ff4fd8'},
  {text: 'KHARCHA • KAMAAI • ASLI PAISA', at: at(3) + 1.5, until: at(4) + 1, color: '#ffd23f'},
  {text: 'Distributor 8–10%  |  Chemist 16–20%', at: at(8) + 0.5, until: at(9) - 0.2, color: '#2ee59d'},
  {text: 'GST: zyaadatar 5%', at: at(10) + 1.2, until: at(11) - 0.4, color: '#ffb84d'},
  {text: 'TOTAL ₹8–15 LAKH', at: at(19) + 0.8, until: at(21) - 0.5, color: '#ffd23f'},
  {text: 'DRUG LICENSE', at: at(22) + 0.8, until: at(24) - 0.3, color: '#ff5d5d'},
  {text: 'D.Pharm / B.Pharm', at: at(24) + 3.5, until: at(26) - 0.3, color: '#4dabf7'},
  {text: 'GROSS PROFIT ≈ ₹1.2 LAKH', at: at(32) + 1, until: at(34), color: '#2ee59d'},
  {text: 'HIDDEN KHARCHA: DISCOUNT', at: at(40) + 1.5, until: at(43) - 0.3, color: '#ff5d5d'},
  {text: 'NET PROFIT ₹40–60K / MAHINA', at: at(43) + 1.5, until: at(44) - 0.4, color: '#2ee59d'},
  {text: 'SECRET #1: GENERIC', at: at(44) + 0.5, until: at(45) + 2, color: '#3dffb0'},
  {text: '50%+ MARGIN', at: at(45) + 5, until: at(46) + 1, color: '#ff4fd8'},
  {text: 'JAN AUSHADHI', at: at(47) + 0.8, until: at(49) - 0.4, color: '#2ee59d'},
  {text: 'SECRET #2: DOOSRA COUNTER', at: at(49) + 0.3, until: at(50) - 0.3, color: '#ffd23f'},
  {text: '20–40% MARGIN', at: at(50) + 0.6, until: at(51) - 0.3, color: '#ff4fd8'},
  {text: 'LOCATION • IMAANDARI • BHAROSA', at: at(56) + 0.5, until: at(57) - 0.4, color: '#2ee59d'},
  {text: 'SIRF JAANKARI KE LIYE', at: at(59) + 0.5, until: at(63) - 0.3, color: '#ffd23f'},
  {text: 'SUBSCRIBE', at: at(63) + 0.5, until: DURATION - 0.3, color: '#ff5d5d'},
];
