// Upgraded journey diorama: detailed delivery truck, pharma factory, distributor godown, chemist shop, road & scenery.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {Stage, Cam} from '../three/Stage';
import {Cel, Glow, Line, Lit, NightSky, plasterTex, Skyline} from '../v2/kit';
import {TextPlane} from '../three/props';
import {canvasTexture, lerp, lerp3, pop, prog, rand, roundRect, FONT} from '../three/util';
import {Hedge, VegKind, SunsetTree, SunsetLawn, Palm} from './veg';

type V3 = [number, number, number];

// ---------------- textures ----------------
const liveryTex = () =>
  canvasTexture(512, 256, (g, w, h) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#0f9d58';
    g.fillRect(0, h * 0.72, w, h * 0.28);
    g.fillStyle = '#e63946';
    g.fillRect(0, h * 0.64, w, h * 0.08);
    // cross badge
    g.fillStyle = '#0f9d58';
    roundRect(g, 26, 40, 120, 120, 18);
    g.fill();
    g.fillStyle = '#ffffff';
    g.fillRect(56, 88, 60, 24);
    g.fillRect(74, 70, 24, 60);
    g.fillStyle = '#1d1238';
    g.font = `800 50px ${FONT}`;
    g.textBaseline = 'middle';
    g.fillText('MEDICAL', 170, 78);
    g.fillText('SUPPLIES', 170, 136);
    g.fillStyle = '#ffffff';
    g.font = `700 30px ${FONT}`;
    g.fillText('24x7 DELIVERY', 30, h * 0.86);
  });

const rearTex = () =>
  canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#ffd23f';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#e63946';
    for (let i = 0; i < 8; i++) {
      g.beginPath();
      g.moveTo(i * 36, 0);
      g.lineTo(i * 36 + 18, 0);
      g.lineTo(i * 36 - 30, 40);
      g.lineTo(i * 36 - 48, 40);
      g.fill();
    }
    g.fillStyle = '#1d1238';
    g.font = `800 40px ${FONT}`;
    g.textAlign = 'center';
    g.fillText('HORN', w / 2, 110);
    g.fillText('OK', w / 2, 155);
    g.fillText('PLEASE', w / 2, 200);
  });

const plateTex = () =>
  canvasTexture(256, 64, (g, w, h) => {
    g.fillStyle = '#fffbe6';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#1d1238';
    g.lineWidth = 5;
    g.strokeRect(2, 2, w - 4, h - 4);
    g.fillStyle = '#1d1238';
    g.font = `800 38px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('MH 12 AB 1234', w / 2, h / 2 + 2);
  });

const signTex = (text: string, bg: string, fg = '#ffffff') =>
  canvasTexture(512, 128, (g, w, h) => {
    g.fillStyle = bg;
    roundRect(g, 0, 0, w, h, 16);
    g.fill();
    g.strokeStyle = '#1d1238';
    g.lineWidth = 8;
    roundRect(g, 4, 4, w - 8, h - 8, 14);
    g.stroke();
    g.fillStyle = fg;
    let fs = 58;
    g.font = `800 ${fs}px ${FONT}`;
    while (g.measureText(text).width > w - 50 && fs > 20) g.font = `800 ${--fs}px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + 3);
  });

const asphaltTex = () =>
  canvasTexture(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = '#3a3552';
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) {
        g.fillStyle = `rgba(255,255,255,${0.02 + rand(i) * 0.04})`;
        g.fillRect(rand(i + 1) * w, rand(i + 2) * h, 3, 3);
      }
    },
    [12, 2],
  );

// ---------------- truck ----------------
const Wheel: React.FC<{position: V3; spin: number}> = ({position, spin}) => (
  <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <group rotation={[0, spin, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.14, 20]} />
        <Cel color="#24202e" />
        <Line t={30} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[0, s * 0.072, 0]}>
          <mesh>
            <cylinderGeometry args={[0.11, 0.11, 0.01, 16]} />
            <Cel color="#c9ccd2" />
          </mesh>
          {[0, 1, 2, 3, 4].map((k) => (
            <mesh key={k} position={[Math.cos((k / 5) * Math.PI * 2) * 0.06, s * 0.006, Math.sin((k / 5) * Math.PI * 2) * 0.06]}>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 6]} />
              <meshBasicMaterial color="#1d1238" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  </group>
);

