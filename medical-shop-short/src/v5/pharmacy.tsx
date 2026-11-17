// Detailed medical-shop interior: pharmacy cabinets, printed medicine packaging, glass counter, fridge, signage.
// Same footprint as v2 ShopRoom (open front at z = 0): width 5.2, depth 3.6, height 2.66.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {Cel, Glow, Line, Lit, plasterTex} from '../v2/kit';
import {canvasTexture, rand, roundRect, FONT} from '../three/util';

export const PW = 5.2;
export const PH = 2.66;
export const PD = 3.6;
type V3 = [number, number, number];

// ---------------- printed packaging textures (cached) ----------------
const BRANDS = ['PARACIP', 'CALPOL', 'DOLO', 'ZINCOVIT', 'BECOSULE', 'AZEE', 'PAN-D', 'CROCIN', 'LIMCEE', 'ORS', 'SINAREST', 'VICKS'];
// (generic-sounding names drawn small on cartoon packs; purely decorative)
const PACK_COLS = ['#e63946', '#1d6fd8', '#2a9d8f', '#f4a261', '#7b2cbf', '#e76f51', '#0f9d58', '#ff006e', '#3a86ff', '#ffb703'];
let packCache: THREE.CanvasTexture[] | null = null;
const packTextures = () => {
  if (packCache) return packCache;
  packCache = PACK_COLS.map((col, i) =>
    canvasTexture(256, 160, (g, w, h) => {
      g.fillStyle = '#fbfaf7';
      g.fillRect(0, 0, w, h);
      // colour band design varies
      g.fillStyle = col;
      if (i % 3 === 0) g.fillRect(0, 0, w, h * 0.38);
      else if (i % 3 === 1) {
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(w, 0);
        g.lineTo(w, h * 0.25);
        g.quadraticCurveTo(w * 0.5, h * 0.55, 0, h * 0.3);
        g.fill();
      } else {
        g.fillRect(0, 0, w * 0.22, h);
      }
      // second accent stripe
      g.fillStyle = PACK_COLS[(i + 4) % PACK_COLS.length];
      g.fillRect(i % 3 === 2 ? w * 0.22 : 0, h * 0.86, w, h * 0.14);
      // brand + strength
      g.fillStyle = i % 3 === 2 ? '#1d1238' : '#ffffff';
      g.font = `800 ${i % 3 === 2 ? 34 : 38}px ${FONT}`;
      g.textBaseline = 'middle';
      g.textAlign = i % 3 === 2 ? 'left' : 'center';
      g.fillText(BRANDS[i % BRANDS.length], i % 3 === 2 ? w * 0.27 : w / 2, i % 3 === 2 ? h * 0.3 : h * 0.18);
      g.fillStyle = '#1d1238';
      g.font = `700 22px ${FONT}`;
      g.fillText(['500 mg', '650 mg', '10 Tab', '15 Cap', '100 ml', '250 mg'][i % 6], i % 3 === 2 ? w * 0.27 : w / 2, h * 0.58);
      // fake small print lines
      g.fillStyle = 'rgba(29,18,56,0.35)';
      for (let k = 0; k < 2; k++) g.fillRect(i % 3 === 2 ? w * 0.27 : w * 0.2, h * (0.68 + k * 0.07), w * 0.55, 4);
      // little cross logo
      g.fillStyle = col;
      const cx = w * 0.88;
      const cy = h * 0.6;
      g.fillRect(cx - 12, cy - 4, 24, 8);
      g.fillRect(cx - 4, cy - 12, 8, 24);
      g.strokeStyle = '#1d1238';
      g.lineWidth = 6;
      g.strokeRect(0, 0, w, h);
    }),
  );
  return packCache;
};

let labelCache: THREE.CanvasTexture[] | null = null;
const bottleLabels = () => {
  if (labelCache) return labelCache;
  labelCache = ['#e63946', '#1d6fd8', '#0f9d58', '#7b2cbf'].map((col, i) =>
    canvasTexture(256, 128, (g, w, h) => {
      g.fillStyle = '#fffdf6';
      g.fillRect(0, 0, w, h);
      g.fillStyle = col;
      g.fillRect(0, 0, w, h * 0.3);
      g.fillStyle = '#1d1238';
      g.font = `800 30px ${FONT}`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(['SYRUP', 'TONIC', 'COUGH', 'ANTACID'][i], w / 2, h * 0.6);
      g.fillStyle = '#ffffff';
      g.font = `700 20px ${FONT}`;
      g.fillText('100 ml', w / 2, h * 0.15);
    }),
  );
  return labelCache;
};

