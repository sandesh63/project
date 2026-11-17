import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Outlines} from '@react-three/drei';
import {canvasTexture, getGlowTexture, getToonGradient, rand, roundRect, FONT} from './util';

export type V3 = [number, number, number];
export const INK = '#1d1238';

// ---------- materials ----------
export const Toon: React.FC<{color: string; side?: THREE.Side; transparent?: boolean; opacity?: number; map?: THREE.Texture}> = ({
  color,
  side,
  transparent,
  opacity,
  map,
}) => (
  <meshToonMaterial
    color={color}
    gradientMap={getToonGradient()}
    side={side}
    transparent={transparent}
    opacity={opacity}
    map={map}
  />
);

/** Unlit, un-tonemapped colour – for things that should read as light sources. */
export const Emit: React.FC<{color: string; opacity?: number; map?: THREE.Texture}> = ({color, opacity = 1, map}) => (
  <meshBasicMaterial color={color} toneMapped={false} transparent={opacity < 1} opacity={opacity} map={map} />
);

/** Inverted-hull outline: reuses the parent mesh's geometry, pushed out along normals. */
export const Ink: React.FC<{t?: number}> = ({t = 0.018}) => {
  const ref = React.useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {thick: {value: t}, color: {value: new THREE.Color(INK)}},
        vertexShader: `uniform float thick;
          void main(){
            vec3 p = position + normalize(normal) * thick;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
          }`,
        fragmentShader: `uniform vec3 color; void main(){ gl_FragColor = vec4(color,1.0); }`,
        side: THREE.BackSide,
      }),
    [t],
  );
  React.useLayoutEffect(() => {
    const m = ref.current;
    const parent = m?.parent as THREE.Mesh | null;
    if (m && parent && parent.geometry) m.geometry = parent.geometry;
  });
  return <mesh ref={ref} material={mat} />;
};
export const _keepOutlines = Outlines;

// ---------- glow (fake bloom) ----------
export const Glow: React.FC<{position?: V3; color: string; size?: number; opacity?: number}> = ({
  position = [0, 0, 0],
  color,
  size = 1,
  opacity = 0.9,
}) => (
  <sprite position={position} scale={[size, size, size]} renderOrder={10}>
    <spriteMaterial
      map={getGlowTexture()}
      color={color}
      transparent
      opacity={opacity}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      toneMapped={false}
    />
  </sprite>
);

// ---------- sky / ground ----------
export const Sky: React.FC<{stops: [number, string][]; stars?: boolean; radius?: number}> = ({
  stops,
  stars = true,
  radius = 80,
}) => {
  const tex = useMemo(
    () =>
      canvasTexture(16, 512, (g, w, h) => {
        const grd = g.createLinearGradient(0, 0, 0, h);
        stops.forEach(([o, c]) => grd.addColorStop(o, c));
        g.fillStyle = grd;
        g.fillRect(0, 0, w, h);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(stops)],
  );
  const starGeo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 500; i++) {
      const th = rand(i) * Math.PI * 2;
      const ph = 0.15 + rand(i + 99) * 1.1;
      const r = radius * 0.95;
      pts.push(r * Math.cos(ph) * Math.cos(th), r * Math.sin(ph), r * Math.cos(ph) * Math.sin(th));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [radius]);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial map={tex} side={THREE.BackSide} toneMapped={false} fog={false} />
      </mesh>
      {stars && (
        <points geometry={starGeo}>
          <pointsMaterial color="#fff6d8" size={0.35} sizeAttenuation transparent opacity={0.85} fog={false} toneMapped={false} />
        </points>
      )}
    </group>
  );
};

export const TiledGround: React.FC<{
  size?: [number, number];
  position?: V3;
  base?: string;
  line?: string;
  repeat?: [number, number];
}> = ({size = [60, 60], position = [0, 0, 0], base = '#3a2f6b', line = '#2a2152', repeat = [30, 30]}) => {
  const tex = useMemo(
    () =>
      canvasTexture(
        128,
        128,
        (g, w, h) => {
          g.fillStyle = base;
          g.fillRect(0, 0, w, h);
          g.strokeStyle = line;
          g.lineWidth = 6;
          g.strokeRect(0, 0, w, h);
          g.fillStyle = 'rgba(255,255,255,0.04)';
          g.fillRect(8, 8, w / 2 - 8, h / 2 - 8);
        },
        repeat,
      ),
    [base, line, repeat[0], repeat[1]],
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <Toon color="#ffffff" map={tex} />
    </mesh>
  );
};