export const DeliveryTruck: React.FC<{f: number; moving: boolean}> = ({f, moving}) => {
  const livery = useMemo(liveryTex, []);
  const rear = useMemo(rearTex, []);
  const plate = useMemo(plateTex, []);
  const spin = moving ? f * 0.45 : 0;
  const bob = moving ? Math.abs(Math.sin(f * 0.6)) * 0.025 : 0;
  // truck faces +x
  return (
    <group>
      {/* chassis */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.2, 0.12, 0.78]} />
        <Cel color="#2b2738" />
        <Line />
      </mesh>
      <Wheel position={[-0.62, 0.2, 0.42]} spin={spin} />
      <Wheel position={[-0.62, 0.2, -0.42]} spin={spin} />
      <Wheel position={[0.68, 0.2, 0.42]} spin={spin} />
      <Wheel position={[0.68, 0.2, -0.42]} spin={spin} />
      {/* mudguards */}
      {[-0.62, 0.68].map((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, 0.36, s * 0.43]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.1, 16, 1, true, -Math.PI / 2, Math.PI]} />
            <Cel color="#1d1a26" side={THREE.DoubleSide} />
          </mesh>
        )),
      )}
      <group position={[0, bob, 0]}>
        {/* box body with livery */}
        <mesh position={[-0.35, 0.95, 0]} castShadow>
          <boxGeometry args={[1.45, 1.1, 0.86]} />
          <Cel color="#ffffff" />
          <Line />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[-0.35, 0.95, s * 0.432]} rotation={[0, s > 0 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[1.4, 1.04]} />
            <meshBasicMaterial map={livery} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[-1.081, 0.95, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 1.04]} />
          <meshBasicMaterial map={rear} toneMapped={false} />
        </mesh>
        {/* roof rail */}
        <mesh position={[-0.35, 1.52, 0]}>
          <boxGeometry args={[1.48, 0.05, 0.9]} />
          <Cel color="#0f9d58" />
          <Line />
        </mesh>
        {/* cab */}
        <mesh position={[0.68, 0.78, 0]} castShadow>
          <boxGeometry args={[0.62, 0.78, 0.84]} />
          <Cel color="#ffb703" />
          <Line />
        </mesh>
        <mesh position={[0.62, 1.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.12, 0.84]} />
          <Cel color="#ffb703" />
          <Line />
        </mesh>
        {/* windshield + side windows */}
        <mesh position={[0.995, 0.92, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.74, 0.34]} />
          <Lit color="#a9dcff" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.72, 0.92, s * 0.421]} rotation={[0, s > 0 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[0.36, 0.3]} />
            <Lit color="#9fd3f5" />
          </mesh>
        ))}
        {/* grille, bumper, headlights, plate */}
        <mesh position={[0.995, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.5, 0.16]} />
          <meshBasicMaterial color="#2b2738" />
        </mesh>
        {[0.56, 0.62, 0.68].map((y) => (
          <mesh key={y} position={[0.998, y, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.46, 0.015]} />
            <meshBasicMaterial color="#9aa1ad" />
          </mesh>
        ))}
        <mesh position={[1.02, 0.42, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.88]} />
          <Cel color="#c9ccd2" />
          <Line />
        </mesh>
        <mesh position={[1.053, 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.36, 0.09]} />
          <meshBasicMaterial map={plate} toneMapped={false} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[1.0, 0.62, s * 0.33]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
              <Lit color="#fff6c8" />
            </mesh>
            <Glow position={[0.08, 0, 0]} color="#fff2b0" size={0.7} opacity={0.8} />
          </group>
        ))}
        {/* mirrors */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.95, 1.0, s * 0.5]}>
            <mesh position={[0, 0, -s * 0.03]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.1]} />
              <meshBasicMaterial color="#1d1238" />
            </mesh>
            <mesh position={[0, 0, s * 0.03]}>
              <boxGeometry args={[0.05, 0.14, 0.04]} />
              <Cel color="#2b2738" />
            </mesh>
          </group>
        ))}
        {/* tail lights */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[-1.085, 0.48, s * 0.34]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.1, 0.06]} />
            <Lit color="#ff4d4d" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ---------------- buildings ----------------
