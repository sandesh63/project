// Scene timing for the Short. Times are in seconds and follow script v2.
// When the real voiceover is recorded, adjust `start`/`end` (or feed Whisper
// word timings into `words`) and everything else follows.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type SceneId =
  | 'hook'
  | 'journey'
  | 'split'
  | 'scheme'
  | 'govt'
  | 'expenses'
  | 'cliff'
  | 'cta';

export type Callout = {
  text: string;
  at: number; // seconds from scene start
  until?: number; // seconds from scene start (defaults to scene end)
  color?: string;
};

export type SceneDef = {
  id: SceneId;
  start: number;
  end: number;
  vo: string;
  callouts?: Callout[];
};

export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    start: 0,
    end: 3.5,
    vo: 'Aap ₹100 ki dawai lete ho… pata hai chemist uncle usme se kitna kamate hain?',
  },
  {
    id: 'journey',
    start: 3.5,
    end: 14,
    vo: 'Dawai aap tak seedha nahi aati. Pehle company banati hai, phir stockist aur distributor ke paas jaati hai, aur phir aapke chemist ke paas.',
  },
  {
    id: 'split',
    start: 14,
    end: 28,
    vo: 'Ab ₹100 ki MRP mein se: 5 se 12 percent GST government ko jaata hai, lagbhag 10 percent distributor ka hota hai, 20 percent chemist ka… aur baaki company ka.',
    callouts: [{text: 'Chemist ≈ 20%', at: 10.5, color: '#2ee59d'}],
  },
  {
    id: 'scheme',
    start: 28,
    end: 40,
    vo: "Aur yahin khel khatam nahi hota! Companies '10 pe 1 free' jaisi schemes deti hain. Woh free wali dawai bhi chemist poori MRP pe bechta hai. Matlab margin aur badh gaya!",
    callouts: [{text: '10 + 1 FREE = Extra Profit', at: 4.2, until: 7.8, color: '#ffd23f'}],
  },
  {
    id: 'govt',
    start: 40,
    end: 50,
    vo: 'Lekin har dawai pe itna margin nahi milta. Zaroori dawaiyon ki keemat sarkaar control karti hai, unpe chemist ka margin fixed aur kam hota hai.',
    callouts: [{text: 'PRICE CONTROL', at: 4.4, color: '#ff5d5d'}],
  },
  {
    id: 'expenses',
    start: 50,
    end: 62,
    vo: 'Aur yeh saara margin profit nahi hai. Dukaan ka kiraya, staff ki salary, fridge ki bijli, aur expired dawaiyon ka loss… sab isi se nikalta hai.',
  },
  {
    id: 'cliff',
    start: 62,
    end: 75,
    vo: 'Toh asli paisa kahan se aata hai? Ek aisi dawai hai jisme margin 20% nahi… 50% se bhi zyada ho sakta hai! Aur ek counter aisa hai jo dawai se bhi zyada kamaata hai…',
    callouts: [{text: '50%+ MARGIN?!', at: 6.2, color: '#ff4fd8'}],
  },
  {
    id: 'cta',
    start: 75,
    end: 85,
    vo: 'Woh dono secrets, aur medical shop kholne ka poora kharcha aur license process, maine full video mein bataya hai. Neeche link pe tap karo!',
    callouts: [{text: 'FULL VIDEO', at: 6.5, color: '#ffd23f'}],
  },
];

export const TOTAL_SECONDS = SCENES[SCENES.length - 1].end;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);
