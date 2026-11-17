import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {Stage, Cam} from '../Stage';
import {Character, CHEMIST} from '../Character';
import {Emit, Glow, Ink, NeonCross, Sky, StringLights, TextPlane, Toon, V3, MedBox} from '../props';
import {canvasTexture, lerp, lerp3, pop, prog, rand, roundRect, FONT} from '../util';
import {ShopInterior} from './Shop';

// =====================================================================
// Scene 2 – Journey: factory → distributor godown → chemist (diorama)
// =====================================================================

const Tree: React.FC<{position: V3; s?: number}> = ({position, s = 1}) => (
  <group position={position} scale={s}>
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.07, 0.1, 0.7, 8]} />
      <Toon color="#6b4430" />
    </mesh>
    <mesh position={[0, 1.0, 0]} castShadow>
      <sphereGeometry args={[0.45, 14, 12]} />
      <Toon color="#3fae6a" />
      <Ink t={0.015} />
    </mesh>
    <mesh position={[0.2, 1.3, 0.1]}>
      <sphereGeometry args={[0.3, 12, 10]} />
      <Toon color="#55c77f" />
    </mesh>
  </group>
);

const Factory: React.FC<{position: V3; f: number}> = ({position, f}) => (
  <group position={position}>
    <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
      <boxGeometry args={[3, 1.8, 1.8]} />
      <Toon color="#e7e1f5" />
      <Ink t={0.02} />
    </mesh>
    {/* saw-tooth roof */}
    {[-1, 0, 1].map((i) => (
      <mesh key={i} position={[i * 1, 2.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 1.8, 3]} />
        <Toon color="#6c8cff" />
      </mesh>
    ))}
    {/* windows */}
    {[-1, 0, 1].map((i) => (
      <mesh key={i} position={[i * 0.9, 1.0, 0.91]}>
        <planeGeometry args={[0.55, 0.45]} />
        <Emit color="#ffd27a" />
      </mesh>
    ))}
    {/* chimneys + smoke */}
    {[-0.9, -0.3].map((x, ci) => (
      <group key={x} position={[x, 2.6, -0.4]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.18, 1.4, 12]} />
          <Toon color="#c0392b" />
          <Ink t={0.012} />
        </mesh>
        {Array.from({length: 5}).map((_, i) => {
          const t = ((f * 0.8 + i * 18 + ci * 9) % 90) / 90;
          return (
            <mesh key={i} position={[t * 0.6, 0.8 + t * 2, 0]} scale={0.18 + t * 0.4}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshToonMaterial color="#f1eefc" transparent opacity={0.9 * (1 - t)} />
            </mesh>
          );
        })}
      </group>
    ))}
    <mesh position={[0, 0.4, 0.92]}>
      <planeGeometry args={[0.7, 0.8]} />
      <Toon color="#4a3f86" />
    </mesh>
    <group position={[1.15, 1.55, 0.92]}>
      <mesh>
        <planeGeometry args={[0.5, 0.5]} />
        <Emit color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.32, 0.1]} />
        <Emit color="#ff3b5c" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.1, 0.32]} />
        <Emit color="#ff3b5c" />
      </mesh>
    </group>
  </group>
);

const Godown: React.FC<{position: V3}> = ({position}) => (
  <group position={position}>
    <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.6, 1.4, 1.8]} />
      <Toon color="#f2b880" />
      <Ink t={0.02} />
    </mesh>
    <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.55, 1, 1]}>
      <cylinderGeometry args={[1.3, 1.3, 1.8, 24, 1, false, 0, Math.PI]} />
      <Toon color="#9c5b3a" side={THREE.DoubleSide} />
    </mesh>
    {/* rolling door */}
    <mesh position={[0, 0.55, 0.91]}>
      <planeGeometry args={[1.3, 1.1]} />
      <Toon color="#8e9bb5" />
    </mesh>
    {Array.from({length: 6}).map((_, i) => (
      <mesh key={i} position={[0, 0.1 + i * 0.18, 0.915]}>
        <planeGeometry args={[1.3, 0.02]} />
        <meshBasicMaterial color="#5e6a85" />
      </mesh>
    ))}
    {/* cartons outside */}
    {[[-1.0, 0.15, 1.2], [-0.7, 0.15, 1.25], [-0.85, 0.45, 1.22]].map((p, i) => (
      <mesh key={i} position={p as V3} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <Toon color="#c98b52" />
        <Ink t={0.008} />
      </mesh>
    ))}
    <pointLight position={[0, 1.4, 1.5]} intensity={2} distance={4} color="#ffcf7a" />
  </group>
);