// ---------- text on a plane ----------
export const TextPlane: React.FC<{
  text: string;
  width: number;
  height: number;
  position?: V3;
  rotation?: V3;
  color?: string;
  bg?: string;
  font?: number;
  glow?: boolean;
  border?: string;
}> = ({text, width, height, position, rotation, color = '#ffffff', bg, font = 0.7, glow, border}) => {
  const tex = useMemo(() => {
    const px = 256;
    return canvasTexture(Math.round(width * px), Math.round(height * px), (g, w, h) => {
      if (bg) {
        g.fillStyle = bg;
        roundRect(g, 4, 4, w - 8, h - 8, h * 0.18);
        g.fill();
      }
      if (border) {
        g.strokeStyle = border;
        g.lineWidth = h * 0.06;
        roundRect(g, h * 0.05, h * 0.05, w - h * 0.1, h - h * 0.1, h * 0.16);
        g.stroke();
      }
      let fs = Math.round(h * font);
      g.font = `800 ${fs}px ${FONT}`;
      while (g.measureText(text).width > w * 0.92 && fs > 8) g.font = `800 ${--fs}px ${FONT}`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      if (glow) {
        g.shadowColor = color;
        g.shadowBlur = h * 0.18;
      }
      g.fillStyle = color;
      g.fillText(text, w / 2, h / 2 + h * 0.04);
    });
  }, [text, width, height, color, bg, font, glow, border]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
};

// ---------- small props ----------
const BOX_COLORS = ['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#3bc9db', '#ffffff'];

export const MedBox: React.FC<{size?: V3; color?: string; position?: V3; rotation?: V3; outline?: boolean}> = ({
  size = [0.3, 0.42, 0.18],
  color = '#4dabf7',
  position,
  rotation,
  outline,
}) => (
  <group position={position} rotation={rotation}>
    <mesh castShadow>
      <boxGeometry args={size} />
      <Toon color={color} />
      {outline && <Ink t={0.012} />}
    </mesh>
    {/* white label band */}
    <mesh position={[0, size[1] * 0.08, size[2] / 2 + 0.002]}>
      <planeGeometry args={[size[0] * 0.92, size[1] * 0.32]} />
      <Toon color="#fff8ee" />
    </mesh>
    <mesh position={[0, size[1] * 0.08, size[2] / 2 + 0.004]}>
      <planeGeometry args={[size[0] * 0.5, size[1] * 0.06]} />
      <Toon color={color} />
    </mesh>
  </group>
);

/** Shelf unit packed with colourful medicine boxes. */
export const Shelf: React.FC<{
  width?: number;
  height?: number;
  rows?: number;
  depth?: number;
  position?: V3;
  rotation?: V3;
  seed?: number;
  wood?: string;
  palette?: string[];
  jars?: boolean;
}> = ({width = 3, height = 2.6, rows = 5, depth = 0.45, position, rotation, seed = 1, wood = '#8a5a3c', palette = BOX_COLORS, jars}) => {
  const items = useMemo(() => {
    const list: {x: number; y: number; w: number; h: number; c: string; jar: boolean}[] = [];
    const rowH = height / rows;
    for (let r = 0; r < rows; r++) {
      let x = -width / 2 + 0.08;
      let i = 0;
      while (x < width / 2 - 0.25) {
        const s = seed * 1000 + r * 50 + i;
        const w = 0.14 + rand(s) * 0.16;
        const h = rowH * (0.45 + rand(s + 7) * 0.4);
        list.push({x: x + w / 2, y: r * rowH + 0.05 + h / 2, w, h, c: palette[Math.floor(rand(s + 3) * palette.length)], jar: !!jars && rand(s + 11) > 0.55});
        x += w + 0.02 + rand(s + 5) * 0.03;
        i++;
      }
    }
    return list;
  }, [width, height, rows, seed, palette, jars]);
  const rowH = height / rows;
  return (
    <group position={position} rotation={rotation}>
      {/* back panel */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, height + 0.1, 0.05]} />
        <Toon color="#5b3a29" />
      </mesh>
      {/* sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * width) / 2, height / 2, 0]}>
          <boxGeometry args={[0.07, height + 0.1, depth]} />
          <Toon color={wood} />
        </mesh>
      ))}
      {/* boards */}
      {Array.from({length: rows + 1}).map((_, r) => (
        <mesh key={r} position={[0, r * rowH, 0]} receiveShadow>
          <boxGeometry args={[width, 0.05, depth]} />
          <Toon color={wood} />
        </mesh>
      ))}
      {items.map((it, i) =>
        it.jar ? (
          <group key={i} position={[it.x, it.y - it.h / 2, 0]}>
            <mesh position={[0, it.h * 0.42, 0]}>
              <cylinderGeometry args={[it.w * 0.45, it.w * 0.45, it.h * 0.84, 16]} />
              <Toon color={it.c} />
            </mesh>
            <mesh position={[0, it.h * 0.9, 0]}>
              <cylinderGeometry args={[it.w * 0.38, it.w * 0.38, it.h * 0.14, 16]} />
              <Toon color="#ffffff" />
            </mesh>
          </group>
        ) : (
          <MedBox key={i} size={[it.w, it.h, depth * 0.6]} color={it.c} position={[it.x, it.y, 0]} />
        ),
      )}
    </group>
  );
};

