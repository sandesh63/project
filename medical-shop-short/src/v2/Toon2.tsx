// v3 character: big round head on a pawn-shaped body, flat 2-tone shading with a
// fixed light (so faces stay cream-white whatever the scene lighting), thick ink.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {canvasTexture} from '../three/util';

export type V3 = [number, number, number];
export const INK = '#1a0f22';

// ---------- flat 2-tone material ----------
const vert = `
  varying vec3 vN; varying vec2 vUv;
  void main(){ vN = normalize(normalMatrix * normal); vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const frag = `
  uniform vec3 color; uniform float shade; uniform sampler2D map; uniform float useMap;
  varying vec3 vN; varying vec2 vUv;
  void main(){
    vec3 base = color;
    if (useMap > 0.5) base *= texture2D(map, vUv).rgb;
    float d = dot(normalize(vN), normalize(vec3(-0.45, 0.55, 0.7)));
    float s = smoothstep(-0.05, 0.2, d);
    vec3 c = mix(base * shade, base, s);
    // soft warm bounce on the top
    c += vec3(0.04, 0.02, 0.0) * smoothstep(0.4, 1.0, vN.y);
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }`;

const matCache = new Map<string, THREE.ShaderMaterial>();
export const flatMat = (color: string, shade = 0.82, map?: THREE.Texture) => {
  const k = `${color}|${shade}|${map?.uuid ?? ''}`;
  let m = matCache.get(k);
  if (!m) {
    m = new THREE.ShaderMaterial({
      uniforms: {
        color: {value: new THREE.Color(color)},
        shade: {value: shade},
        map: {value: map ?? null},
        useMap: {value: map ? 1 : 0},
      },
      vertexShader: vert,
      fragmentShader: frag,
      side: THREE.DoubleSide,
    });
    matCache.set(k, m);
  }
  return m;
};

const inkMats = new Map<number, THREE.ShaderMaterial>();
const inkMat = (t: number) => {
  let m = inkMats.get(t);
  if (!m) {
    m = new THREE.ShaderMaterial({
      uniforms: {thick: {value: t}, color: {value: new THREE.Color(INK)}},
      vertexShader: `uniform float thick; void main(){ vec3 p = position + normalize(normal)*thick; gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);} `,
      fragmentShader: `uniform vec3 color; void main(){ gl_FragColor = vec4(color,1.0);} `,
      side: THREE.BackSide,
    });
    inkMats.set(t, m);
  }
  return m;
};

/** Mesh with flat colour + thick ink outline. */
const Part: React.FC<{
  geo: THREE.BufferGeometry;
  color: string;
  ink?: number;
  map?: THREE.Texture;
  position?: V3;
  rotation?: V3;
  scale?: V3 | number;
  shade?: number;
}> = ({geo, color, ink = 0.025, map, position, rotation, scale, shade}) => (
  <group position={position} rotation={rotation} scale={scale as never}>
    <mesh geometry={geo} material={flatMat(color, shade, map)} castShadow />
    {ink > 0 && <mesh geometry={geo} material={inkMat(ink)} />}
  </group>
);

const flat = (c: string) => <meshBasicMaterial color={c} side={THREE.DoubleSide} />;

// ---------- shared geometry ----------
const HEAD_R = 0.42;
const headGeo = new THREE.SphereGeometry(HEAD_R, 40, 32);
// pawn body: narrow top hidden under the head, broad bell to the floor
const bodyProfile = [
  [0.0, 0.0],
  [0.4, 0.0],
  [0.46, 0.05],
  [0.47, 0.25],
  [0.44, 0.6],
  [0.38, 0.88],
  [0.3, 1.02],
  [0.2, 1.1],
  [0.0, 1.12],
].map(([r, y]) => new THREE.Vector2(r, y));
const bodyPts = new THREE.SplineCurve(bodyProfile).getPoints(40);
const bodyGeo = new THREE.LatheGeometry(bodyPts, 40);
const bodyRadius = (y: number) => {
  let b = bodyPts[0];
  for (const p of bodyPts) if (Math.abs(p.y - y) < Math.abs(b.y - y)) b = p;
  return b.x;
};
const shell = (y0: number, y1: number, phi0: number, len: number) =>
  new THREE.LatheGeometry(
    bodyPts.filter((p) => p.y >= y0 && p.y <= y1).map((p) => new THREE.Vector2(p.x * 1.035, p.y)),
    40,
    phi0,
    len,
  );
const limbGeo = new THREE.CapsuleGeometry(0.038, 1, 4, 8);
const handGeo = new THREE.SphereGeometry(0.05, 12, 10);

const HEAD_Y = 1.42;

/** Put a flat decal on the head sphere at (x, y) offsets from the head centre. */
const OnFace: React.FC<{x: number; y: number; lift?: number; children: React.ReactNode}> = ({x, y, lift = 0.004, children}) => {
  const z = Math.sqrt(Math.max(0, HEAD_R * HEAD_R - x * x - y * y));
  const n = new THREE.Vector3(x, y, z).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  return (
    <group position={[x + n.x * lift, HEAD_Y + y + n.y * lift, z + n.z * lift]} quaternion={q}>
      {children}
    </group>
  );
};

// ---------- 2D shapes for face decals ----------
const moustacheGeo = (() => {
  const s = new THREE.Shape();
  // right half, mirrored below
  s.moveTo(0, 0.02);
  s.bezierCurveTo(0.04, 0.045, 0.1, 0.04, 0.13, 0.0);
  s.bezierCurveTo(0.15, -0.02, 0.17, 0.0, 0.165, 0.03); // curl tip up
  s.bezierCurveTo(0.185, 0.0, 0.17, -0.05, 0.13, -0.04);
  s.bezierCurveTo(0.09, -0.03, 0.04, -0.02, 0, -0.025);
  s.bezierCurveTo(-0.04, -0.02, -0.09, -0.03, -0.13, -0.04);
  s.bezierCurveTo(-0.17, -0.05, -0.185, 0.0, -0.165, 0.03);
  s.bezierCurveTo(-0.17, 0.0, -0.15, -0.02, -0.13, 0.0);
  s.bezierCurveTo(-0.1, 0.04, -0.04, 0.045, 0, 0.02);
  return new THREE.ShapeGeometry(s, 16);
})();
const smileGeo = new THREE.RingGeometry(0.032, 0.046, 20, 1, Math.PI * 1.1, Math.PI * 0.8);
const frownGeo = new THREE.RingGeometry(0.032, 0.046, 20, 1, Math.PI * 0.1, Math.PI * 0.8);

// ---------- textures for clothing ----------
const beadBand = (base: string) =>
  canvasTexture(512, 32, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    const cols = ['#ffd23f', '#2ec4b6', '#ffffff', '#3a86ff'];
    for (let i = 0; i < 32; i++) {
      g.fillStyle = cols[i % 4];
      g.beginPath();
      g.arc(8 + i * 16, h / 2, 4.5, 0, Math.PI * 2);
      g.fill();
    }
  });
const turbanTex = (cols: string[]) =>
  canvasTexture(512, 256, (g, w, h) => {
    g.fillStyle = cols[0];
    g.fillRect(0, 0, w, h);
    g.lineWidth = 26;
    for (let i = -10; i < 30; i++) {
      g.strokeStyle = cols[i % cols.length < 0 ? 0 : i % cols.length];
      g.beginPath();
      g.moveTo(i * 30, 0);
      g.lineTo(i * 30 + h, h);
      g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 60; i++) {
      g.beginPath();
      g.arc((i * 37) % w, (i * 53) % h, 3, 0, Math.PI * 2);
      g.fill();
    }
  });

// ---------- limbs ----------
const Limb: React.FC<{a: V3; b: V3; color: string}> = ({a, b, color}) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  const mid = va.add(vb).multiplyScalar(0.5);
  return (
    <group position={mid.toArray() as V3} quaternion={q}>
      <Part geo={limbGeo} color={color} ink={0.014} scale={[1, len / 1.076, 1]} />
    </group>
  );
};

export type Mood = 'smile' | 'happy' | 'worried' | 'shock' | 'sly' | 'calm';

export type ToonProps = {
  position?: V3;
  rotY?: number;
  scale?: number;
  skin?: string;
  cloth: string;
  trim?: string;
  vest?: string;
  coat?: string;
  hair?: 'black' | 'bald' | 'none';
  turban?: string[];
  cap?: string;
  moustache?: boolean;
  glasses?: boolean;
  mood?: Mood;
  talk?: boolean;
  handL?: V3;
  handR?: V3;
  holdR?: React.ReactNode;
  lean?: number;
  jump?: number;
  sweat?: boolean;
  seed?: number;
  look?: [number, number];
  stethoscope?: boolean;
  chain?: boolean;
};

export const Toon: React.FC<ToonProps> = ({
  position = [0, 0, 0],
  rotY = 0,
  scale = 1,
  skin = '#fff1e2',
  cloth,
  trim = '#e63946',
  vest,
  coat,
  hair = 'black',
  turban,
  cap,
  moustache,
  glasses,
  mood = 'smile',
  talk,
  handL = [0.5, 0.42, 0.28],
  handR = [-0.5, 0.42, 0.28],
  holdR,
  lean = 0,
  jump = 0,
  sweat,
  seed = 0,
  look = [0, 0],
  stethoscope,
  chain = true,
}) => {
  const f = useCurrentFrame();
  const band = useMemo(() => beadBand(trim), [trim]);
  const tTex = useMemo(() => (turban ? turbanTex(turban) : undefined), [turban]);
  const vestGeo = useMemo(() => shell(0.25, 1.0, 0.7, Math.PI * 2 - 1.4), []);
  const coatGeo = useMemo(() => shell(0.02, 1.02, 0.42, Math.PI * 2 - 0.84), []);
  const blink = (f + seed * 37) % 110 < 4;
  const mouthOpen = talk ? 0.3 + 0.7 * Math.abs(Math.sin(f * 0.5 + seed)) : 0;
  const bob = Math.sin(f * 0.1 + seed) * 0.008;

  const lidded = mood === 'calm' || mood === 'sly';
  const shock = mood === 'shock';
  const eyeY = 0.04;
  const ex = 0.125;

  const shL: V3 = [0.33, 0.86, 0.14];
  const shR: V3 = [-0.33, 0.86, 0.14];
  const sleeve = coat ?? cloth;

  return (
    <group position={[position[0], position[1] + jump, position[2]]} rotation={[0, rotY, 0]} scale={scale}>
      <group rotation={[lean, 0, 0]}>
        {/* body */}
        <Part geo={bodyGeo} color={cloth} ink={0.028} />
        {/* hem border */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.475, 0.468, 0.06, 40, 1, true]} />
          <meshBasicMaterial color={trim} side={THREE.DoubleSide} />
        </mesh>
        {/* buttons */}
        {!coat &&
          [0.5, 0.64, 0.78].map((y) => (
            <mesh key={y} position={[0, y, bodyRadius(y) + 0.005]}>
              <circleGeometry args={[0.016, 10]} />
              {flat(INK)}
            </mesh>
          ))}
        {vest && (
          <group>
            <Part geo={vestGeo} color={vest} ink={0.01} />
          </group>
        )}
        {coat && <Part geo={coatGeo} color={coat} ink={0.012} />}
        {/* beaded collar band + gold chain, like the reference */}
        <mesh position={[0, 0.95, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[bodyRadius(0.97) * 1.06, bodyRadius(0.92) * 1.06, 0.06, 40, 1, true]} />
          <meshBasicMaterial map={band} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        {chain && (
          <mesh position={[0, 0.8, 0.04]} rotation={[1.2, 0, 0]}>
            <torusGeometry args={[0.3, 0.008, 6, 40, Math.PI]} />
            <meshBasicMaterial color="#e8b923" />
          </mesh>
        )}
        {stethoscope && (
          <mesh position={[0, 0.82, 0.06]} rotation={[1.1, 0, 0]}>
            <torusGeometry args={[0.31, 0.014, 6, 40, Math.PI]} />
            {flat('#2b2d42')}
          </mesh>
        )}

        {/* arms: thin sleeves with ink, tiny hands */}
        {(
          [
            [shL, handL],
            [shR, handR],
          ] as [V3, V3][]
        ).map(([s, h], i) => {
          const e: V3 = [(s[0] + h[0]) / 2 + Math.sign(s[0]) * 0.12, (s[1] + h[1]) / 2 - 0.02, (s[2] + h[2]) / 2 + 0.06];
          return (
            <group key={i}>
              <Limb a={s} b={e} color={sleeve} />
              <Limb a={e} b={h} color={sleeve} />
              <Part geo={handGeo} color={skin} ink={0.012} position={h} />
            </group>
          );
        })}
        {holdR && <group position={[handR[0], handR[1], handR[2] + 0.05]}>{holdR}</group>}

        {/* head */}
        <group position={[0, bob, 0]}>
          <Part geo={headGeo} color={skin} ink={0.03} position={[0, HEAD_Y, 0]} shade={0.86} />
          {/* hair */}
          {hair === 'black' && !turban && !cap && (
            <group position={[0, HEAD_Y, 0]} rotation={[-0.45, 0, 0]}>
              <mesh>
                <sphereGeometry args={[HEAD_R * 1.025, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                <primitive object={flatMat('#1d1526', 0.8)} attach="material" />
              </mesh>
            </group>
          )}
          {hair === 'bald' &&
            [-1, 1].map((s) => (
              <Part key={s} geo={headGeo} color="#cfcad9" ink={0.012} position={[0.37 * s, HEAD_Y + 0.02, -0.12]} scale={[0.22, 0.4, 0.45]} />
            ))}
          {turban && tTex && (
            <group position={[0, HEAD_Y + 0.22, -0.01]}>
              <Part geo={headGeo} color="#ffffff" map={tTex} ink={0.025} scale={[1.12, 0.62, 1.1]} />
              <mesh position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.43, 0.035, 8, 40]} />
                {flat(INK)}
              </mesh>
            </group>
          )}
          {cap && (
            <group position={[0, HEAD_Y + 0.28, 0]}>
              <Part geo={headGeo} color={cap} ink={0.02} scale={[0.9, 0.42, 0.9]} />
            </group>
          )}

          {/* eyes */}
          {[-1, 1].map((s) => (
            <OnFace key={s} x={ex * s + look[0] * 0.02} y={eyeY + look[1] * 0.015}>
              {shock && (
                <>
                  <mesh>
                    <circleGeometry args={[0.07, 24]} />
                    {flat('#ffffff')}
                  </mesh>
                  <mesh position={[0, 0, -0.001]}>
                    <circleGeometry args={[0.082, 24]} />
                    {flat(INK)}
                  </mesh>
                </>
              )}
              <mesh position={[0, 0, 0.002]} scale={[1, blink ? 0.15 : lidded ? 0.6 : 1.1, 1]}>
                <circleGeometry args={[shock ? 0.032 : 0.036, 18]} />
                {flat(INK)}
              </mesh>
              {lidded && !blink && (
                <mesh position={[0, 0.026, 0.003]}>
                  <planeGeometry args={[0.1, 0.02]} />
                  {flat(INK)}
                </mesh>
              )}
              {(mood === 'worried' || mood === 'sly' || mood === 'happy') && (
                <mesh position={[0, 0.085, 0.003]} rotation={[0, 0, (mood === 'worried' ? 0.35 : mood === 'sly' ? -0.3 : -0.18) * s]}>
                  <planeGeometry args={[0.085, 0.018]} />
                  {flat(INK)}
                </mesh>
              )}
            </OnFace>
          ))}
          {/* glasses */}
          {glasses &&
            [-1, 1].map((s) => (
              <OnFace key={s} x={ex * s} y={eyeY} lift={0.02}>
                <mesh>
                  <ringGeometry args={[0.068, 0.082, 28]} />
                  {flat(INK)}
                </mesh>
              </OnFace>
            ))}
          {glasses && (
            <OnFace x={0} y={eyeY + 0.01} lift={0.02}>
              <mesh>
                <planeGeometry args={[0.1, 0.014]} />
                {flat(INK)}
              </mesh>
            </OnFace>
          )}
          {/* nose */}
          <OnFace x={0} y={-0.04}>
            <mesh>
              <circleGeometry args={[0.018, 12]} />
              {flat('#e9b49a')}
            </mesh>
          </OnFace>
          {/* blush */}
          {[-1, 1].map((s) => (
            <OnFace key={s} x={0.22 * s} y={-0.08} lift={0.002}>
              <mesh>
                <circleGeometry args={[0.042, 16]} />
                <meshBasicMaterial color="#ffb0a8" transparent opacity={0.55} />
              </mesh>
            </OnFace>
          ))}
          {moustache && (
            <OnFace x={0} y={-0.1} lift={0.006}>
              <mesh geometry={moustacheGeo} scale={1.05}>
                {flat(INK)}
              </mesh>
            </OnFace>
          )}
          {/* mouth */}
          <OnFace x={0} y={moustache ? -0.175 : -0.15} lift={0.005}>
            {talk || shock ? (
              <mesh scale={[shock ? 0.9 : 1, shock ? 1.25 : 0.35 + mouthOpen, 1]}>
                <circleGeometry args={[0.04, 16]} />
                {flat('#4a1426')}
              </mesh>
            ) : (
              <mesh geometry={mood === 'worried' ? frownGeo : smileGeo} position={[0, mood === 'worried' ? -0.03 : 0.03, 0]} scale={mood === 'happy' ? 1.3 : 1}>
                {flat(INK)}
              </mesh>
            )}
          </OnFace>
          {sweat &&
            [0, 1].map((i) => {
              const t = ((f + i * 20) % 40) / 40;
              return (
                <mesh key={i} position={[0.33 - i * 0.04, HEAD_Y + 0.25 - t * 0.4, 0.3]} scale={[0.7, 1, 0.7]}>
                  <sphereGeometry args={[0.04, 10, 10]} />
                  <meshBasicMaterial color="#8fd3ff" transparent opacity={1 - t} />
                </mesh>
              );
            })}
        </group>
      </group>
    </group>
  );
};

// ---------- cast ----------
export const MASCOT: ToonProps = {cloth: '#fbf7ef', trim: '#e63946', vest: '#2f6fe4', hair: 'black', moustache: true};
export const CHEMIST: ToonProps = {cloth: '#27b5a2', trim: '#1d7f73', coat: '#ffffff', hair: 'bald', glasses: true, stethoscope: true, chain: false, seed: 3};
export const DISTRIBUTOR: ToonProps = {
  cloth: '#ff8a3d',
  trim: '#7b2cbf',
  turban: ['#e63946', '#ffd23f', '#2a9d8f', '#f77f00'],
  moustache: true,
  seed: 7,
};