const MiniShop: React.FC<{position: V3}> = ({position}) => (
  <group position={position}>
    <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.2, 1.7, 1.6]} />
      <Toon color="#f2d9a6" />
      <Ink t={0.02} />
    </mesh>
    <mesh position={[0, 0.6, 0.81]}>
      <planeGeometry args={[1.6, 1.0]} />
      <Emit color="#fff1cf" />
    </mesh>
    {Array.from({length: 4}).map((_, r) =>
      Array.from({length: 6}).map((__, c) => (
        <mesh key={`${r}${c}`} position={[-0.65 + c * 0.26, 0.25 + r * 0.22, 0.82]}>
          <planeGeometry args={[0.18, 0.16]} />
          <Emit color={['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#f783ac', '#9775fa'][(r + c) % 6]} />
        </mesh>
      )),
    )}
    <group position={[0, 1.3, 1.05]} rotation={[0.45, 0, 0]}>
      {Array.from({length: 6}).map((_, i) => (
        <mesh key={i} position={[-0.92 + i * 0.37, 0, 0]}>
          <boxGeometry args={[0.37, 0.03, 0.5]} />
          <Toon color={i % 2 ? '#ffffff' : '#20b486'} />
        </mesh>
      ))}
    </group>
    <NeonCross position={[0, 2.1, 0.5]} scale={0.6} />
    <Glow position={[0, 0.7, 1.4]} color="#ffd9a0" size={3} opacity={0.35} />
    <pointLight position={[0, 1, 1.6]} intensity={3} distance={4} color="#ffe2b0" />
  </group>
);

/** Cute medicine box with a face. */
export const BoxBuddy: React.FC<{position?: V3; rotation?: V3; scale?: number; color?: string; f: number}> = ({
  position,
  rotation,
  scale = 1,
  color = '#4dabf7',
  f,
}) => {
  const blink = (f + 13) % 80 < 4 ? 0.15 : 1;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.75, 0.4]} />
        <Toon color={color} />
        <Ink t={0.02} />
      </mesh>
      <mesh position={[0, 0.2, 0.201]}>
        <planeGeometry args={[0.56, 0.18]} />
        <Toon color="#ffffff" />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <mesh key={x} position={[x, -0.02, 0.21]} scale={[1, blink, 0.3]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color="#1d1238" />
        </mesh>
      ))}
      <mesh position={[0, -0.15, 0.205]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.06, 0.014, 6, 12, Math.PI]} />
        <meshBasicMaterial color="#1d1238" />
      </mesh>
    </group>
  );
};

const Truck: React.FC<{f: number; moving: boolean}> = ({f, moving}) => {
  const spin = moving ? f * 0.4 : 0;
  const bump = moving ? Math.abs(Math.sin(f * 0.5)) * 0.03 : 0;
  return (
    <group>
      <group position={[0, bump, 0]}>
        {/* cargo */}
        <mesh position={[-0.35, 0.75, 0]} castShadow>
          <boxGeometry args={[1.4, 0.9, 0.9]} />
          <Toon color="#ffffff" />
          <Ink t={0.018} />
        </mesh>
        <mesh position={[-0.35, 0.75, 0.452]}>
          <planeGeometry args={[0.36, 0.1]} />
          <Emit color="#20c997" />
        </mesh>
        <mesh position={[-0.35, 0.75, 0.452]}>
          <planeGeometry args={[0.1, 0.36]} />
          <Emit color="#20c997" />
        </mesh>
        {/* cab */}
        <mesh position={[0.62, 0.6, 0]} castShadow>
          <boxGeometry args={[0.55, 0.65, 0.86]} />
          <Toon color="#ff6b6b" />
          <Ink t={0.018} />
        </mesh>
        <mesh position={[0.9, 0.72, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 0.28]} />
          <Emit color="#bfe9ff" />
        </mesh>
        <Glow position={[0.92, 0.42, 0.3]} color="#fff3b0" size={0.5} />
        <Glow position={[0.92, 0.42, -0.3]} color="#fff3b0" size={0.5} />
      </group>
      {[-0.7, 0.05, 0.62].map((x) =>
        [-0.46, 0.46].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.18, z]} rotation={[Math.PI / 2, spin, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 14]} />
            <Toon color="#2a2148" />
          </mesh>
        )),
      )}
    </group>
  );
};