// ---------------- products ----------------
const Pack: React.FC<{position: V3; size: V3; i: number; rotY?: number}> = ({position, size, i, rotY = 0}) => {
  const tex = packTextures()[i % PACK_COLS.length];
  const side = PACK_COLS[i % PACK_COLS.length];
  const mats = useMemo(
    () => [
      new THREE.MeshToonMaterial({color: '#f1efe9'}),
      new THREE.MeshToonMaterial({color: '#f1efe9'}),
      new THREE.MeshToonMaterial({color: side}),
      new THREE.MeshToonMaterial({color: '#e7e4dc'}),
      new THREE.MeshBasicMaterial({map: tex, toneMapped: false}),
      new THREE.MeshToonMaterial({color: '#e7e4dc'}),
    ],
    [tex, side],
  );
  return (
    <mesh position={position} rotation={[0, rotY, 0]} material={mats} castShadow>
      <boxGeometry args={size} />
    </mesh>
  );
};

const Bottle: React.FC<{position: V3; i: number; s?: number}> = ({position, i, s = 1}) => {
  const lab = bottleLabels()[i % 4];
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.058, 0.22, 16]} />
        <meshToonMaterial color="#9c4a12" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.0585, 0.0585, 0.1, 16, 1, true, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial map={lab} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.235, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.03, 12]} />
        <meshToonMaterial color="#9c4a12" />
      </mesh>
      <mesh position={[0, 0.265, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.04, 12]} />
        <meshToonMaterial color={['#ffffff', '#e63946', '#1d6fd8', '#0f9d58'][i % 4]} />
      </mesh>
    </group>
  );
};

const Jar: React.FC<{position: V3; i: number}> = ({position, i}) => (
  <group position={position}>
    <mesh position={[0, 0.08, 0]} castShadow>
      <cylinderGeometry args={[0.055, 0.055, 0.16, 16]} />
      <meshToonMaterial color="#f8f8f8" />
    </mesh>
    <mesh position={[0, 0.08, 0.002]}>
      <cylinderGeometry args={[0.0565, 0.0565, 0.07, 16, 1, true, -Math.PI / 2, Math.PI]} />
      <meshToonMaterial color={PACK_COLS[(i * 3) % PACK_COLS.length]} />
    </mesh>
    <mesh position={[0, 0.175, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.035, 16]} />
      <meshToonMaterial color={PACK_COLS[(i * 7 + 2) % PACK_COLS.length]} />
    </mesh>
  </group>
);

const Tube: React.FC<{position: V3; i: number}> = ({position, i}) => (
  <group position={position} rotation={[0, 0, Math.PI / 2]}>
    <mesh scale={[1, 1, 0.55]}>
      <cylinderGeometry args={[0.035, 0.045, 0.24, 12]} />
      <meshToonMaterial color={['#ffffff', '#cfe8ff', '#ffe3e3'][i % 3]} />
    </mesh>
    <mesh position={[0, 0.13, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.03, 10]} />
      <meshToonMaterial color={PACK_COLS[i % PACK_COLS.length]} />
    </mesh>
  </group>
);

// ---------------- pharmacy cabinet ----------------
const WOOD = '#9a5b34';
const WOOD_D = '#7a4426';