export const NeonCross: React.FC<{position?: V3; scale?: number; color?: string; flicker?: number}> = ({
  position,
  scale = 1,
  color = '#2bff9a',
  flicker = 1,
}) => (
  <group position={position} scale={scale}>
    <mesh>
      <boxGeometry args={[0.95, 0.95, 0.12]} />
      <Toon color="#1c1838" />
    </mesh>
    <mesh position={[0, 0, 0.07]}>
      <boxGeometry args={[0.7, 0.2, 0.04]} />
      <Emit color={color} opacity={flicker} />
    </mesh>
    <mesh position={[0, 0, 0.07]}>
      <boxGeometry args={[0.2, 0.7, 0.04]} />
      <Emit color={color} opacity={flicker} />
    </mesh>
    <Glow position={[0, 0, 0.2]} color={color} size={2.6} opacity={0.75 * flicker} />
  </group>
);

/** A strand of bulbs hanging on a sagging wire between two points. */
export const StringLights: React.FC<{from: V3; to: V3; sag?: number; count?: number; colors?: string[]; phase?: number}> = ({
  from,
  to,
  sag = 0.6,
  count = 14,
  colors = ['#ffd27a', '#ff9f43', '#ffe8a3', '#ff6b9a'],
  phase = 0,
}) => {
  const pts = useMemo(() => {
    const list: V3[] = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      list.push([
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t - sag * 4 * t * (1 - t),
        from[2] + (to[2] - from[2]) * t,
      ]);
    }
    return list;
  }, [from, to, sag, count]);
  const wire = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), [pts]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[wire, 40, 0.012, 4, false]} />
        <meshBasicMaterial color="#120a24" />
      </mesh>
      {pts.slice(1, -1).map((p, i) => {
        const c = colors[(i + phase) % colors.length];
        return (
          <group key={i} position={[p[0], p[1] - 0.06, p[2]]}>
            <mesh>
              <sphereGeometry args={[0.055, 10, 10]} />
              <Emit color={c} />
            </mesh>
            <Glow color={c} size={0.55} opacity={0.8} />
          </group>
        );
      })}
    </group>
  );
};