const ROAD: V3[] = [
  [-6.5, 0, -1.2],
  [-4, 0, 0.6],
  [-1.2, 0, 1.2],
  [1, 0, 0.2],
  [3.5, 0, -0.8],
  [6.4, 0, 0.4],
];

const RoadRibbon: React.FC<{curve: THREE.CatmullRomCurve3}> = ({curve}) => {
  const geo = useMemo(() => {
    const n = 120;
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= n; i++) {
      const p = curve.getPointAt(i / n);
      const tan = curve.getTangentAt(i / n);
      const side = new THREE.Vector3(-tan.z, 0, tan.x).normalize().multiplyScalar(0.7);
      pos.push(p.x + side.x, 0.02, p.z + side.z, p.x - side.x, 0.02, p.z - side.z);
      if (i < n) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, [curve]);
  const dashes = useMemo(() => Array.from({length: 26}).map((_, i) => curve.getPointAt((i + 0.5) / 26)), [curve]);
  return (
    <group>
      <mesh geometry={geo} receiveShadow>
        <meshToonMaterial color="#3b3363" side={THREE.DoubleSide} />
      </mesh>
      {dashes.map((p, i) => (
        <mesh key={i} position={[p.x, 0.03, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 8]} />
          <Emit color="#ffe08a" />
        </mesh>
      ))}
    </group>
  );
};

export const JourneyScene: React.FC = () => {
  const f = useCurrentFrame();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(ROAD.map((p) => new THREE.Vector3(...p))), []);
  // truck progress along the road: factory → godown (pause) → shop
  const leg1 = prog(f, 55, 130);
  const leg2 = prog(f, 148, 205);
  const u = lerp(0.04, 0.47, leg1) + (0.95 - 0.47) * leg2;
  const p = curve.getPointAt(u);
  const tan = curve.getTangentAt(u);
  const heading = Math.atan2(-tan.z, tan.x);
  const moving = (f > 55 && f < 130) || (f > 148 && f < 205);

  const camT: V3 = [p.x, 1.5, p.z - 1];
  const camP: V3 = [p.x + 0.5, 3.0, p.z + 8.5];
  const intro = prog(f, 0, 35);
  const camPos = lerp3([-6, 7.5, 12], camP, intro);

  return (
    <Stage bg="#2a1f55">
      <Cam position={camPos} target={lerp3([-5.5, 0.8, -1], camT, intro)} fov={46} />
      <Sky
        stops={[
          [0, '#1b1446'],
          [0.4, '#4b2f86'],
          [0.58, '#c4648e'],
          [0.68, '#ffb36b'],
          [1, '#3a2a6e'],
        ]}
      />
      <fog attach="fog" args={['#5b3d8a', 18, 50]} />
      <hemisphereLight args={['#ffc9a8', '#4a3a80', 1.0]} />
      <directionalLight position={[8, 10, 6]} intensity={1.3} color="#ffd6b0" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />

      {/* grassy diorama ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <Toon color="#5aa36f" />
      </mesh>
      <RoadRibbon curve={curve} />
      {/* distant hills + skyline */}
      {[[-12, -14, 6], [-2, -16, 8], [9, -15, 7], [16, -12, 5]].map(([x, z, r], i) => (
        <mesh key={i} position={[x, -r * 0.35, z]} scale={[1.6, 1, 1]}>
          <sphereGeometry args={[r, 24, 16]} />
          <Toon color={i % 2 ? '#3f6f78' : '#4a5f8f'} />
        </mesh>
      ))}
      {Array.from({length: 14}).map((_, i) => {
        const h = 2 + rand(i + 40) * 4;
        const x = -16 + i * 2.5;
        return (
          <group key={i} position={[x, 0, -11 - rand(i) * 2]}>
            <mesh position={[0, h / 2, 0]}>
              <boxGeometry args={[1.8, h, 1]} />
              <Toon color="#3a2d6e" />
            </mesh>
            {Array.from({length: Math.floor(h / 0.7)}).map((__, k) =>
              rand(i * 9 + k) > 0.4 ? (
                <mesh key={k} position={[(rand(i + k) - 0.5) * 1.2, 0.5 + k * 0.7, 0.51]}>
                  <planeGeometry args={[0.3, 0.3]} />
                  <Emit color="#ffcf7a" />
                </mesh>
              ) : null,
            )}
          </group>
        );
      })}
      {/* flowers in the grass */}
      {Array.from({length: 40}).map((_, i) => (
        <mesh key={i} position={[(rand(i * 3) - 0.5) * 22, 0.06, 1.5 + rand(i * 7) * 8]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <Toon color={['#ff8fab', '#ffd43b', '#ffffff', '#b197fc'][i % 4]} />
        </mesh>
      ))}

      <Factory position={[-6.6, 0, -3.4]} f={f} />
      <Godown position={[-0.6, 0, -1.4]} />
      <MiniShop position={[6.3, 0, -1.9]} />

      {[[-8.5, 0, 1], [-3, 0, -3.5], [2.5, 0, -3], [4.2, 0, 2.2], [-3.5, 0, 3], [8.8, 0, 1.8], [0.8, 0, 3.4], [-9, 0, -3]].map((q, i) => (
        <Tree key={i} position={q as V3} s={0.8 + rand(i) * 0.5} />
      ))}
      <StringLights from={[4.5, 2.4, -1]} to={[8.2, 2.4, -1]} sag={0.3} count={8} />

      {/* labels */}
      <group position={[lerp(-6.6, p.x, 0.75), 3.4, lerp(-3, p.z, 0.5)]} scale={pop(f, 72) * (1 - prog(f, 132, 140))}>
        <TextPlane text="COMPANY" width={2.6} height={0.7} bg="#ffffff" color="#1d1238" font={0.55} border="#1d1238" />
      </group>
      <group position={[lerp(-0.6, p.x, 0.75), 3.1, lerp(-1, p.z, 0.5)]} scale={pop(f, 138) * (1 - prog(f, 196, 204))}>
        <TextPlane text="DISTRIBUTOR" width={2.8} height={0.62} bg="#ffd23f" color="#1d1238" font={0.46} border="#1d1238" />
      </group>
      <group position={[lerp(6.3, p.x, 0.75), 3.2, lerp(-1.5, p.z, 0.5)]} scale={pop(f, 202)}>
        <TextPlane text="CHEMIST" width={2.4} height={0.7} bg="#2ee59d" color="#1d1238" font={0.55} border="#1d1238" />
      </group>

      <group position={[p.x, 0, p.z]} rotation={[0, heading, 0]}>
        <Truck f={f} moving={moving} />
        <BoxBuddy position={[-0.35, 1.45, 0]} rotation={[0, Math.PI / 2 - 0.3, 0]} scale={0.6} f={f} />
      </group>
    </Stage>
  );
};

// =====================================================================
// Scene 3 – ₹100 split into shares
// =====================================================================

export const NOTE_W = 1.5;
export const NOTE_H = 3.2;
// bottom → top share of the note
const SHARES = [
  {key: 'company', label: 'COMPANY (BAAKI)', share: 0.58, color: '#8ab4ff', at: 330},
  {key: 'gst', label: 'GST 5–12%', share: 0.12, color: '#ffb84d', at: 95},
  {key: 'dist', label: 'DISTRIBUTOR ~10%', share: 0.1, color: '#ffd23f', at: 200},
  {key: 'chem', label: 'CHEMIST ~20%', share: 0.2, color: '#2ee59d', at: 275},
];

export const noteTexture = () =>
  canvasTexture(384, 820, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#c9b6f2');
    grd.addColorStop(0.5, '#e4d8ff');
    grd.addColorStop(1, '#b7a2ea');
    g.fillStyle = grd;
    roundRect(g, 0, 0, w, h, 26);
    g.fill();
    g.strokeStyle = '#6d55b8';
    g.lineWidth = 10;
    roundRect(g, 16, 16, w - 32, h - 32, 18);
    g.stroke();
    // guilloche-ish rings
    g.strokeStyle = 'rgba(109,85,184,0.35)';
    g.lineWidth = 3;
    for (let i = 0; i < 9; i++) {
      g.beginPath();
      g.arc(w / 2, h * 0.68, 40 + i * 12, 0, Math.PI * 2);
      g.stroke();
    }
    g.save();
    g.translate(w / 2, h * 0.3);
    g.rotate(Math.PI / 2);
    g.fillStyle = '#3d2a85';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `800 150px ${FONT}`;
    g.fillText('₹100', 0, 0);
    g.restore();
    g.fillStyle = '#3d2a85';
    g.font = `800 64px ${FONT}`;
    g.textAlign = 'center';
    g.fillText('100', w / 2, h * 0.9);
  });

