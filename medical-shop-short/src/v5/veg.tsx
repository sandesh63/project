// Storybook grass + vegetation, following the recipe in mromidev/claude-animated-shorts (paint.ts grassHD,
// build.ts addVeg; MIT): broad soft lawn patches with V-tufts and sparse flowers; canopies of clustered smooth
// lobes with a light crown, darker belly and leaf-clump dabs; tapered trunks; rounded hedges; ink silhouettes.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Cel, Hull} from '../v2/kit';
import {canvasTexture, rand} from '../three/util';

type V3 = [number, number, number];

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** grassHD: 1024 px tile, base #73b23d, 16 soft patches, 1400 V-tufts, 12 flowers (wrapped so it tiles). */
export const grassTexture = (repeat: number) =>
  canvasTexture(
    1024,
    1024,
    (g, S) => {
      const r = seeded(7);
      const U = (a: number, b: number) => a + (b - a) * r();
      const wrap = (x: number, y: number, pad: number, fn: (x: number, y: number) => void) => {
        for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) if (x + ox > -pad && x + ox < S + pad && y + oy > -pad && y + oy < S + pad) fn(x + ox, y + oy);
      };
      g.fillStyle = '#73b23d';
      g.fillRect(0, 0, S, S);
      for (let i = 0; i < 16; i++) {
        const x = U(0, S);
        const y = U(0, S);
        const rad = U(120, 320);
        const col = r() > 0.5 ? '140,198,80' : '92,154,48';
        wrap(x, y, rad * 1.4, (xx, yy) => {
          const gr = g.createRadialGradient(xx, yy, 0, xx, yy, rad * 1.4);
          gr.addColorStop(0, `rgba(${col},0.35)`);
          gr.addColorStop(1, `rgba(${col},0)`);
          g.fillStyle = gr;
          g.beginPath();
          g.arc(xx, yy, rad * 1.4, 0, Math.PI * 2);
          g.fill();
        });
      }
      g.lineWidth = 2;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      for (let i = 0; i < 1400; i++) {
        const x = U(0, S);
        const y = U(0, S);
        const h = U(7, 16);
        const lean = U(-3, 3);
        const light = r() < 0.4;
        wrap(x, y, 20, (xx, yy) => {
          g.strokeStyle = light ? 'rgba(165,218,98,0.35)' : 'rgba(78,138,38,0.45)';
          g.beginPath();
          g.moveTo(xx - 3 + lean, yy - h);
          g.lineTo(xx, yy);
          g.lineTo(xx + 3 + lean, yy - h * 0.8);
          g.stroke();
        });
      }
      const flowers = ['#f7f3e8', '#f4d24a', '#f3a9bb', '#f7f3e8'];
      for (let i = 0; i < 12; i++) {
        const x = U(0, S);
        const y = U(0, S);
        const c = flowers[Math.floor(r() * 4)];
        wrap(x, y, 8, (xx, yy) => {
          g.fillStyle = c;
          g.beginPath();
          g.arc(xx, yy, 3.5, 0, Math.PI * 2);
          g.fill();
          g.fillStyle = 'rgba(240,190,60,0.9)';
          g.beginPath();
          g.arc(xx, yy, 1.3, 0, Math.PI * 2);
          g.fill();
        });
      }
    },
    [repeat, repeat],
  );

export const Lawn: React.FC<{radius?: number; repeat?: number; position?: V3}> = ({radius = 18, repeat = 9, position = [0, 0, 0]}) => {
  const tex = useMemo(() => grassTexture(repeat), [repeat]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <circleGeometry args={[radius, 64]} />
      <meshToonMaterial map={tex} color="#ffffff" />
    </mesh>
  );
};