/** Background building with lit windows, ledges and an awning. */
export const Building: React.FC<{
  position: V3;
  size: V3;
  color: string;
  seed?: number;
  awning?: string;
}> =({position, size, color, seed = 1, awning}) => {
  const [w, h, d] = size;
  const cols = Math.max(2, Math.round(w / 0.9));
  const floors = Math.max(1, Math.floor((h - 0.9) / 1.3));
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <Toon color={color} />
      </mesh>
      {/* roof parapet */}
      <mesh position={[0, h + 0.08, 0]}>
        <boxGeometry args={[w + 0.12, 0.16, d + 0.12]} />
        <Toon color="#2b2350" />
      </mesh>
      {Array.from({length: floors}).map((_, fl) => {
        const y = 1.5 + fl * 1.3;
        return (
          <group key={fl}>
            <mesh position={[0, y - 0.55, d / 2 + 0.06]}>
              <boxGeometry args={[w, 0.08, 0.14]} />
              <Toon color="#2b2350" />
            </mesh>
            {Array.from({length: cols}).map((__, c) => {
              const lit = rand(seed * 31 + fl * 7 + c) > 0.35;
              const warm = rand(seed * 17 + fl * 3 + c) > 0.25;
              const x = -w / 2 + (w / cols) * (c + 0.5);
              const col = lit ? (warm ? '#ffcf7a' : '#9fd8ff') : '#2a2148';
              return (
                <group key={c} position={[x, y, d / 2 + 0.01]}>
                  <mesh>
                    <planeGeometry args={[0.42, 0.62]} />
                    {lit ? <Emit color={col} /> : <Toon color={col} />}
                  </mesh>
                  <mesh position={[0, 0, 0.005]}>
                    <planeGeometry args={[0.04, 0.62]} />
                    <meshBasicMaterial color="#3a2a5a" />
                  </mesh>
                  {lit && <Glow color={col} size={0.9} opacity={0.25} position={[0, 0, 0.05]} />}
                </group>
              );
            })}
          </group>
        );
      })}
      {awning && (
        <group position={[0, 1.15, d / 2 + 0.35]}>
          <mesh rotation={[0.35, 0, 0]}>
            <boxGeometry args={[w * 0.9, 0.05, 0.75]} />
            <Toon color={awning} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/** Clay oil lamp with a flame. */
export const Diya: React.FC<{position: V3; f: number; seed?: number}> = ({position, f, seed = 0}) => {
  const flick = 0.85 + 0.15 * Math.sin(f * 0.6 + seed * 3);
  return (
    <group position={position}>
      <mesh scale={[1, 0.45, 1]}>
        <sphereGeometry args={[0.09, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <Toon color="#b5532c" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[0.6, 1.4 * flick, 0.6]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <Emit color="#ffd36b" />
      </mesh>
      <Glow position={[0, 0.06, 0]} color="#ffae42" size={0.6 * flick} opacity={0.9} />
    </group>
  );
};

export const TubeLight: React.FC<{position: V3; length?: number; on?: number}> = ({position, length = 1.2, on = 1}) => (
  <group position={position}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.035, 0.035, length, 8]} />
      <Emit color={on > 0.5 ? '#f4fbff' : '#6c7a8a'} />
    </mesh>
    {on > 0.5 && (
      <>
        <Glow color="#dff4ff" size={1.6} opacity={0.35 * on} />
        <Glow position={[length * 0.3, 0, 0]} color="#dff4ff" size={1.0} opacity={0.3 * on} />
        <Glow position={[-length * 0.3, 0, 0]} color="#dff4ff" size={1.0} opacity={0.3 * on} />
      </>
    )}
  </group>
);

export const Coin: React.FC<{position?: V3; rotation?: V3; scale?: number}> = ({position, rotation, scale = 1}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.04, 20]} />
      <meshToonMaterial color="#ffc93c" gradientMap={getToonGradient()} emissive="#5a3a00" />
    </mesh>
    <mesh position={[0, 0, 0.022]}>
      <torusGeometry args={[0.11, 0.015, 6, 20]} />
      <Toon color="#e9a400" />
    </mesh>
  </group>
);

/** A strip of tablets (blister pack). */
export const TabletStrip: React.FC<{position?: V3; rotation?: V3; scale?: number}> = ({position, rotation, scale = 1}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh>
      <boxGeometry args={[0.36, 0.2, 0.02]} />
      <Toon color="#d9e2ec" />
    </mesh>
    {[-0.12, -0.04, 0.04, 0.12].map((x) =>
      [-0.045, 0.045].map((y) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.015]} scale={[1, 0.7, 0.6]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <Toon color="#ff8fab" />
        </mesh>
      )),
    )}
  </group>
);