const Factory: React.FC<{position: V3; f: number}> = ({position, f}) => {
  const wall = useMemo(() => plasterTex('#e7e3f2', 3, 2), []);
  const sign = useMemo(() => signTex('SEHAT PHARMA LTD', '#1d6fd8'), []);
  return (
    <group position={position}>
      {/* boundary wall */}
      {/* boundary wall with a gate opening at the driveway (x = +1.2) */}
      <mesh position={[-0.75, 0.25, 1.6]}>
        <boxGeometry args={[2.9, 0.5, 0.12]} />
        <Cel color="#d9cbb3" />
        <Line />
      </mesh>
      <mesh position={[2.0, 0.25, 1.6]}>
        <boxGeometry args={[0.4, 0.5, 0.12]} />
        <Cel color="#d9cbb3" />
        <Line />
      </mesh>
      {[0.6, 1.8].map((x) => (
        <mesh key={x} position={[x, 0.35, 1.6]}>
          <boxGeometry args={[0.16, 0.7, 0.16]} />
          <Cel color="#bfae94" />
          <Line />
        </mesh>
      ))}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 2, 2]} />
        <Cel color="#ffffff" map={wall} />
        <Line />
      </mesh>
      {/* saw-tooth roof */}
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <group key={x} position={[x, 2.0, 0]}>
          <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.4, 1, 0.6]}>
            <cylinderGeometry args={[1, 1, 2, 3, 1, false]} />
            <Cel color="#5b7be0" />
            <Line />
          </mesh>
          <mesh position={[0.18, 0.3, 1.01]} rotation={[0, 0, 0.6]}>
            <planeGeometry args={[0.3, 0.4]} />
            <Lit color="#ffe2a0" />
          </mesh>
        </group>
      ))}
      {/* windows grid */}
      {[0.75, 1.45].map((y) =>
        [-1.3, -0.65, 0, 0.65, 1.3].map((x) => (
          <group key={`${x}${y}`} position={[x, y, 1.005]}>
            <mesh>
              <planeGeometry args={[0.42, 0.38]} />
              <Lit color={rand(x * 7 + y) > 0.3 ? '#ffd27a' : '#6b6496'} />
            </mesh>
            <mesh position={[0, 0, 0.003]}>
              <planeGeometry args={[0.03, 0.38]} />
              <meshBasicMaterial color="#3a2d5a" />
            </mesh>
          </group>
        )),
      )}
      {/* loading bay */}
      <mesh position={[1.2, 0.45, 1.01]}>
        <planeGeometry args={[0.9, 0.9]} />
        <Cel color="#8e9bb5" />
      </mesh>
      <mesh position={[1.2, 0.95, 1.2]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.1, 0.04, 0.45]} />
        <Cel color="#e63946" />
        <Line />
      </mesh>
      {/* sign */}
      <mesh position={[-0.35, 2.3, 1.35]}>
        <planeGeometry args={[2.3, 0.55]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* water tank */}
      <group position={[-1.3, 2.6, -0.5]}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.25, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
            <Cel color="#3a2d5a" />
          </mesh>
        ))}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
          <Cel color="#1d1238" />
          <Line />
        </mesh>
      </group>
      {/* chimneys + smoke */}
      {[0.6, 1.2].map((x, ci) => (
        <group key={x} position={[x, 2.5, -0.6]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.17, 1.4, 14]} />
            <Cel color="#c0392b" />
            <Line />
          </mesh>
          {[0.3, -0.2].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.175, 0.175, 0.08, 14]} />
              <Cel color="#ffffff" />
            </mesh>
          ))}
          {Array.from({length: 5}).map((_, i) => {
            const t = ((f * 0.7 + i * 18 + ci * 9) % 90) / 90;
            return (
              <mesh key={i} position={[t * 0.7, 0.8 + t * 2, 0]} scale={0.16 + t * 0.4}>
                <sphereGeometry args={[1, 12, 10]} />
                <meshToonMaterial color="#f3f0fb" transparent opacity={0.85 * (1 - t)} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
};

const Forklift: React.FC<{position: V3; rotY?: number}> = ({position, rotY = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.35, 0]} castShadow>
      <boxGeometry args={[0.6, 0.4, 0.45]} />
      <Cel color="#ffb703" />
      <Line />
    </mesh>
    <mesh position={[-0.1, 0.75, 0]}>
      <boxGeometry args={[0.35, 0.04, 0.42]} />
      <Cel color="#2b2738" />
    </mesh>
    {[-0.18, 0.18].map((z) => (
      <mesh key={z} position={[-0.1, 0.55, z]}>
        <boxGeometry args={[0.03, 0.4, 0.03]} />
        <Cel color="#2b2738" />
      </mesh>
    ))}
    <mesh position={[0.36, 0.6, 0]}>
      <boxGeometry args={[0.04, 0.9, 0.36]} />
      <Cel color="#3a3552" />
      <Line />
    </mesh>
    {[-0.12, 0.12].map((z) => (
      <mesh key={z} position={[0.5, 0.18, z]}>
        <boxGeometry args={[0.3, 0.03, 0.05]} />
        <Cel color="#9aa1ad" />
      </mesh>
    ))}
    {[-0.2, 0.2].map((x) =>
      [-0.24, 0.24].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.13, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 14]} />
          <Cel color="#24202e" />
        </mesh>
      )),
    )}
  </group>
);

