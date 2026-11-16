// v2 art kit: hard-lit cel shading + ink edges on detailed Indian architecture.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import {canvasTexture, getGlowTexture, rand} from '../three/util';

export type V3 = [number, number, number];
export const INK = '#1a0f2e';

// 2-band ramp: hard light/shadow split like the reference.
let ramp: THREE.DataTexture | null = null;
export const getRamp = () => {
  if (ramp) return ramp;
  const d = new Uint8Array([120, 120, 120, 255, 255, 255, 255, 255]);
  ramp = new THREE.DataTexture(d, 2, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
  ramp.needsUpdate = true;
  return ramp;
};

export const Cel: React.FC<{color: string; map?: THREE.Texture; side?: THREE.Side; emissive?: string; ei?: number}> = ({
  color,
  map,
  side,
  emissive,
  ei = 1,
}) => <meshToonMaterial color={color} gradientMap={getRamp()} map={map} side={side} emissive={emissive} emissiveIntensity={ei} />;

export const Lit: React.FC<{color: string; opacity?: number}> = ({color, opacity = 1}) => (
  <meshBasicMaterial color={color} toneMapped={false} transparent={opacity < 1} opacity={opacity} />
);

/** Ink edge lines on architecture (the "drawn" look on 3D buildings). */
export const Line: React.FC<{t?: number}> = ({t = 20}) => <Edges threshold={t} color={INK} />;

/** Inverted-hull thick outline for characters. */
export const Hull: React.FC<{t?: number}> = ({t = 0.03}) => {
  const ref = React.useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {thick: {value: t}, color: {value: new THREE.Color(INK)}},
        vertexShader: `uniform float thick; void main(){ vec3 p = position + normalize(normal)*thick; gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);} `,
        fragmentShader: `uniform vec3 color; void main(){ gl_FragColor = vec4(color,1.0);} `,
        side: THREE.BackSide,
      }),
    [t],
  );
  React.useLayoutEffect(() => {
    const m = ref.current;
    const p = m?.parent as THREE.Mesh | null;
    if (m && p?.geometry) m.geometry = p.geometry;
  });
  return <mesh ref={ref} material={mat} />;
};

export const Glow: React.FC<{position?: V3; color: string; size?: number; opacity?: number}> = ({position = [0, 0, 0], color, size = 1, opacity = 0.9}) => (
  <sprite position={position} scale={[size, size, size]} renderOrder={10}>
    <spriteMaterial map={getGlowTexture()} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  </sprite>
);

/** Soft volumetric beam (additive cone). */
export const Beam: React.FC<{position: V3; rotation?: V3; color: string; h?: number; r?: number; o?: number}> = ({position, rotation, color, h = 6, r = 1.2, o = 0.12}) => (
  <mesh position={position} rotation={rotation}>
    <coneGeometry args={[r, h, 32, 1, true]} />
    <meshBasicMaterial color={color} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
  </mesh>
);

// ---------- textures ----------
export const stoneTex = (base: string, line: string, rx: number, ry: number, staggered = true) =>
  canvasTexture(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      g.strokeStyle = line;
      g.lineWidth = 3;
      const rows = 4;
      for (let r = 0; r < rows; r++) {
        const y = (r * h) / rows;
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(w, y);
        g.stroke();
        const off = staggered && r % 2 ? w / 4 : 0;
        for (let c = 0; c < 2; c++) {
          const x = off + (c * w) / 2;
          g.beginPath();
          g.moveTo(x % w, y);
          g.lineTo(x % w, y + h / rows);
          g.stroke();
        }
        // subtle tone variation
        for (let c = 0; c < 2; c++) {
          g.fillStyle = `rgba(255,255,255,${rand(r * 7 + c) * 0.06})`;
          g.fillRect(off + (c * w) / 2 + 3, y + 3, w / 2 - 6, h / rows - 6);
        }
      }
    },
    [rx, ry],
  );

export const plasterTex = (base: string, rx = 2, ry = 2) =>
  canvasTexture(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 140; i++) {
        g.fillStyle = `rgba(${rand(i) > 0.5 ? '255,255,255' : '60,20,60'},${0.03 + rand(i + 3) * 0.04})`;
        const r = 4 + rand(i + 9) * 22;
        g.beginPath();
        g.arc(rand(i + 1) * w, rand(i + 2) * h, r, 0, Math.PI * 2);
        g.fill();
      }
    },
    [rx, ry],
  );