export const Cabinet: React.FC<{position?: V3; rotation?: V3; width?: number; seed?: number; rows?: number}> = ({
  position,
  rotation,
  width = 2.3,
  seed = 1,
  rows = 4,
}) => {
  const depth = 0.42;
  const base = 0.62; // closed drawer section
  const top = 2.3;
  const rowH = (top - base) / rows;
  const items = useMemo(() => {
    const out: {kind: string; x: number; y: number; w: number; h: number; d: number; i: number}[] = [];
    for (let r = 0; r < rows; r++) {
      let x = -width / 2 + 0.07;
      let k = 0;
      const kindRow = Math.floor(rand(seed * 17 + r) * 4); // 0 packs, 1 bottles, 2 jars+tubes, 3 mixed
      while (x < width / 2 - 0.12) {
        const s = seed * 1000 + r * 60 + k;
        const kind = kindRow === 1 ? 'bottle' : kindRow === 2 ? (rand(s) > 0.5 ? 'jar' : 'tube') : kindRow === 3 && rand(s) > 0.6 ? 'bottle' : 'pack';
        const w = kind === 'pack' ? 0.13 + rand(s + 1) * 0.1 : kind === 'tube' ? 0.27 : 0.12;
        const h = kind === 'pack' ? 0.13 + rand(s + 2) * 0.14 : 0.25;
        out.push({kind, x: x + w / 2, y: base + r * rowH + 0.035, w, h, d: 0.08 + rand(s + 3) * 0.06, i: Math.floor(rand(s + 4) * 20)});
        x += w + 0.015;
        k++;
      }
    }
    return out;
  }, [width, seed, rows, rowH]);
  return (
    <group position={position} rotation={rotation}>
      {/* back panel (light) */}
      <mesh position={[0, (top + base) / 2, -depth / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[width, top - base, 0.02]} />
        <Cel color="#e9f4f0" />
      </mesh>
      {/* sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * width) / 2, top / 2 + 0.02, 0]} castShadow>
          <boxGeometry args={[0.06, top + 0.04, depth]} />
          <Cel color={WOOD} />
          <Line />
        </mesh>
      ))}
      {/* crown moulding */}
      <mesh position={[0, top + 0.07, 0.02]} castShadow>
        <boxGeometry args={[width + 0.14, 0.1, depth + 0.06]} />
        <Cel color={WOOD_D} />
        <Line />
      </mesh>
      <mesh position={[0, top + 0.15, 0.03]}>
        <boxGeometry args={[width + 0.2, 0.05, depth + 0.08]} />
        <Cel color={WOOD} />
        <Line />
      </mesh>
      {/* drawer section */}
      <mesh position={[0, base / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, base, depth]} />
        <Cel color={WOOD} />
        <Line />
      </mesh>
      {Array.from({length: Math.max(2, Math.round(width / 0.55))}).map((_, i, arr) => {
        const dw = width / arr.length;
        const x = -width / 2 + dw * (i + 0.5);
        return (
          <group key={i}>
            {[0.17, 0.44].map((y) => (
              <group key={y}>
                <mesh position={[x, y, depth / 2 + 0.006]}>
                  <planeGeometry args={[dw - 0.05, 0.22]} />
                  <Cel color={WOOD_D} />
                </mesh>
                <mesh position={[x, y, depth / 2 + 0.02]}>
                  <boxGeometry args={[0.1, 0.022, 0.02]} />
                  <meshToonMaterial color="#d8c08a" />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}
      {/* shelves: board + price strip + warm LED under */}
      {Array.from({length: rows + 1}).map((_, r) => {
        const y = base + r * rowH;
        return (
          <group key={r}>
            <mesh position={[0, y, 0]} receiveShadow castShadow>
              <boxGeometry args={[width, 0.035, depth]} />
              <Cel color={WOOD} />
              <Line />
            </mesh>
            {r > 0 && r < rows + 1 && (
              <mesh position={[0, y - 0.005, depth / 2 + 0.003]}>
                <planeGeometry args={[width - 0.02, 0.03]} />
                <meshBasicMaterial color="#fff3c4" toneMapped={false} />
              </mesh>
            )}
            {r > 0 && (
              <>
                <mesh position={[0, y - 0.03, depth / 2 - 0.05]}>
                  <boxGeometry args={[width - 0.1, 0.012, 0.02]} />
                  <Lit color="#fff6dc" />
                </mesh>
                <Glow position={[0, y - 0.1, depth / 2 - 0.05]} color="#ffe9c0" size={width * 0.55} opacity={0.12} />
              </>
            )}
          </group>
        );
      })}
      {/* products */}
      {items.map((it, k) =>
        it.kind === 'pack' ? (
          <Pack key={k} position={[it.x, it.y + it.h / 2, 0.02]} size={[it.w, it.h, it.d]} i={it.i} />
        ) : it.kind === 'bottle' ? (
          <Bottle key={k} position={[it.x, it.y, 0.03]} i={it.i} s={0.95} />
        ) : it.kind === 'jar' ? (
          <Jar key={k} position={[it.x, it.y, 0.03]} i={it.i} />
        ) : (
          <Tube key={k} position={[it.x, it.y + 0.05, 0.05]} i={it.i} />
        ),
      )}
    </group>
  );
};

// ---------------- room details ----------------
const tileTex = () =>
  canvasTexture(
    128,
    128,
    (g, w, h) => {
      g.fillStyle = '#f3f6f4';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#b9c9c4';
      g.lineWidth = 4;
      g.strokeRect(0, 0, w, h);
    },
    [14, 4],
  );

const floorTex = () =>
  canvasTexture(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = '#efe6d6';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#d9cbb3';
      g.fillRect(0, 0, w / 2, h / 2);
      g.fillRect(w / 2, h / 2, w / 2, h / 2);
      g.strokeStyle = '#8a7a66';
      g.lineWidth = 3;
      g.strokeRect(0, 0, w, h);
      g.beginPath();
      g.moveTo(w / 2, 0);
      g.lineTo(w / 2, h);
      g.moveTo(0, h / 2);
      g.lineTo(w, h / 2);
      g.stroke();
    },
    [5, 3.5],
  );

const posterTex = (kind: number) =>
  canvasTexture(256, 360, (g, w, h) => {
    g.fillStyle = kind ? '#e8f7ff' : '#fff4e6';
    roundRect(g, 0, 0, w, h, 14);
    g.fill();
    g.strokeStyle = '#1d1238';
    g.lineWidth = 8;
    roundRect(g, 4, 4, w - 8, h - 8, 12);
    g.stroke();
    g.fillStyle = kind ? '#1d6fd8' : '#e63946';
    if (kind) {
      // drop / hand wash icon
      g.beginPath();
      g.moveTo(w / 2, 60);
      g.quadraticCurveTo(w * 0.8, 170, w / 2, 200);
      g.quadraticCurveTo(w * 0.2, 170, w / 2, 60);
      g.fill();
    } else {
      // heart icon
      g.beginPath();
      g.moveTo(w / 2, 210);
      g.bezierCurveTo(20, 130, 70, 50, w / 2, 100);
      g.bezierCurveTo(w - 70, 50, w - 20, 130, w / 2, 210);
      g.fill();
    }
    g.fillStyle = '#1d1238';
    g.font = `800 34px ${FONT}`;
    g.textAlign = 'center';
    g.fillText(kind ? 'HAATH' : 'SEHAT', w / 2, 260);
    g.fillText(kind ? 'DHOYEIN' : 'HI DHAN', w / 2, 300);
  });

const signTex = () =>
  canvasTexture(512, 128, (g, w, h) => {
    g.fillStyle = '#0d5c45';
    roundRect(g, 0, 0, w, h, 20);
    g.fill();
    g.fillStyle = '#eafff6';
    g.font = `800 64px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.shadowColor = '#7dffcc';
    g.shadowBlur = 18;
    g.fillText('+ PHARMACY', w / 2, h / 2 + 4);
  });

const Counter: React.FC = () => (
  <group position={[0, 0, -1.05]}>
    {/* wooden base with panels */}
    <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.6, 0.84, 0.72]} />
      <Cel color={WOOD} />
      <Line />
    </mesh>
    {Array.from({length: 4}).map((_, i) => (
      <mesh key={i} position={[-1.35 + i * 0.9, 0.42, 0.362]}>
        <planeGeometry args={[0.76, 0.58]} />
        <Cel color={WOOD_D} />
      </mesh>
    ))}
    <mesh position={[0, 0.03, 0.37]}>
      <boxGeometry args={[3.6, 0.06, 0.04]} />
      <Cel color="#3a2a40" />
    </mesh>
    {/* glass display case with products inside */}
    <mesh position={[0, 1.04, 0]}>
      <boxGeometry args={[3.6, 0.4, 0.72]} />
      <meshPhysicalMaterial color="#dff6ff" transparent opacity={0.22} roughness={0.05} />
      <Line t={10} />
    </mesh>
    <mesh position={[0, 1.245, 0]}>
      <boxGeometry args={[3.64, 0.025, 0.76]} />
      <meshPhysicalMaterial color="#eafaff" transparent opacity={0.5} roughness={0.05} />
    </mesh>
    <mesh position={[0, 0.86, 0]}>
      <boxGeometry args={[3.56, 0.02, 0.68]} />
      <Lit color="#fffaf0" />
    </mesh>
    {Array.from({length: 12}).map((_, i) => (
      <Pack key={i} position={[-1.6 + i * 0.29, 0.94, (i % 2) * 0.12 - 0.05]} size={[0.24, 0.13, 0.15]} i={i + 3} rotY={-0.15 + (i % 3) * 0.1} />
    ))}
    {/* on the counter */}
    {/* billing monitor */}
    <group position={[1.15, 1.26, -0.12]} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.16, 0.03, 0.12]} />
        <Cel color="#2b2d42" />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.03, 0.16, 0.03]} />
        <Cel color="#2b2d42" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.48, 0.3, 0.03]} />
        <Cel color="#2b2d42" />
        <Line />
      </mesh>
      <mesh position={[0, 0.3, 0.017]}>
        <planeGeometry args={[0.43, 0.25]} />
        <Lit color="#6fb6ff" />
      </mesh>
      <Glow position={[0, 0.3, 0.08]} color="#7cc0ff" size={0.6} opacity={0.3} />
    </group>
    {/* receipt printer + cash drawer */}
    <mesh position={[0.65, 1.32, 0.05]} castShadow>
      <boxGeometry args={[0.2, 0.13, 0.2]} />
      <Cel color="#3a3d4a" />
      <Line />
    </mesh>
    <mesh position={[0.65, 1.39, 0.09]} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[0.1, 0.12]} />
      <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
    </mesh>
    {/* BP monitor */}
    <group position={[-1.2, 1.26, 0.08]} rotation={[0, 0.3, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.2, 0.12, 0.16]} />
        <Cel color="#f5f5f5" />
        <Line />
      </mesh>
      <mesh position={[0, 0.08, 0.081]}>
        <planeGeometry args={[0.12, 0.06]} />
        <Lit color="#bff5d6" />
      </mesh>
    </group>
    {/* sanitizer pump bottle */}
    <group position={[-0.75, 1.26, 0.15]}>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.18, 14]} />
        <meshPhysicalMaterial color="#9fe3ff" transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
        <Cel color="#ffffff" />
      </mesh>
      <mesh position={[0.03, 0.23, 0]}>
        <boxGeometry args={[0.07, 0.015, 0.02]} />
        <Cel color="#ffffff" />
      </mesh>
    </group>
    {/* calculator + prescription pad */}
    <mesh position={[0.15, 1.265, 0.12]} rotation={[-Math.PI / 2, 0, 0.2]}>
      <planeGeometry args={[0.13, 0.19]} />
      <meshToonMaterial color="#2b2d42" />
    </mesh>
    <mesh position={[-0.25, 1.264, 0.1]} rotation={[-Math.PI / 2, 0, -0.25]}>
      <planeGeometry args={[0.2, 0.26]} />
      <meshBasicMaterial color="#fffdf2" />
    </mesh>
  </group>
);

const Fridge: React.FC<{position: V3; rotY?: number}> = ({position, rotY = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.85, 0]} castShadow>
      <boxGeometry args={[0.7, 1.7, 0.6]} />
      <Cel color="#f1f3f5" />
      <Line />
    </mesh>
    <mesh position={[0, 0.9, 0.301]}>
      <planeGeometry args={[0.56, 1.3]} />
      <Lit color="#cdeeff" />
    </mesh>
    {[0.45, 0.8, 1.15, 1.45].map((y, r) => (
      <group key={y}>
        <mesh position={[0, y, 0.25]}>
          <boxGeometry args={[0.54, 0.01, 0.08]} />
          <meshBasicMaterial color="#9fb7c9" />
        </mesh>
        {Array.from({length: 6}).map((_, k) => (
          <mesh key={k} position={[-0.22 + k * 0.088, y + 0.06, 0.27]}>
            <cylinderGeometry args={[0.018, 0.018, 0.1, 8]} />
            <meshBasicMaterial color={['#ffffff', '#ffd6e0', '#d6f0ff'][(k + r) % 3]} />
          </mesh>
        ))}
      </group>
    ))}
    <mesh position={[0.24, 0.9, 0.31]}>
      <boxGeometry args={[0.025, 0.4, 0.03]} />
      <Cel color="#b0b7c3" />
    </mesh>
    <Glow position={[0, 0.9, 0.5]} color="#a8dcff" size={1.4} opacity={0.3} />
  </group>
);

const Clock: React.FC<{position: V3}> = ({position}) => {
  const f = useCurrentFrame();
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial color="#fffdf7" />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial color="#1d1238" />
      </mesh>
      <mesh position={[0, 0, 0.005]} rotation={[0, 0, -0.6]}>
        <planeGeometry args={[0.012, 0.18]} />
        <meshBasicMaterial color="#1d1238" />
      </mesh>
      <mesh position={[0, 0, 0.006]} rotation={[0, 0, -f * 0.02]}>
        <planeGeometry args={[0.008, 0.26]} />
        <meshBasicMaterial color="#e63946" />
      </mesh>
    </group>
  );
};

const Fan: React.FC<{position: V3}> = ({position}) => {
  const f = useCurrentFrame();
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 6]} />
        <Cel color="#e8e2d6" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.1, 0.12, 0.08, 16]} />
        <Cel color="#f2ede4" />
        <Line />
      </mesh>
      <group rotation={[0, f * 0.35, 0]}>
        {[0, 1, 2].map((k) => (
          <mesh key={k} rotation={[0, (k * Math.PI * 2) / 3, 0]} position={[0, -0.02, 0]}>
            <boxGeometry args={[0.9, 0.012, 0.13]} />
            <Cel color="#efe8da" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ---------------- the room ----------------
export const PharmacyInterior: React.FC<{dim?: boolean}> = ({dim}) => {
  const wall = useMemo(() => plasterTex(dim ? '#5b4a96' : '#cfeee3', 2, 1), [dim]);
  const tiles = useMemo(tileTex, []);
  const floor = useMemo(floorTex, []);
  const sign = useMemo(signTex, []);
  const posters = useMemo(() => [posterTex(0), posterTex(1)], []);
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -PD / 2]} receiveShadow>
        <planeGeometry args={[PW, PD]} />
        <Cel color={dim ? '#9d8fd0' : '#ffffff'} map={floor} />
      </mesh>
      {/* walls: plaster above, tiles below */}
      <mesh position={[0, PH / 2, -PD]} receiveShadow>
        <planeGeometry args={[PW, PH]} />
        <Cel color="#ffffff" map={wall} />
      </mesh>
      <mesh position={[0, 0.5, -PD + 0.005]}>
        <planeGeometry args={[PW, 1]} />
        <Cel color={dim ? '#8f86b8' : '#ffffff'} map={tiles} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[(s * PW) / 2, PH / 2, -PD / 2]} rotation={[0, (-s * Math.PI) / 2, 0]} receiveShadow>
            <planeGeometry args={[PD, PH]} />
            <Cel color="#ffffff" map={wall} />
          </mesh>
          <mesh position={[(s * PW) / 2 - s * 0.005, 0.5, -PD / 2]} rotation={[0, (-s * Math.PI) / 2, 0]}>
            <planeGeometry args={[PD, 1]} />
            <Cel color={dim ? '#8f86b8' : '#ffffff'} map={tiles} />
          </mesh>
        </group>
      ))}
      {/* ceiling with a cornice */}
      <mesh position={[0, PH, -PD / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PW, PD]} />
        <Cel color={dim ? '#2a2350' : '#f2ece2'} />
      </mesh>
      <mesh position={[0, PH - 0.05, -PD + 0.05]}>
        <boxGeometry args={[PW, 0.1, 0.1]} />
        <Cel color="#e3d9c8" />
        <Line />
      </mesh>

      {/* back wall: two cabinets + illuminated sign + clock */}
      <Cabinet position={[-1.25, 0, -PD + 0.25]} width={2.3} seed={2} />
      <Cabinet position={[1.25, 0, -PD + 0.25]} width={2.3} seed={5} />
      <group position={[0, 2.56, -PD + 0.3]}>
        <mesh>
          <planeGeometry args={[1.5, 0.36]} />
          <meshBasicMaterial map={sign} toneMapped={false} transparent />
        </mesh>
        <Glow position={[0, 0, 0.1]} color="#59ffbf" size={2} opacity={0.2} />
      </group>
      {/* side walls: cabinet on the left, fridge + posters on the right */}
      <Cabinet position={[-PW / 2 + 0.25, 0, -1.95]} rotation={[0, Math.PI / 2, 0]} width={2.0} seed={9} />
      <Fridge position={[PW / 2 - 0.35, 0, -2.6]} rotY={-Math.PI / 2} />
      {posters.map((t, i) => (
        <mesh key={i} position={[PW / 2 - 0.01, 1.55, -1.45 + i * 0.55]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.42, 0.6]} />
          <meshBasicMaterial map={t} toneMapped={false} />
        </mesh>
      ))}
      <Clock position={[PW / 2 - 0.01, 2.25, -1.2]} />

      <Counter />

      {/* lights */}
      {[-1.5, 1.5].map((x) => (
        <group key={x} position={[x, PH - 0.06, -1.7]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 1.1, 8]} />
            <Lit color={dim ? '#5a6478' : '#f4fbff'} />
          </mesh>
          {!dim && <Glow color="#eef8ff" size={1.3} opacity={0.3} />}
        </group>
      ))}
      <Fan position={[0, PH - 0.22, -0.9]} />
      {!dim && <pointLight position={[0, PH - 0.5, -1.5]} intensity={3} distance={6} color="#fff3dc" />}
    </group>
  );
};

export const _r = roundRect;