const BoxCarton: React.FC<{position: V3; s?: number}> = ({position, s = 0.32}) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[s, s, s]} />
      <Cel color="#c98b52" />
      <Line />
    </mesh>
    <mesh position={[0, s / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[s * 0.22, s]} />
      <Cel color="#e8c393" />
    </mesh>
  </group>
);

const Godown: React.FC<{position: V3}> = ({position}) => {
  const sign = useMemo(() => signTex('GUPTA DISTRIBUTORS', '#ffd23f', '#1d1238'), []);
  const wall = useMemo(() => plasterTex('#f2b880', 2, 1), []);
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.6, 2]} />
        <Cel color="#ffffff" map={wall} />
        <Line />
      </mesh>
      {/* corrugated arched roof */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.5, 1, 1]}>
        <cylinderGeometry args={[1.52, 1.52, 2.05, 28, 1, false, 0, Math.PI]} />
        <Cel color="#9c5b3a" side={THREE.DoubleSide} />
        <Line t={40} />
      </mesh>
      {/* two rolling shutters */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={x} position={[x, 0, 1.005]}>
          <mesh position={[0, 0.55, 0]}>
            <planeGeometry args={[1.0, 1.1]} />
            <Cel color={i ? '#8e9bb5' : '#3a2d5a'} />
          </mesh>
          {i === 1 &&
            Array.from({length: 8}).map((_, k) => (
              <mesh key={k} position={[0, 0.08 + k * 0.135, 0.003]}>
                <planeGeometry args={[1.0, 0.018]} />
                <meshBasicMaterial color="#5e6a85" />
              </mesh>
            ))}
          {i === 0 && <Glow position={[0, 0.5, 0.2]} color="#ffcf7a" size={1.4} opacity={0.4} />}
        </group>
      ))}
      <mesh position={[0, 1.35, 1.02]}>
        <planeGeometry args={[2.4, 0.42]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* cartons + forklift + trolley outside */}
      {[[-1.3, 0.16, 1.4], [-0.95, 0.16, 1.45], [-1.12, 0.48, 1.42], [-1.3, 0.16, 1.78]].map((p, i) => (
        <BoxCarton key={i} position={p as V3} />
      ))}
      <Forklift position={[0.2, 0, 1.6]} rotY={0.4} />
      <pointLight position={[0, 1.5, 1.8]} intensity={2.5} distance={4} color="#ffcf7a" />
    </group>
  );
};