// ---------------- canopy paint ----------------
const LEAF = ['#5aa83c', '#4c9a37', '#69b545', '#55a243', '#3f8f3c'];
const leafCache: THREE.CanvasTexture[] = [];
const leafTex = (i: number) => {
  if (leafCache[i]) return leafCache[i];
  const r = seeded(31 + i * 17);
  const base = new THREE.Color(LEAF[i]);
  const top = base.clone().offsetHSL(0.012, 0.03, 0.1);
  const bot = base.clone().offsetHSL(-0.015, 0.0, -0.1);
  leafCache[i] = canvasTexture(256, 128, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, '#' + top.getHexString());
    gr.addColorStop(0.42, '#' + base.getHexString());
    gr.addColorStop(1, '#' + bot.getHexString());
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 128);
    for (let k = 0; k < 46; k++) {
      const x = r() * 256;
      const y = 10 + r() * 108;
      const rad = 5 + r() * 9;
      const light = y < 64 ? r() < 0.7 : r() < 0.25;
      for (const ox of [-256, 0, 256]) {
        g.strokeStyle = light ? 'rgba(225,255,170,0.3)' : 'rgba(20,70,30,0.25)';
        g.lineWidth = 2.5;
        g.lineCap = 'round';
        g.beginPath();
        g.arc(x + ox, y + rad * 0.6, rad, Math.PI * 1.15, Math.PI * 1.85);
        g.stroke();
      }
    }
  });
  return leafCache[i];
};

const lobeGeo = new THREE.SphereGeometry(1, 24, 16);
const trunkGeo = new THREE.CylinderGeometry(0.6, 1, 1, 10, 1, false).translate(0, 0.5, 0);

const Lobe: React.FC<{p: V3; r: number; sy?: number; leaf: number}> = ({p, r, sy = 0.9, leaf}) => (
  <mesh geometry={lobeGeo} position={p} scale={[r, r * sy, r]} castShadow>
    <meshToonMaterial map={leafTex(leaf)} color="#ffffff" />
    <Hull t={0.025} />
  </mesh>
);

export type VegKind = 'round' | 'fat' | 'tall' | 'cone' | 'bush';

/** One cartoon plant: base at position, height h (world units). */
export const Veg: React.FC<{kind?: VegKind; position: V3; h?: number; seed?: number}> = ({kind = 'round', position, h = 2.4, seed = 1}) => {
  const parts = useMemo(() => {
    const r = seeded(Math.abs(Math.floor(seed * 9973)) % 200000 + 7);
    const U = (a: number, b: number) => a + (b - a) * r();
    const leaf = kind === 'cone' ? 4 : Math.floor(r() * 4);
    const lobes: {p: V3; r: number; sy?: number}[] = [];
    let trunk: {h: number; r: number} | null = null;
    const ring = (n: number, dist: number, r0: number, r1: number, cy: number, dy: number) => {
      const a0 = r() * 6.28;
      for (let i = 0; i < n; i++) {
        const a = a0 + (i * 6.28) / n + U(-0.35, 0.35);
        const dd = dist * U(0.85, 1.12);
        lobes.push({p: [Math.cos(a) * dd, cy + U(-dy, dy), Math.sin(a) * dd], r: U(r0, r1)});
      }
    };
    if (kind === 'round' || kind === 'fat') {
      const f = kind === 'fat';
      trunk = {h: (f ? 0.4 : 0.48) * h, r: 0.055 * h};
      const cy = (f ? 0.58 : 0.64) * h;
      lobes.push({p: [0, cy, 0], r: (f ? 0.29 : 0.26) * h});
      ring(f ? 5 : 4, (f ? 0.22 : 0.18) * h, (f ? 0.19 : 0.17) * h, (f ? 0.23 : 0.21) * h, cy - 0.05 * h, 0.04 * h);
      lobes.push({p: [U(-0.05, 0.05) * h, cy + (f ? 0.15 : 0.17) * h, U(-0.05, 0.05) * h], r: (f ? 0.19 : 0.17) * h});
    } else if (kind === 'tall') {
      trunk = {h: 0.34 * h, r: 0.045 * h};
      lobes.push({p: [0, 0.47 * h, 0], r: 0.17 * h, sy: 1.3});
      lobes.push({p: [U(-0.03, 0.03) * h, 0.65 * h, U(-0.03, 0.03) * h], r: 0.15 * h, sy: 1.3});
      lobes.push({p: [0, 0.82 * h, 0], r: 0.11 * h, sy: 1.25});
      ring(3, 0.1 * h, 0.1 * h, 0.12 * h, 0.55 * h, 0.06 * h);
    } else if (kind === 'cone') {
      trunk = {h: 0.2 * h, r: 0.05 * h};
      lobes.push({p: [0, 0.3 * h, 0], r: 0.26 * h, sy: 0.62});
      lobes.push({p: [0, 0.5 * h, 0], r: 0.2 * h, sy: 0.66});
      lobes.push({p: [0, 0.68 * h, 0], r: 0.14 * h, sy: 0.75});
      lobes.push({p: [0, 0.84 * h, 0], r: 0.08 * h, sy: 1.0});
    } else {
      lobes.push({p: [0, 0.46 * h, 0], r: 0.5 * h});
      ring(3, 0.42 * h, 0.32 * h, 0.38 * h, 0.32 * h, 0.04 * h);
    }
    return {leaf, lobes, trunk, yaw: r() * 6.28};
  }, [kind, h, seed]);
  return (
    <group position={position} rotation={[0, parts.yaw, 0]}>
      {parts.trunk && (
        <mesh geometry={trunkGeo} position={[0, -0.1, 0]} scale={[parts.trunk.r, parts.trunk.h + 0.1, parts.trunk.r]} castShadow>
          <Cel color="#8f5d3b" />
          <Hull t={0.02} />
        </mesh>
      )}
      {parts.lobes.map((l, i) => (
        <Lobe key={i} p={l.p} r={l.r} sy={l.sy} leaf={parts.leaf} />
      ))}
    </group>
  );
};

