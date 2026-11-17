// Timeline locked to the ElevenLabs voiceover (public/vo.mp3, 69.96 s).
// The 21 speech segments between pauses (ffmpeg silencedetect) map 1:1 to the
// 21 clauses of the script; words are spread inside each segment by spoken length.

export const FPS = 30;
export const DURATION = 70.6;
export const FRAMES = Math.round(DURATION * FPS);

export type Clause = {t0: number; t1: number; text: string};

export const CLAUSES: Clause[] = [
  {t0: 0.05, t1: 1.79, text: 'Aap ₹100 ki dawai lete ho…'},
  {t0: 2.21, t1: 2.5, text: 'Pata hai,'},
  {t0: 2.89, t1: 4.57, text: 'chemist uncle usme se kitna kamate hain?'},
  {t0: 5.08, t1: 6.73, text: 'Dawai aap tak seedha nahi aati.'},
  {t0: 7.13, t1: 12.54, text: 'Pehle company banati hai, phir stockist aur distributor ke paas jaati hai, aur phir aapke chemist ke paas.'},
  {t0: 12.94, t1: 17.36, text: 'Ab ₹100 ki MRP mein se, 5 se 12 percent GST government ko jaata hai,'},
  {t0: 17.75, t1: 21.38, text: 'lagbhag 10 percent distributor ka hota hai, 20 percent chemist ka…'},
  {t0: 21.77, t1: 22.98, text: 'aur baaki company ka.'},
  {t0: 23.37, t1: 24.89, text: 'Aur yahin khel khatam nahi hota!'},
  {t0: 25.28, t1: 27.81, text: "Companies '10 pe 1 free' jaisi schemes deti hain."},
  {t0: 28.21, t1: 31.13, text: 'Woh free wali dawai bhi chemist poori MRP pe bechta hai.'},
  {t0: 31.53, t1: 33.24, text: 'Matlab, margin aur badh gaya!'},
  {
    t0: 33.62,
    t1: 41.2,
    text: 'Lekin har dawai pe itna margin nahi milta. Zaroori dawaiyon ki keemat sarkaar control karti hai, unpe chemist ka margin fixed aur kam hota hai.',
  },
  {t0: 41.6, t1: 43.39, text: 'Aur yeh saara margin profit nahi hai.'},
  {t0: 43.76, t1: 50.58, text: 'Dukaan ka kiraya, staff ki salary, fridge ki bijli, aur expired dawaiyon ka loss… sab isi se nikalta hai.'},
  {t0: 50.95, t1: 52.68, text: 'Toh asli paisa kahan se aata hai?'},
  {t0: 53.1, t1: 55.93, text: 'Ek aisi dawai hai jisme margin 20% nahi…'},
  {t0: 56.29, t1: 58.39, text: '50% se bhi zyada ho sakta hai!'},
  {t0: 58.76, t1: 61.89, text: 'Aur ek counter aisa hai, jo dawai se bhi zyada kamaata hai…'},
  {t0: 62.28, t1: 68.32, text: 'Woh dono secrets, aur medical shop kholne ka poora kharcha aur license process, maine full video mein bataya hai.'},
  {t0: 68.7, t1: 69.96, text: 'Neeche link pe tap karo!'},
];

// how long each token takes to *say* (numbers/abbreviations are spoken long)
const SPOKEN: Record<string, number> = {'₹100': 10, '12': 6, '10': 3, '5': 5, '20': 4, '20%': 12, '50%': 14, MRP: 9, GST: 9, '1': 2};
export type Word = {text: string; start: number; end: number};
export const WORDS: Word[] = CLAUSES.flatMap((c) => {
  const toks = c.text.split(/\s+/).filter(Boolean);
  const weight = (t: string) => {
    const bare = t.replace(/[^\p{L}\p{N}₹%]/gu, '');
    return (SPOKEN[bare] ?? bare.length) + 1.5 + (/[,…!?.]$/.test(t) ? 1.5 : 0);
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

export type SceneId = 'hook' | 'journey' | 'split' | 'scheme' | 'govt' | 'expenses' | 'cliff' | 'cta';
export const SCENES: {id: SceneId; start: number; end: number}[] = [
  {id: 'hook', start: 0, end: 5.0},
  {id: 'journey', start: 5.0, end: 12.85},
  {id: 'split', start: 12.85, end: 23.25},
  {id: 'scheme', start: 23.25, end: 33.5},
  {id: 'govt', start: 33.5, end: 41.45},
  {id: 'expenses', start: 41.45, end: 50.85},
  {id: 'cliff', start: 50.85, end: 62.15},
  {id: 'cta', start: 62.15, end: DURATION},
];

// pop-up callouts (top band of the frame only)
export const CALLOUTS = [
  {text: '₹100 = ₹ ??', at: 3.0, until: 4.9, color: '#ffd23f'},
  {text: '10 + 1 FREE', at: 27.0, until: 31.2, color: '#ffd23f'},
  {text: 'PRICE CONTROL', at: 37.5, until: 41.3, color: '#ff5d5d'},
  {text: '50%+ MARGIN?!', at: 56.3, until: 58.6, color: '#ff4fd8'},
  {text: 'FULL VIDEO', at: 63.0, until: 70.5, color: '#ffd23f'},
];

// sound effects (Epidemic Sound files in public/sfx)
export const SFX: {file: string; at: number; vol: number}[] = [
  {file: 'whoosh', at: 4.85, vol: 0.5},
  {file: 'pop', at: 3.0, vol: 0.7},
  {file: 'vehicle', at: 6.9, vol: 0.35},
  {file: 'pop', at: 7.4, vol: 0.6},
  {file: 'pop', at: 9.6, vol: 0.6},
  {file: 'pop', at: 11.7, vol: 0.6},
  {file: 'whoosh', at: 12.7, vol: 0.5},
  {file: 'whoosh', at: 13.9, vol: 0.45},
  {file: 'pop', at: 15.3, vol: 0.6},
  {file: 'pop', at: 17.9, vol: 0.6},
  {file: 'kaching', at: 19.9, vol: 0.6},
  {file: 'pop', at: 21.8, vol: 0.6},
  {file: 'whoosh', at: 23.1, vol: 0.5},
  {file: 'chime', at: 26.9, vol: 0.55},
  {file: 'coins', at: 29.6, vol: 0.6},
  {file: 'kaching', at: 31.6, vol: 0.6},
  {file: 'whoosh', at: 33.35, vol: 0.5},
  {file: 'lock', at: 37.45, vol: 0.8},
  {file: 'whoosh', at: 41.3, vol: 0.5},
  {file: 'paper', at: 44.3, vol: 0.7},
  {file: 'paper', at: 45.6, vol: 0.7},
  {file: 'paper', at: 47.0, vol: 0.7},
  {file: 'paper', at: 48.4, vol: 0.7},
  {file: 'whoosh', at: 50.7, vol: 0.5},
  {file: 'suspense', at: 56.2, vol: 0.6},
  {file: 'chime', at: 58.9, vol: 0.55},
  {file: 'whoosh', at: 62.0, vol: 0.5},
  {file: 'chime', at: 68.7, vol: 0.5},
];