const ChemistShop: React.FC<{position: V3}> = ({position}) => {
  const sign = useMemo(() => signTex('+ MEDICAL', '#0f7a5c'), []);
  const wall = useMemo(() => plasterTex('#e9a07a', 2, 1), []);
  return (
    <group position={position}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 2.0, 1.6]} />
        <Cel color="#ffffff" map={wall} />
        <Line />
      </mesh>
      <mesh position={[0, 2.08, 0]}>
        <boxGeometry args={[2.55, 0.16, 1.75]} />
        <Cel color="#f7e6c8" />
        <Line />
      </mesh>
      {/* lit shop opening with shelves */}
      <mesh position={[0, 0.65, 0.805]}>
        <planeGeometry args={[1.8, 1.1]} />
        <Lit color="#fff1cf" />
      </mesh>
      {Array.from({length: 4}).map((_, r) =>
        Array.from({length: 8}).map((__, c) => (
          <mesh key={`${r}${c}`} position={[-0.75 + c * 0.215, 0.28 + r * 0.24, 0.81]}>
            <planeGeometry args={[0.15, 0.15]} />
            <Lit color={['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#f783ac', '#9775fa', '#ffa94d', '#3bc9db'][(r * 3 + c) % 8]} />
          </mesh>
        )),
      )}
      {/* striped awning */}
      <group position={[0, 1.35, 1.05]} rotation={[0.5, 0, 0]}>
        {Array.from({length: 8}).map((_, i) => (
          <mesh key={i} position={[-1.05 + i * 0.3, 0, 0]}>
            <boxGeometry args={[0.3, 0.03, 0.55]} />
            <Cel color={i % 2 ? '#ffffff' : '#e8505b'} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 1.72, 0.82]}>
        <planeGeometry args={[1.8, 0.42]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      <Glow position={[0, 0.7, 1.4]} color="#ffd9a0" size={3} opacity={0.35} />
      <pointLight position={[0, 1, 1.6]} intensity={2.5} distance={4} color="#ffe2b0" />
    </group>
  );
};

const Tree: React.FC<{position: V3; s?: number; seed?: number}> = ({position, s = 1, seed = 0}) => (
  <group position={position} scale={s}>
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.1, 0.9, 8]} />
      <Cel color="#6b4430" />
      <Line />
    </mesh>
    {[
      [0, 1.1, 0, 0.5],
      [0.25, 1.4, 0.05, 0.36],
      [-0.22, 1.35, -0.05, 0.38],
      [0.02, 1.65, 0, 0.3],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <Cel color={['#3fae6a', '#55c77f', '#2f9a5a', '#4cbb72'][(i + seed) % 4]} />
        <Line t={35} />
      </mesh>
    ))}
  </group>
);

const StreetLight: React.FC<{position: V3}> = ({position}) => (
  <group position={position}>
    <mesh position={[0, 1.2, 0]}>
      <cylinderGeometry args={[0.035, 0.05, 2.4, 8]} />
      <Cel color="#2b2350" />
      <Line />
    </mesh>
    <mesh position={[0.2, 2.38, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
      <Cel color="#2b2350" />
    </mesh>
    <mesh position={[0.4, 2.33, 0]}>
      <sphereGeometry args={[0.08, 10, 8]} />
      <Lit color="#ffe6b8" />
    </mesh>
    <Glow position={[0.4, 2.33, 0]} color="#ffd59a" size={1.2} opacity={0.6} />
  </group>
);

/** Cute medicine box riding on the truck roof. */
const BoxBuddy: React.FC<{position: V3; rotation?: V3; f: number}> = ({position, rotation, f}) => {
  const blink = (f + 13) % 80 < 4 ? 0.15 : 1;
  return (
    <group position={position} rotation={rotation} scale={0.55}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.75, 0.4]} />
        <Cel color="#4dabf7" />
        <Line />
      </mesh>
      <mesh position={[0, 0.2, 0.201]}>
        <planeGeometry args={[0.56, 0.18]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <mesh key={x} position={[x, -0.02, 0.205]} scale={[1, blink, 1]}>
          <circleGeometry args={[0.045, 12]} />
          <meshBasicMaterial color="#1d1238" />
        </mesh>
      ))}
      <mesh position={[0, -0.14, 0.205]} rotation={[0, 0, Math.PI]}>
        <ringGeometry args={[0.045, 0.06, 12, 1, 0, Math.PI]} />
        <meshBasicMaterial color="#1d1238" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------------- road ----------------