/** rounded hedge segment along local x (length L, height h, depth d). */
export const Hedge: React.FC<{position: V3; L?: number; h?: number; d?: number; rotY?: number}> = ({position, L = 2.4, h = 0.6, d = 0.55, rotY = 0}) => {
  const geo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.5, 1, 8, 16);
    g.rotateZ(Math.PI / 2);
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[position[0], position[1] + h / 2, position[2]]} rotation={[0, rotY, 0]} scale={[L / 2, h, d]} castShadow>
      <meshToonMaterial map={leafTex(1)} color="#ffffff" />
      <Hull t={0.02} />
    </mesh>
  );
};

export const _r = rand;

// ---------------- sunset palette (from the user's Goa reference frame) ----------------
const TEAL = ['#2f6f73', '#3a7d7a', '#285f66', '#43877f', '#21545c'];
const tealCache: THREE.CanvasTexture[] = [];
export const tealLeafTex = (i: number) => {
  if (tealCache[i]) return tealCache[i];
  const r = seeded(91 + i * 13);
  const base = new THREE.Color(TEAL[i]);
  const top = base.clone().offsetHSL(0.02, 0.05, 0.14);
  const bot = base.clone().offsetHSL(0.03, 0.0, -0.1);
  tealCache[i] = canvasTexture(256, 128, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, '#' + top.getHexString());
    gr.addColorStop(0.45, '#' + base.getHexString());
    gr.addColorStop(1, '#' + bot.getHexString());
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 128);
    for (let k = 0; k < 70; k++) {
      const x = r() * 256;
      const y = 8 + r() * 112;
      const rad = 5 + r() * 10;
      for (const ox of [-256, 0, 256]) {
        g.strokeStyle = 'rgba(16,30,40,0.45)';
        g.lineWidth = 2.2;
        g.lineCap = 'round';
        g.beginPath();
        g.arc(x + ox, y + rad * 0.6, rad, Math.PI * 1.15, Math.PI * 1.85);
        g.stroke();
        if (y < 70 && r() < 0.5) {
          g.strokeStyle = 'rgba(255,214,170,0.35)';
          g.beginPath();
          g.arc(x + ox, y + rad * 0.6 - 2, rad * 0.8, Math.PI * 1.2, Math.PI * 1.6);
          g.stroke();
        }
      }
    }
  });
  return tealCache[i];
};