export const NoteSlab: React.FC<{tex: THREE.Texture; v0: number; v1: number}> = ({tex, v0, v1}) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(NOTE_W, NOTE_H * (v1 - v0));
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) === 0 ? v0 : v1);
    uv.needsUpdate = true;
    return g;
  }, [v0, v1]);
  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.01]} scale={[1.03, 1.06, 1]} geometry={geo}>
        <meshBasicMaterial color="#1d1238" />
      </mesh>
    </group>
  );
};

export const SplitScene: React.FC = () => {
  const f = useCurrentFrame();
  const tex = useMemo(noteTexture, []);
  const appear = pop(f, 4, 20);
  const split = prog(f, 62, 92);
  const floatY = Math.sin(f * 0.06) * 0.05;
  const active = [...SHARES].reverse().find((s) => f >= s.at)?.key;
  const chemHappy = f >= 275;

  let acc = 0;
  return (
    <Stage>
      <Cam position={lerp3([0.3, 2.5, 9.2], [0.45, 2.45, 8.4], prog(f, 0, 420))} target={[0.45, 2.0, 0]} fov={44} />
      <color attach="background" args={['#2a1f55']} />
      <hemisphereLight args={['#fff3dc', '#5a4a90', 1.1]} />
      <directionalLight position={[3, 6, 5]} intensity={1.0} castShadow shadow-mapSize={[1024, 1024]} />
      <ShopInterior />
      <mesh position={[0, 1.8, 0.4]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#1b1340" transparent opacity={0.35} />
      </mesh>

      {/* the note */}
      <group position={[-0.5, 2.55 + floatY, 1.2]} scale={appear * 0.84} rotation={[0, Math.sin(f * 0.04) * 0.12 * (1 - split), 0]}>
        {SHARES.map((s, i) => {
          const v0 = acc;
          acc += s.share;
          const v1 = acc;
          const yMid = (v0 + v1) / 2 - 0.5;
          const isOn = active === s.key;
          const gap = split * (i - 1.5) * 0.28;
          const x = split * (isOn ? 0.15 : 0);
          const sc = isOn ? 1 + 0.08 * pop(f, s.at, 12) : 1;
          return (
            <group key={s.key} position={[x, yMid * NOTE_H + gap, isOn ? 0.25 : 0]} scale={sc}>
              <NoteSlab tex={tex} v0={v0} v1={v1} />
              {isOn && <Glow color={s.color} size={2.6} opacity={0.45} position={[0, 0, -0.1]} />}
              {/* label to the right */}
              <group position={[NOTE_W / 2 + 0.85, 0, 0.05]} scale={pop(f, s.at - 4, 12) * split}>
                <TextPlane text={s.label} width={1.55} height={0.32} bg={s.color} color="#1d1238" font={0.5} border="#1d1238" />
              </group>
            </group>
          );
        })}
      </group>

      <Character
        {...CHEMIST}
        position={[1.45, 0, -1.7]}
        rotationY={-0.45}
        mood={chemHappy ? 'happy' : 'neutral'}
        eyeLook={[0.4, 1]}
        armL={{z: chemHappy ? 2.4 + Math.sin(f * 0.3) * 0.25 : 0.3}}
        jump={chemHappy ? Math.abs(Math.sin((f - 275) * 0.25)) * 0.12 * (f < 330 ? 1 : 0) : 0}
      />
      <MedBox position={[2.2, 1.35, -0.9]} color="#ff6b6b" outline />
    </Stage>
  );
};