const ROAD: V3[] = [
  [-6.5, 0, -1.2],
  [-4, 0, 0.6],
  [-1.2, 0, 1.2],
  [1, 0, 0.2],
  [3.5, 0, -0.8],
  [6.4, 0, 0.4],
];

const Road: React.FC<{curve: THREE.CatmullRomCurve3}> = ({curve}) => {
  const tex = useMemo(asphaltTex, []);
  const ribbon = (half: number, y: number) => {
    const n = 140;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= n; i++) {
      const p = curve.getPointAt(i / n);
      const t = curve.getTangentAt(i / n);
      const sd = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(half);
      pos.push(p.x + sd.x, y, p.z + sd.z, p.x - sd.x, y, p.z - sd.z);
      uv.push(i / n, 0, i / n, 1);
      if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };
  const kerb = useMemo(() => ribbon(0.92, 0.015), [curve]);
  const asphalt = useMemo(() => ribbon(0.8, 0.025), [curve]);
  const dashes = useMemo(() => Array.from({length: 30}).map((_, i) => ({p: curve.getPointAt((i + 0.5) / 30), t: curve.getTangentAt((i + 0.5) / 30)})), [curve]);
  return (
    <group>
      <mesh geometry={kerb} receiveShadow>
        <meshToonMaterial color="#d9d2e6" side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={asphalt} receiveShadow>
        <meshToonMaterial map={tex} color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      {dashes.map(({p, t}, i) => (
        <mesh key={i} position={[p.x, 0.032, p.z]} rotation={[-Math.PI / 2, 0, -Math.atan2(t.z, t.x)]}>
          <planeGeometry args={[0.32, 0.05]} />
          <meshBasicMaterial color="#fff3c4" />
        </mesh>
      ))}
    </group>
  );
};

// ---------------- real-world layout helpers ----------------
const BUILDINGS: {c: [number, number]; half: [number, number]; door: [number, number]}[] = [
  {c: [-6.6, -3.6], half: [2.3, 1.7], door: [-5.4, -2.55]}, // factory loading bay
  {c: [-0.6, -1.6], half: [1.6, 1.2], door: [-0.6, -0.55]}, // godown shutters
  {c: [6.3, -2.0], half: [1.3, 0.9], door: [6.3, -1.15]}, // chemist shop front
];

const roadsideLayout = (road: THREE.CatmullRomCurve3, samples: THREE.Vector3[]) => {
  const distToRoad = (x: number, z: number) => {
    let m = Infinity;
    for (const q of samples) m = Math.min(m, (q.x - x) ** 2 + (q.z - z) ** 2);
    return Math.sqrt(m);
  };
  const inBuilding = (x: number, z: number, pad: number) =>
    BUILDINGS.some((b) => Math.abs(x - b.c[0]) < b.half[0] + pad && Math.abs(z - b.c[1]) < b.half[1] + pad);
  // driveways: from each door straight to the nearest point of the road
  const driveways = BUILDINGS.map((b) => {
    let best = samples[0];
    for (const q of samples) if ((q.x - b.door[0]) ** 2 + (q.z - b.door[1]) ** 2 < (best.x - b.door[0]) ** 2 + (best.z - b.door[1]) ** 2) best = q;
    return {from: b.door, to: [best.x, best.z] as [number, number]};
  });
  const nearDriveway = (x: number, z: number) =>
    driveways.some((d) => {
      const [ax, az] = d.from;
      const [bx, bz] = d.to;
      const dx = bx - ax;
      const dz = bz - az;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
      return Math.hypot(x - (ax + dx * t), z - (az + dz * t)) < 1.3;
    });
  const trees: {pos: [number, number, number]; palm: boolean}[] = [];
  const lights: [number, number, number][] = [];
  const N = 26;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const q = road.getPointAt(t);
    const tg = road.getTangentAt(t);
    let n = new THREE.Vector3(-tg.z, 0, tg.x);
    if (n.z > 0) n = n.negate(); // far side = away from the camera
    const x = q.x + n.x * 2.0;
    const z = q.z + n.z * 2.0;
    if (distToRoad(x, z) > 1.6 && !inBuilding(x, z, 0.5) && !nearDriveway(x, z)) trees.push({pos: [x, 0, z], palm: i % 2 === 0});
    if (i % 4 === 2) {
      const lx = q.x - n.x * 1.15;
      const lz = q.z - n.z * 1.15;
      if (distToRoad(lx, lz) > 1.0 && !nearDriveway(lx, lz)) lights.push([lx, 0, lz]);
    }
  }
  return {trees, lights, driveways};
};