export const SunsetTree: React.FC<{kind?: VegKind; position: V3; h?: number; seed?: number}> = ({kind = 'round', position, h = 2.4, seed = 1}) => {
  const parts = useMemo(() => {
    const r = seeded(Math.abs(Math.floor(seed * 7919)) % 200000 + 11);
    const U = (a: number, b: number) => a + (b - a) * r();
    const lobes: {p: V3; r: number; sy?: number}[] = [];
    const ring = (n: number, dist: number, r0: number, r1: number, cy: number, dy: number) => {
      const a0 = r() * 6.28;
      for (let i = 0; i < n; i++) {
        const a = a0 + (i * 6.28) / n + U(-0.35, 0.35);
        lobes.push({p: [Math.cos(a) * dist * U(0.85, 1.12), cy + U(-dy, dy), Math.sin(a) * dist * U(0.85, 1.12)], r: U(r0, r1)});
      }
    };
    let trunk: {h: number; r: number} | null = {h: 0.48 * h, r: 0.05 * h};
    if (kind === 'bush') {
      trunk = null;
      lobes.push({p: [0, 0.46 * h, 0], r: 0.5 * h});
      ring(3, 0.42 * h, 0.32 * h, 0.38 * h, 0.32 * h, 0.04 * h);
    } else if (kind === 'cone') {
      trunk = {h: 0.2 * h, r: 0.05 * h};
      [[0.3, 0.26, 0.62], [0.5, 0.2, 0.66], [0.68, 0.14, 0.75], [0.84, 0.08, 1]].forEach(([y, rr, sy]) => lobes.push({p: [0, y * h, 0], r: rr * h, sy}));
    } else {
      const cy = 0.64 * h;
      lobes.push({p: [0, cy, 0], r: 0.26 * h});
      ring(5, 0.19 * h, 0.16 * h, 0.21 * h, cy - 0.05 * h, 0.05 * h);
      lobes.push({p: [0, cy + 0.17 * h, 0], r: 0.17 * h});
    }
    return {lobes, trunk, leaf: Math.floor(r() * 5), yaw: r() * 6.28};
  }, [kind, h, seed]);
  return (
    <group position={position} rotation={[0, parts.yaw, 0]}>
      {parts.trunk && (
        <mesh geometry={trunkGeo} position={[0, -0.1, 0]} scale={[parts.trunk.r, parts.trunk.h + 0.1, parts.trunk.r]} castShadow>
          <Cel color="#6a4a46" />
          <Hull t={0.02} />
        </mesh>
      )}
      {parts.lobes.map((l, i) => (
        <mesh key={i} geometry={lobeGeo} position={l.p} scale={[l.r, l.r * (l.sy ?? 0.9), l.r]} castShadow>
          <meshToonMaterial map={tealLeafTex(parts.leaf)} color="#ffffff" />
          <Hull t={0.025} />
        </mesh>
      ))}
    </group>
  );
};

// ---------------- coconut palm ----------------
let frondTexCache: THREE.CanvasTexture | null = null;
const frondTex = () => {
  if (frondTexCache) return frondTexCache;
  frondTexCache = canvasTexture(512, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.lineCap = 'round';
    // leaflets: dark ink stroke under a teal stroke, angled back from the rib, shorter toward the tip
    for (let i = 0; i < 46; i++) {
      const x = 14 + i * 10.6;
      const len = (h / 2 - 6) * Math.sin(Math.PI * Math.min(1, (x / w) * 1.05)) ** 0.6;
      for (const s of [-1, 1]) {
        const x2 = x + 22;
        const y2 = h / 2 + s * len;
        g.strokeStyle = '#132430';
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(x, h / 2);
        g.lineTo(x2, y2);
        g.stroke();
        g.strokeStyle = ['#3a7d7a', '#2f6f73', '#4a8c80'][i % 3];
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(x, h / 2);
        g.lineTo(x2, y2);
        g.stroke();
      }
    }
    g.strokeStyle = '#132430';
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(4, h / 2);
    g.lineTo(w - 4, h / 2);
    g.stroke();
    g.strokeStyle = '#7a8f6a';
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(4, h / 2);
    g.lineTo(w - 4, h / 2);
    g.stroke();
  });
  return frondTexCache;
};