// ---------- architecture pieces ----------

/** Arch-topped opening shape (extruded frame). */
const archShape = (w: number, h: number) => {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(-w / 2, h - w / 2);
  // cusped/pointed Indian arch: two arcs meeting at a point
  s.quadraticCurveTo(-w / 2, h - w * 0.05, 0, h);
  s.quadraticCurveTo(w / 2, h - w * 0.05, w / 2, h - w / 2);
  s.lineTo(w / 2, 0);
  s.lineTo(-w / 2, 0);
  return s;
};

export const ArchWindow: React.FC<{
  position?: V3;
  w?: number;
  h?: number;
  frame?: string;
  fill?: string;
  lit?: boolean;
  depth?: number;
}> = ({position, w = 0.8, h = 1.3, frame = '#f4e1c1', fill = '#2a1b4a', lit, depth = 0.08}) => {
  const outer = useMemo(() => {
    const s = archShape(w + 0.18, h + 0.12);
    s.holes.push(new THREE.Path(archShape(w, h).getPoints(24).map((p) => new THREE.Vector2(p.x, p.y + 0.0))));
    return new THREE.ExtrudeGeometry(s, {depth, bevelEnabled: false, curveSegments: 16});
  }, [w, h, depth]);
  const inner = useMemo(() => new THREE.ShapeGeometry(archShape(w, h), 16), [w, h]);
  return (
    <group position={position}>
      <mesh geometry={outer} castShadow>
        <Cel color={frame} />
        <Line t={30} />
      </mesh>
      <mesh geometry={inner} position={[0, 0, 0.01]}>
        {lit ? <Lit color={fill} /> : <Cel color={fill} />}
      </mesh>
      {/* jali mullions */}
      <mesh position={[0, h * 0.42, 0.02]}>
        <boxGeometry args={[0.03, h * 0.84, 0.02]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh position={[0, h * 0.5, 0.02]}>
        <boxGeometry args={[w, 0.03, 0.02]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      {lit && <Glow position={[0, h * 0.45, 0.3]} color={fill} size={w * 2.2} opacity={0.35} />}
    </group>
  );
};

/** Carved pillar with base + capital. */
export const Pillar: React.FC<{position?: V3; h?: number; r?: number; color?: string; accent?: string}> = ({
  position,
  h = 2.6,
  r = 0.14,
  color = '#f2dfc0',
  accent = '#d9a45b',
}) => (
  <group position={position}>
    <mesh position={[0, 0.12, 0]} castShadow>
      <boxGeometry args={[r * 3, 0.24, r * 3]} />
      <Cel color={accent} />
      <Line />
    </mesh>
    <mesh position={[0, h / 2, 0]} castShadow>
      <cylinderGeometry args={[r, r * 1.1, h - 0.5, 12]} />
      <Cel color={color} />
      <Line t={40} />
    </mesh>
    {[0.35, 0.5, h - 0.55].map((y) => (
      <mesh key={y} position={[0, y, 0]}>
        <torusGeometry args={[r * 1.12, r * 0.18, 6, 16]} />
        <Cel color={accent} />
      </mesh>
    ))}
    <mesh position={[0, h - 0.18, 0]} castShadow>
      <cylinderGeometry args={[r * 2, r * 1.1, 0.24, 12]} />
      <Cel color={accent} />
      <Line t={40} />
    </mesh>
    <mesh position={[0, h - 0.03, 0]}>
      <boxGeometry args={[r * 3.4, 0.1, r * 3.4]} />
      <Cel color={color} />
      <Line />
    </mesh>
  </group>
);

/** Small domed pavilion (chhatri). */
export const Chhatri: React.FC<{position?: V3; s?: number; color?: string; dome?: string}> = ({position, s = 1, color = '#f2dfc0', dome = '#f6c873'}) => (
  <group position={position} scale={s}>
    {[
      [-0.35, -0.35],
      [0.35, -0.35],
      [-0.35, 0.35],
      [0.35, 0.35],
    ].map(([x, z]) => (
      <mesh key={`${x}${z}`} position={[x, 0.4, z]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.8, 8]} />
        <Cel color={color} />
        <Line t={40} />
      </mesh>
    ))}
    <mesh position={[0, 0.85, 0]} castShadow>
      <boxGeometry args={[1.05, 0.1, 1.05]} />
      <Cel color={color} />
      <Line />
    </mesh>
    <mesh position={[0, 0.9, 0]} castShadow>
      <sphereGeometry args={[0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <Cel color={dome} />
      <Line t={50} />
    </mesh>
    <mesh position={[0, 1.48, 0]}>
      <coneGeometry args={[0.05, 0.25, 8]} />
      <Cel color="#e0a030" />
    </mesh>
  </group>
);

/** Overhanging balcony window (jharokha) with brackets and mini dome. */
export const Jharokha: React.FC<{position?: V3; color?: string; dome?: string; lit?: string}> = ({position, color = '#f2dfc0', dome = '#e9a65a', lit = '#ffcf7a'}) => (
  <group position={position}>
    <mesh position={[0, 0, 0.3]} castShadow>
      <boxGeometry args={[1.1, 0.12, 0.6]} />
      <Cel color={color} />
      <Line />
    </mesh>
    {[-0.35, 0.35].map((x) => (
      <mesh key={x} position={[x, -0.2, 0.25]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <Cel color={color} />
        <Line />
      </mesh>
    ))}
    <ArchWindow position={[0, 0.06, 0.12]} w={0.6} h={0.75} frame={color} fill={lit} lit />
    {[-0.48, 0.48].map((x) => (
      <mesh key={x} position={[x, 0.45, 0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <Cel color={color} />
      </mesh>
    ))}
    <mesh position={[0, 0.88, 0.35]} castShadow>
      <boxGeometry args={[1.15, 0.08, 0.7]} />
      <Cel color={color} />
      <Line />
    </mesh>
    <mesh position={[0, 0.92, 0.35]} scale={[1.1, 0.7, 0.7]}>
      <sphereGeometry args={[0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <Cel color={dome} />
      <Line t={50} />
    </mesh>
  </group>
);

/** A 2–3 storey haveli facade block with arches, jharokhas, cornices and chhatris. */
export const Haveli: React.FC<{
  position?: V3;
  w?: number;
  floors?: number;
  color?: string;
  trim?: string;
  dome?: string;
  seed?: number;
  groundOpen?: boolean;
  depth?: number;
}> = ({position, w = 5, floors = 3, color = '#e8a87c', trim = '#f6e3c6', dome = '#f2b866', seed = 1, groundOpen = false, depth = 3}) => {
  const fh = 1.9;
  const H = floors * fh;
  const wall = useMemo(() => plasterTex(color, w / 3, H / 3), [color, w, H]);
  const cols = Math.max(2, Math.floor(w / 1.25));
  return (
    <group position={position}>
      {/* body (ground floor optionally left for a shop front) */}
      <mesh position={[0, groundOpen ? (H + fh) / 2 : H / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, groundOpen ? H - fh : H, depth]} />
        <Cel color="#ffffff" map={wall} />
        <Line />
      </mesh>
      {/* floor cornices */}
      {Array.from({length: floors}).map((_, i) => (
        <group key={i}>
          <mesh position={[0, (i + 1) * fh - 0.05, 0.08]} castShadow>
            <boxGeometry args={[w + 0.2, 0.16, 0.3]} />
            <Cel color={trim} />
            <Line />
          </mesh>
          <mesh position={[0, (i + 1) * fh - 0.18, 0.05]}>
            <boxGeometry args={[w + 0.1, 0.08, 0.2]} />
            <Cel color={trim} />
            <Line />
          </mesh>
        </group>
      ))}
      {/* upper floors: alternating arch windows and jharokhas */}
      {Array.from({length: floors - 1}).map((_, fi) =>
        Array.from({length: cols}).map((__, c) => {
          const x = -w / 2 + (w / cols) * (c + 0.5);
          const y = (fi + 1) * fh + 0.3;
          const k = seed * 13 + fi * 5 + c;
          const lit = rand(k) > 0.35;
          const fill = lit ? (rand(k + 1) > 0.3 ? '#ffc96b' : '#ffe2a6') : '#2b1d4d';
          return fi === floors - 2 && c % 2 === 1 ? (
            <Jharokha key={`${fi}${c}`} position={[x, y + 0.15, 0.02]} color={trim} dome={dome} lit={lit ? fill : '#4a3470'} />
          ) : (
            <ArchWindow key={`${fi}${c}`} position={[x, y, 0.01]} w={0.62} h={1.05} frame={trim} fill={fill} lit={lit} />
          );
        }),
      )}
      {/* parapet with merlons + chhatris */}
      <mesh position={[0, H + 0.15, -0.1]} castShadow>
        <boxGeometry args={[w + 0.2, 0.3, 0.4]} />
        <Cel color={trim} />
        <Line />
      </mesh>
      {Array.from({length: Math.floor(w / 0.5)}).map((_, i) => (
        <mesh key={i} position={[-w / 2 + 0.25 + i * 0.5, H + 0.42, -0.1]}>
          <boxGeometry args={[0.22, 0.24, 0.3]} />
          <Cel color={trim} />
          <Line />
        </mesh>
      ))}
      <Chhatri position={[-w / 2 + 0.7, H + 0.3, -0.6]} s={0.9} color={trim} dome={dome} />
      {w > 4 && <Chhatri position={[w / 2 - 0.7, H + 0.3, -0.6]} s={0.9} color={trim} dome={dome} />}
    </group>
  );
};

/** Stone-slab ground. */
export const StoneGround: React.FC<{size?: [number, number]; position?: V3; base?: string; line?: string; rep?: [number, number]}> = ({
  size = [60, 40],
  position = [0, 0, 0],
  base = '#7c6aa8',
  line = '#5a4a86',
  rep = [20, 14],
}) => {
  const tex = useMemo(() => stoneTex(base, line, rep[0], rep[1]), [base, line, rep[0], rep[1]]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <Cel color="#ffffff" map={tex} />
    </mesh>
  );
};

/** Night sky gradient + stars + moon. */
export const NightSky: React.FC<{stops?: [number, string][]; moon?: V3}> = ({
  stops = [
    [0, '#0b0a2e'],
    [0.42, '#1d1a5c'],
    [0.56, '#4b2f86'],
    [0.66, '#a8578f'],
    [0.74, '#f08a6a'],
    [1, '#1d1640'],
  ],
  moon,
}) => {
  const tex = useMemo(
    () =>
      canvasTexture(8, 512, (g, w, h) => {
        const grd = g.createLinearGradient(0, 0, 0, h);
        stops.forEach(([o, c]) => grd.addColorStop(o, c));
        g.fillStyle = grd;
        g.fillRect(0, 0, w, h);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(stops)],
  );
  const stars = useMemo(() => {
    const p: number[] = [];
    for (let i = 0; i < 700; i++) {
      const th = rand(i) * Math.PI * 2;
      const ph = 0.12 + rand(i + 77) * 1.2;
      p.push(95 * Math.cos(ph) * Math.cos(th), 95 * Math.sin(ph), 95 * Math.cos(ph) * Math.sin(th));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, []);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial map={tex} side={THREE.BackSide} toneMapped={false} fog={false} />
      </mesh>
      <points geometry={stars}>
        <pointsMaterial color="#fff4d6" size={0.35} transparent opacity={0.9} fog={false} toneMapped={false} />
      </points>
      {moon && (
        <group position={moon}>
          <mesh>
            <circleGeometry args={[2.2, 32]} />
            <meshBasicMaterial color="#fff2cf" toneMapped={false} fog={false} />
          </mesh>
          <Glow color="#ffe6b0" size={14} opacity={0.35} />
        </group>
      )}
    </group>
  );
};

/** Distant skyline of temple spires and domes (silhouette with lit windows). */
export const Skyline: React.FC<{z?: number; color?: string}> = ({z = -30, color = '#3a2b6e'}) => (
  <group position={[0, 0, z]}>
    {Array.from({length: 18}).map((_, i) => {
      const x = -36 + i * 4.2 + rand(i) * 1.5;
      const h = 3 + rand(i + 5) * 5;
      const kind = Math.floor(rand(i + 9) * 3);
      return (
        <group key={i} position={[x, 0, rand(i + 2) * -4]}>
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[3, h, 2]} />
            <meshBasicMaterial color={color} fog />
          </mesh>
          {kind === 0 && (
            <mesh position={[0, h, 0]}>
              <sphereGeometry args={[1.1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshBasicMaterial color={color} />
            </mesh>
          )}
          {kind === 1 && (
            <mesh position={[0, h + 1.4, 0]}>
              <coneGeometry args={[1.0, 2.8, 8]} />
              <meshBasicMaterial color={color} />
            </mesh>
          )}
          {Array.from({length: 4}).map((__, k) =>
            rand(i * 11 + k) > 0.45 ? (
              <mesh key={k} position={[-1 + k * 0.66, 0.8 + rand(i + k) * (h - 1.5), 1.01]}>
                <planeGeometry args={[0.25, 0.35]} />
                <Lit color="#ffbf6b" />
              </mesh>
            ) : null,
          )}
        </group>
      );
    })}
  </group>
);

/** Bulb string (festive lights) along a sagging wire. */
export const Bulbs: React.FC<{from: V3; to: V3; sag?: number; n?: number; colors?: string[]}> = ({
  from,
  to,
  sag = 0.5,
  n = 14,
  colors = ['#ffd27a', '#ff9f43', '#fff0b3', '#ff6b9a'],
}) => {
  const pts = useMemo(
    () =>
      Array.from({length: n + 1}).map((_, i) => {
        const t = i / n;
        return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - sag * 4 * t * (1 - t), from[2] + (to[2] - from[2]) * t] as V3;
      }),
    [from, to, sag, n],
  );
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), [pts]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 40, 0.012, 4, false]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      {pts.slice(1, -1).map((p, i) => (
        <group key={i} position={[p[0], p[1] - 0.06, p[2]]}>
          <mesh>
            <sphereGeometry args={[0.055, 8, 8]} />
            <Lit color={colors[i % colors.length]} />
          </mesh>
          <Glow color={colors[i % colors.length]} size={0.6} opacity={0.85} />
        </group>
      ))}
    </group>
  );
};

/** Hanging paper lantern. */
export const Lantern: React.FC<{position: V3; color?: string}> = ({position, color = '#ff5e3a'}) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.8, 4]} />
      <meshBasicMaterial color={INK} />
    </mesh>
    <mesh scale={[1, 1.25, 1]}>
      <sphereGeometry args={[0.2, 16, 12]} />
      <Lit color={color} />
    </mesh>
    {[-0.18, 0.18].map((y) => (
      <mesh key={y} position={[0, y * 1.25, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshBasicMaterial color="#d4a017" />
      </mesh>
    ))}
    <Glow color={color} size={1.4} opacity={0.7} />
  </group>
);

export const Diya: React.FC<{position: V3; f?: number; seed?: number}> = ({position, f = 0, seed = 0}) => {
  const k = 0.85 + 0.15 * Math.sin(f * 0.6 + seed * 3);
  return (
    <group position={position}>
      <mesh scale={[1, 0.45, 1]}>
        <sphereGeometry args={[0.09, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <Cel color="#b5532c" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[0.6, 1.5 * k, 0.6]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <Lit color="#ffd36b" />
      </mesh>
      <Glow position={[0, 0.06, 0]} color="#ffae42" size={0.7 * k} />
    </group>
  );
};

/** Rangoli on the floor (canvas-drawn mandala). */
export const Rangoli: React.FC<{position: V3; r?: number}> = ({position, r = 0.9}) => {
  const tex = useMemo(
    () =>
      canvasTexture(512, 512, (g, w) => {
        const c = w / 2;
        const rings = ['#e8336d', '#ff9f1c', '#ffd23f', '#2ec4b6', '#8a4fff', '#e8336d'];
        rings.forEach((col, i) => {
          g.fillStyle = col;
          g.beginPath();
          g.arc(c, c, c - i * 38, 0, Math.PI * 2);
          g.fill();
        });
        g.fillStyle = '#fff6e0';
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          g.beginPath();
          g.ellipse(c + Math.cos(a) * 150, c + Math.sin(a) * 150, 34, 14, a, 0, Math.PI * 2);
          g.fill();
        }
        g.fillStyle = '#ffd23f';
        g.beginPath();
        g.arc(c, c, 40, 0, Math.PI * 2);
        g.fill();
      }),
    [],
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <circleGeometry args={[r, 48]} />
      <meshToonMaterial map={tex} gradientMap={getRamp()} transparent />
    </mesh>
  );
};