/** concrete driveway from a building door to the road */
const Driveway: React.FC<{from: [number, number]; to: [number, number]}> = ({from, to}) => {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz) + 0.4;
  const yaw = Math.atan2(dx, dz);
  return (
    <group position={[(from[0] + to[0]) / 2, 0.02, (from[1] + to[1]) / 2]} rotation={[0, -yaw + Math.PI, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.1, len]} />
        <meshToonMaterial color="#cfc3d6" />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, len]} />
          <meshBasicMaterial color="#2a1f38" />
        </mesh>
      ))}
    </group>
  );
};

// ---------------- the scene (timing matches the voiceover) ----------------
export const JourneyScene2: React.FC = () => {
  const f = useCurrentFrame();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(ROAD.map((p) => new THREE.Vector3(...p))), []);
  // the visible road continues off both edges of the scene (a real road does not end in the grass)
  const longRoad = useMemo(() => new THREE.CatmullRomCurve3([[-14, 0, -2.8], ...ROAD, [14, 0, 1.9]].map((q) => new THREE.Vector3(...(q as V3)))), []);
  const samples = useMemo(() => longRoad.getSpacedPoints(600), [longRoad]);
  const layout = useMemo(() => roadsideLayout(longRoad, samples), [longRoad, samples]);
  const leg1 = prog(f, 55, 130);
  const leg2 = prog(f, 148, 205);
  const u = lerp(0.04, 0.47, leg1) + (0.95 - 0.47) * leg2;
  const pr = curve.getPointAt(u);
  let best = 0;
  samples.forEach((q, i) => {
    if (q.distanceToSquared(pr) < samples[best].distanceToSquared(pr)) best = i;
  });
  const tl = best / 600;
  const p = longRoad.getPointAt(tl);
  const tan = longRoad.getTangentAt(tl);
  const heading = Math.atan2(-tan.z, tan.x);
  const moving = (f > 55 && f < 130) || (f > 148 && f < 205);
  const intro = prog(f, 0, 35);
  const camT: V3 = [p.x, 1.4, p.z - 1];
  const camP: V3 = [p.x + 0.6, 2.9, p.z + 8.4];
  return (
    <Stage bg="#2a1f55">
      <Cam position={lerp3([-6, 7.5, 12], camP, intro)} target={lerp3([-5.5, 0.8, -1], camT, intro)} fov={46} />
      {/* sunset sky: lavender -> pink -> peach glow at the horizon (user's reference frame) */}
      <NightSky
        stops={[
          [0, '#5d4f9a'],
          [0.38, '#9a7dbf'],
          [0.52, '#d79ab8'],
          [0.6, '#f6b49a'],
          [0.66, '#ffd09a'],
          [1, '#b48aa8'],
        ]}
      />
      <group position={[0, 5, -70]}>
        <mesh>
          <circleGeometry args={[4.5, 40]} />
          <meshBasicMaterial color="#fff0c8" toneMapped={false} fog={false} />
        </mesh>
        <Glow color="#ffd2a0" size={46} opacity={0.55} />
      </group>
      <fog attach="fog" args={['#e8ad9e', 14, 46]} />
      <hemisphereLight args={['#ffd6b8', '#6a5aa8', 1.2]} />
      <directionalLight position={[9, 6, -5]} intensity={1.8} color="#ffc48a" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />
      <Skyline z={-26} color="#9a86c0" />

      {/* painted lawn (reference grassHD recipe) */}
      <SunsetLawn radius={24} repeat={13} />
      <Road curve={longRoad} />
      {layout.driveways.map((d, i) => (
        <Driveway key={i} from={d.from} to={d.to} />
      ))}

      <Factory position={[-6.6, 0, -3.6]} f={f} />
      <Godown position={[-0.6, 0, -1.6]} />
      <ChemistShop position={[6.3, 0, -2.0]} />

      {/* roadside avenue on the far side of the road: palms alternating with shade trees */}
      {layout.trees.map((t, i) =>
        t.palm ? (
          <Palm key={`a${i}`} position={t.pos} h={4.2 + rand(i + 3) * 0.8} lean={0.12 + rand(i + 7) * 0.2} seed={i + 3} />
        ) : (
          <SunsetTree key={`a${i}`} kind="round" position={t.pos} h={2.3 + rand(i + 5) * 0.5} seed={i + 1} />
        ),
      )}
      {/* back row behind the buildings for depth */}
      {(
        [
          ['cone', -10.5, -6.4, 3.4],
          ['round', -4.0, -6.6, 3.0],
          ['cone', 2.6, -6.4, 3.2],
          ['round', 9.8, -5.6, 2.8],
          ['cone', -13, -5, 3.2],
          ['round', 13, -4.2, 3.0],
        ] as [VegKind, number, number, number][]
      ).map(([k, x, z, h], i) => (
        <SunsetTree key={`r${i}`} kind={k} position={[x, 0, z]} h={h} seed={i + 30} />
      ))}
      {[[-8.4, -7.2, 5.2], [-1.2, -7.4, 5.6], [5.6, -7.0, 5.4], [11.6, -6.8, 5.0]].map(([x, z, h], i) => (
        <Palm key={`bp${i}`} position={[x, 0, z]} h={h} seed={i + 40} />
      ))}
      {/* street lights on the near kerb (thin, never hide the truck) */}
      {layout.lights.map((q, i) => (
        <StreetLight key={`l${i}`} position={q} />
      ))}

      {/* labels follow the truck so they stay on screen */}
      <group position={[lerp(-6.6, p.x, 0.75), 3.4, lerp(-3, p.z, 0.5)]} scale={pop(f, 72) * (1 - prog(f, 132, 140))}>
        <TextPlane text="COMPANY" width={2.6} height={0.7} bg="#ffffff" color="#1d1238" font={0.55} border="#1d1238" />
      </group>
      <group position={[lerp(-0.6, p.x, 0.75), 3.1, lerp(-1, p.z, 0.5)]} scale={pop(f, 138) * (1 - prog(f, 196, 204))}>
        <TextPlane text="DISTRIBUTOR" width={2.8} height={0.62} bg="#ffd23f" color="#1d1238" font={0.5} border="#1d1238" />
      </group>
      <group position={[lerp(6.3, p.x, 0.75), 3.2, lerp(-1.5, p.z, 0.5)]} scale={pop(f, 202)}>
        <TextPlane text="CHEMIST" width={2.4} height={0.7} bg="#2ee59d" color="#1d1238" font={0.55} border="#1d1238" />
      </group>

      <group position={[p.x, 0, p.z]} rotation={[0, heading, 0]} scale={0.85}>
        <DeliveryTruck f={f} moving={moving} />
        <BoxBuddy position={[-0.35, 1.78, 0]} rotation={[0, Math.PI / 2 - 0.3, 0]} f={f} />
      </group>
    </Stage>
  );
};

export const _u = {Lit, roundRect};