const frondGeo = (len: number, width: number, rise: number, droop: number) => {
  const n = 18;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = len * t;
    const y = rise * t - droop * t * t;
    const wd = width * Math.max(0.15, Math.sin(Math.PI * Math.min(1, t * 1.05)) ** 0.6);
    // slight V fold: edges dip a little
    pos.push(x, y - wd * 0.15, -wd, x, y - wd * 0.15, wd);
    uv.push(t, 0, t, 1);
    if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

export const Palm: React.FC<{position: V3; h?: number; lean?: number; seed?: number}> = ({position, h = 4, lean = 0.25, seed = 1}) => {
  const data = useMemo(() => {
    const r = seeded(seed * 131 + 5);
    const yaw = r() * 6.28;
    // curved trunk
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      pts.push(new THREE.Vector3(Math.sin(t * 1.2) * lean * h * 0.5, t * h, 0));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const top = pts[pts.length - 1];
    const fronds = Array.from({length: 10}).map((_, i) => ({
      a: (i / 10) * Math.PI * 2 + r() * 0.3,
      len: h * (0.38 + r() * 0.1),
      rise: h * (0.05 + r() * 0.08),
      droop: h * (0.28 + r() * 0.12),
      tilt: r() * 0.3,
    }));
    return {yaw, curve, top, fronds};
  }, [h, lean, seed]);
  const tex = frondTex();
  const trunkGeom = useMemo(() => new THREE.TubeGeometry(data.curve, 24, h * 0.035, 8, false), [data.curve, h]);
  return (
    <group position={position} rotation={[0, data.yaw, 0]}>
      <mesh geometry={trunkGeom} castShadow>
        <Cel color="#7a6a7e" />
        <Hull t={0.018} />
      </mesh>
      {Array.from({length: 12}).map((_, i) => {
        const p = data.curve.getPointAt(0.08 + i * 0.075);
        return (
          <mesh key={i} position={p} rotation={[0, 0, Math.sin(i) * 0.1]}>
            <torusGeometry args={[h * 0.036, h * 0.004, 4, 12]} />
            <meshBasicMaterial color="#2a1f30" />
          </mesh>
        );
      })}
      <group position={data.top.toArray() as V3}>
        {[[0.08, 0], [-0.06, 0.07], [0, -0.08]].map(([x, z], i) => (
          <mesh key={i} position={[x * h * 0.3, -0.05 * h, z * h * 0.3]}>
            <sphereGeometry args={[h * 0.03, 10, 8]} />
            <Cel color="#6b5a3a" />
            <Hull t={0.01} />
          </mesh>
        ))}
        {data.fronds.map((fr, i) => (
          <mesh key={i} geometry={frondGeo(fr.len, h * 0.06, fr.rise, fr.droop)} rotation={[fr.tilt, -fr.a, 0]} castShadow>
            <meshToonMaterial map={tex} transparent alphaTest={0.4} side={THREE.DoubleSide} color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/** sunset lawn: yellow-lime in the light, teal-green patches, sparse tufts */
export const sunsetGrassTexture = (repeat: number) =>
  canvasTexture(
    1024,
    1024,
    (g, S) => {
      const r = seeded(17);
      const U = (a: number, b: number) => a + (b - a) * r();
      const wrap = (x: number, y: number, pad: number, fn: (x: number, y: number) => void) => {
        for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) if (x + ox > -pad && x + ox < S + pad && y + oy > -pad && y + oy < S + pad) fn(x + ox, y + oy);
      };
      g.fillStyle = '#8fbd45';
      g.fillRect(0, 0, S, S);
      for (let i = 0; i < 18; i++) {
        const x = U(0, S);
        const y = U(0, S);
        const rad = U(120, 340);
        const col = r() > 0.45 ? '212,214,96' : '74,140,110';
        wrap(x, y, rad * 1.4, (xx, yy) => {
          const gr = g.createRadialGradient(xx, yy, 0, xx, yy, rad * 1.4);
          gr.addColorStop(0, `rgba(${col},0.4)`);
          gr.addColorStop(1, `rgba(${col},0)`);
          g.fillStyle = gr;
          g.beginPath();
          g.arc(xx, yy, rad * 1.4, 0, Math.PI * 2);
          g.fill();
        });
      }
      g.lineWidth = 2;
      g.lineCap = 'round';
      for (let i = 0; i < 1300; i++) {
        const x = U(0, S);
        const y = U(0, S);
        const hh = U(7, 16);
        const lean = U(-3, 3);
        const light = r() < 0.45;
        wrap(x, y, 20, (xx, yy) => {
          g.strokeStyle = light ? 'rgba(230,226,120,0.4)' : 'rgba(50,110,90,0.45)';
          g.beginPath();
          g.moveTo(xx - 3 + lean, yy - hh);
          g.lineTo(xx, yy);
          g.lineTo(xx + 3 + lean, yy - hh * 0.8);
          g.stroke();
        });
      }
    },
    [repeat, repeat],
  );

export const SunsetLawn: React.FC<{radius?: number; repeat?: number}> = ({radius = 18, repeat = 10}) => {
  const tex = useMemo(() => sunsetGrassTexture(repeat), [repeat]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[radius, 64]} />
      <meshToonMaterial map={tex} color="#ffffff" />
    </mesh>
  );
};
