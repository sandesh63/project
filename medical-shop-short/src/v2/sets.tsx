import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {
  ArchWindow,
  Beam,
  Bulbs,
  Cel,
  Chhatri,
  Diya,
  Glow,
  Haveli,
  Lantern,
  Line,
  Lit,
  NightSky,
  Pillar,
  Rangoli,
  Skyline,
  StoneGround,
  plasterTex,
  V3,
  INK,
} from './kit';
import {Shelf, TextPlane, MedBox} from '../three/props';
import {canvasTexture} from '../three/util';

/** Standard night lighting: warm hard key + purple fill → orange/purple contrast. */
export const NightLights: React.FC<{dir?: V3; keyColor?: string; keyI?: number; fill?: number}> = ({
  dir: k = [6, 9, 7],
  keyColor = '#ffc68f',
  keyI = 2.2,
  fill = 1.0,
}) => (
  <>
    <hemisphereLight args={['#7d6bff', '#2b1846', fill]} />
    <directionalLight
      position={k}
      intensity={keyI}
      color={keyColor}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-camera-left={-14}
      shadow-camera-right={14}
      shadow-camera-top={14}
      shadow-camera-bottom={-6}
      shadow-camera-far={40}
    />
  </>
);

// ---------------------------------------------------------------------
// Medical shop interior (behind an open front at z = 0)
// ---------------------------------------------------------------------
const SW = 5.2;
const SH = 2.66;
const SD = 3.6;

export const ShopRoom: React.FC<{dim?: boolean}> = ({dim}) => {
  const wall = useMemo(() => plasterTex(dim ? '#5b4a96' : '#bfe6d8', 2, 1), [dim]);
  const floor = useMemo(
    () =>
      canvasTexture(
        128,
        128,
        (g, w, h) => {
          g.fillStyle = '#efe4d0';
          g.fillRect(0, 0, w, h);
          g.fillStyle = '#b5523b';
          g.fillRect(0, 0, w / 2, h / 2);
          g.fillRect(w / 2, h / 2, w / 2, h / 2);
        },
        [8, 6],
      ),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -SD / 2]} receiveShadow>
        <planeGeometry args={[SW, SD]} />
        <Cel color={dim ? '#9d8fd0' : '#ffffff'} map={floor} />
      </mesh>
      <mesh position={[0, SH / 2, -SD]} receiveShadow>
        <planeGeometry args={[SW, SH]} />
        <Cel color="#ffffff" map={wall} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * SW) / 2, SH / 2, -SD / 2]} rotation={[0, (-s * Math.PI) / 2, 0]} receiveShadow>
          <planeGeometry args={[SD, SH]} />
          <Cel color="#ffffff" map={wall} />
        </mesh>
      ))}
      <mesh position={[0, SH, -SD / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SW, SD]} />
        <Cel color="#8a6a8f" />
      </mesh>
      {/* carved wooden shelving */}
      <Shelf width={4.6} height={2.1} rows={5} position={[0, 0.2, -SD + 0.3]} seed={2} wood="#8b4f2c" />
      <Shelf width={2.6} height={2.0} rows={5} position={[-SW / 2 + 0.28, 0.2, -1.9]} rotation={[0, Math.PI / 2, 0]} seed={5} wood="#8b4f2c" />
      <Shelf width={2.6} height={2.0} rows={5} position={[SW / 2 - 0.28, 0.2, -1.9]} rotation={[0, -Math.PI / 2, 0]} seed={9} wood="#8b4f2c" />
      {/* scalloped wooden pelmet above the back shelf */}
      {Array.from({length: 9}).map((_, i) => (
        <mesh key={i} position={[-2.2 + i * 0.55, 2.42, -SD + 0.35]} rotation={[0, 0, Math.PI]}>
          <circleGeometry args={[0.28, 16, 0, Math.PI]} />
          <Cel color="#8b4f2c" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* glass counter */}
      <group position={[0, 0, -1.05]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.9, 0.7]} />
          <Cel color="#9a5a34" />
          <Line />
        </mesh>
        {Array.from({length: 4}).map((_, i) => (
          <mesh key={i} position={[-1.27 + i * 0.85, 0.45, 0.352]}>
            <planeGeometry args={[0.7, 0.6]} />
            <Cel color="#7a4325" />
          </mesh>
        ))}
        <mesh position={[0, 1.07, 0]}>
          <boxGeometry args={[3.4, 0.34, 0.7]} />
          <meshPhysicalMaterial color="#d6f3ff" transparent opacity={0.25} roughness={0.05} />
          <Line />
        </mesh>
        {Array.from({length: 8}).map((_, i) => (
          <MedBox key={i} size={[0.28, 0.16, 0.36]} color={['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#3bc9db'][i]} position={[-1.4 + i * 0.4, 0.99, 0]} />
        ))}
        {/* cash register + ledger */}
        <mesh position={[1.25, 1.38, -0.05]} castShadow>
          <boxGeometry args={[0.5, 0.28, 0.4]} />
          <Cel color="#4b4e6d" />
          <Line />
        </mesh>
      </group>
      {/* light fixtures */}
      <mesh position={[0, SH - 0.08, -1.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
        <Lit color="#f4fbff" />
      </mesh>
      <Glow position={[0, SH - 0.1, -1.6]} color="#e9f7ff" size={1.4} opacity={0.3} />
      <pointLight position={[0, SH - 0.4, -1.4]} intensity={dim ? 2 : 5} distance={6} color="#fff1d6" castShadow={false} />
    </group>
  );
};

/** Haveli whose ground floor is the medical shop. */
export const ShopHaveli: React.FC<{dim?: boolean}> = ({dim}) => {
  const S = 1.4; // architecture scale vs characters
  return (
    <group>
      {/* upper floors */}
      <group scale={S}>
        <Haveli position={[0, 0, 0]} w={SW / S + 0.4} floors={3} color="#e9a07a" trim="#f7e6c8" dome="#f3b55f" seed={4} groundOpen />
      </group>
      {/* ground floor frame: pillars + cusped arch frieze */}
      {[-SW / 2 - 0.15, SW / 2 + 0.15].map((x) => (
        <Pillar key={x} position={[x, 0, 0.12]} h={SH} r={0.13} color="#f7e6c8" accent="#d79a4e" />
      ))}
      <mesh position={[0, SH + 0.05, 0.05]} castShadow>
        <boxGeometry args={[SW + 0.7, 0.2, 0.4]} />
        <Cel color="#f7e6c8" />
        <Line />
      </mesh>
      {/* side walls of ground floor */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (SW / 2 + 0.35), SH / 2, -SD / 2]} castShadow>
          <boxGeometry args={[0.3, SH, SD]} />
          <Cel color="#e9a07a" />
        </mesh>
      ))}
      {/* signboard */}
      <group position={[0, SH + 0.62, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[SW - 0.2, 0.78, 0.1]} />
          <Cel color="#0f7a5c" />
          <Line />
        </mesh>
        <TextPlane text="SEHAT MEDICAL" width={SW - 0.6} height={0.56} position={[0, 0, 0.06]} color="#fff6d6" font={0.62} glow />
        <Glow position={[0, 0, 0.4]} color="#59ffbf" size={4} opacity={0.15} />
      </group>
      {/* neon cross */}
      <group position={[SW / 2 + 0.5, SH + 0.6, 0.5]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <Cel color="#181433" />
          <Line />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.58, 0.17, 0.03]} />
          <Lit color="#2bff9a" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.17, 0.58, 0.03]} />
          <Lit color="#2bff9a" />
        </mesh>
        <Glow position={[0, 0, 0.2]} color="#2bff9a" size={2.4} opacity={0.75} />
      </group>
      {/* striped awning */}
      <group position={[0, SH - 0.05, 0.55]} rotation={[0.5, 0, 0]}>
        {Array.from({length: 10}).map((_, i) => (
          <mesh key={i} position={[-SW / 2 + 0.26 + i * ((SW - 0.52) / 9), 0, 0]} castShadow>
            <boxGeometry args={[(SW - 0.2) / 10, 0.03, 0.75]} />
            <Cel color={i % 2 ? '#fff4e0' : '#e8505b'} />
          </mesh>
        ))}
      </group>
      {/* step */}
      <mesh position={[0, 0.09, 0.4]} receiveShadow castShadow>
        <boxGeometry args={[SW + 0.6, 0.18, 0.8]} />
        <Cel color="#d8c7a8" />
        <Line />
      </mesh>
      <ShopRoom dim={dim} />
    </group>
  );
};

/** The full market street around the shop. */
export const MarketStreet: React.FC<{dim?: boolean}> = ({dim}) => {
  const f = useCurrentFrame();
  return (
    <group>
      <NightSky moon={[-22, 30, -70]} />
      <fog attach="fog" args={['#3a2a6e', 18, 60]} />
      <NightLights />
      <StoneGround position={[0, 0, 4]} size={[70, 40]} base="#8a78b8" line="#5f4f8f" rep={[24, 14]} />
      <Skyline z={-34} />

      <ShopHaveli dim={dim} />
      <group scale={1.4}>
        <Haveli position={[-4.3, 0, -0.3]} w={3.3} floors={4} color="#7aa7e0" trim="#f4e6cf" dome="#f0c36b" seed={9} />
        <Haveli position={[4.3, 0, -0.3]} w={3.3} floors={3} color="#e57fa0" trim="#f8e7cf" dome="#f3b55f" seed={13} />
        <Haveli position={[-7.9, 0, -1]} w={3.6} floors={3} color="#e8c070" trim="#fff1d9" dome="#e98b5b" seed={17} />
        <Haveli position={[7.9, 0, -1]} w={3.6} floors={4} color="#9b86d6" trim="#f4e6cf" dome="#f0c36b" seed={21} />
      </group>
      {/* ground floor stalls of neighbours */}
      {[-6, 6].map((x, i) => (
        <group key={x} position={[x, 0, 0.1]}>
          <ArchWindow position={[0, 0, 0.02]} w={1.6} h={2.2} frame="#f4e6cf" fill={i ? '#ffd28a' : '#ffbf73'} lit />
        </group>
      ))}

      {/* ordinary street lamps (no festive decorations) */}
      {[-4.4, 4.4].map((x) => (
        <group key={x} position={[x, 0, 2.4]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 4.4, 10]} />
            <Cel color="#2b2350" />
            <Line />
          </mesh>
          <mesh position={[x > 0 ? -0.35 : 0.35, 4.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
            <Cel color="#2b2350" />
          </mesh>
          <mesh position={[x > 0 ? -0.7 : 0.7, 4.25, 0]}>
            <sphereGeometry args={[0.16, 14, 12]} />
            <Lit color="#ffe6b8" />
          </mesh>
          <Glow position={[x > 0 ? -0.7 : 0.7, 4.25, 0]} color="#ffd59a" size={2.2} opacity={0.6} />
          <pointLight position={[x > 0 ? -0.7 : 0.7, 4.0, 0.2]} intensity={5} distance={7} color="#ffd59a" />
        </group>
      ))}
      <pointLight position={[0, 1.2, 1.6]} intensity={3} distance={5} color="#ffd9a8" />
      <pointLight position={[0, 1.8, 0.4]} intensity={8} distance={6} color="#ffe2b0" />

      {/* floating embers / dust */}
      {Array.from({length: 26}).map((_, i) => {
        const x = ((i * 1.73) % 12) - 6;
        const y = 0.6 + ((i * 0.91 + f * 0.006 * (1 + (i % 3))) % 6);
        const z = 0.6 + ((i * 0.67) % 6);
        return <Glow key={i} position={[x + Math.sin(f * 0.02 + i) * 0.25, y, z]} color="#ffd79a" size={0.14} opacity={0.8} />;
      })}
    </group>
  );
};

// ---------------------------------------------------------------------
// Heritage / government building with reflecting pool
// ---------------------------------------------------------------------
const Lotus: React.FC<{position: V3; s?: number}> = ({position, s = 1}) => (
  <group position={position} scale={s}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.45, 20, 0.3, Math.PI * 2 - 0.5]} />
      <Cel color="#2f8a5a" side={THREE.DoubleSide} />
    </mesh>
    {Array.from({length: 7}).map((_, i) => (
      <mesh key={i} position={[0, 0.12, 0]} rotation={[0.5, (i / 7) * Math.PI * 2, 0]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <Cel color="#d27ad8" />
      </mesh>
    ))}
  </group>
);

const Temple: React.FC = () => {
  const wall = useMemo(() => plasterTex('#f1eaf7', 4, 2), []);
  return (
    <>
      <group position={[0, 0, -4]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.15 + i * 0.3, 1.9 - i * 0.35]} receiveShadow castShadow>
            <boxGeometry args={[10 - i * 0.6, 0.3, 2.2]} />
            <Cel color="#efe8f7" />
            <Line />
          </mesh>
        ))}
        <mesh position={[0, 2.4, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[9, 3.6, 3.2]} />
          <Cel color="#ffffff" map={wall} />
          <Line />
        </mesh>
        {/* arcade of cusped arches with warm interior */}
        {[-3, -1.5, 0, 1.5, 3].map((x) => (
          <ArchWindow key={x} position={[x, 0.9, 1.01]} w={1.0} h={2.1} frame="#f4eefb" fill="#e6b276" lit />
        ))}
        {[-3.75, -2.25, -0.75, 0.75, 2.25, 3.75].map((x) => (
          <Pillar key={x} position={[x, 0.9, 1.25]} h={2.3} r={0.1} color="#f7f2fc" accent="#d8c8ef" />
        ))}
        <mesh position={[0, 4.3, -0.4]} castShadow>
          <boxGeometry args={[9.4, 0.3, 3.6]} />
          <Cel color="#f4eefb" />
          <Line />
        </mesh>
        {/* main shikhara spire */}
        <group position={[0, 4.45, -0.8]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, 0.5 + i * 0.75, 0]} castShadow>
              <cylinderGeometry args={[1.5 - i * 0.28, 1.65 - i * 0.28, 0.75, 8]} />
              <Cel color="#f8f4fc" />
              <Line t={30} />
            </mesh>
          ))}
          <mesh position={[0, 4.4, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 12]} />
            <Cel color="#f8f4fc" />
            <Line t={50} />
          </mesh>
          <mesh position={[0, 5.0, 0]}>
            <coneGeometry args={[0.12, 0.6, 8]} />
            <Cel color="#e0a030" />
            <Line t={50} />
          </mesh>
          {/* minor spires */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 1.9, 0, 0.4]}>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position={[0, 0.35 + i * 0.5, 0]} castShadow>
                  <cylinderGeometry args={[0.7 - i * 0.18, 0.78 - i * 0.18, 0.5, 8]} />
                  <Cel color="#f8f4fc" />
                  <Line t={30} />
                </mesh>
              ))}
              <mesh position={[0, 1.95, 0]}>
                <coneGeometry args={[0.07, 0.4, 8]} />
                <Cel color="#e0a030" />
              </mesh>
            </group>
          ))}
        </group>
        <Chhatri position={[-4.2, 4.45, 0.6]} s={1.1} color="#f7f2fc" dome="#f8f4fc" />
        <Chhatri position={[4.2, 4.45, 0.6]} s={1.1} color="#f7f2fc" dome="#f8f4fc" />
        {/* side pavilions */}
        {[-6.8, 6.8].map((x) => (
          <Chhatri key={x} position={[x, 0, 1]} s={2.2} color="#f7f2fc" dome="#f8f4fc" />
        ))}
      </group>

    </>
  );
};

export const HeritageCourt: React.FC = () => {
  const f = useCurrentFrame();
  const water = useMemo(
    () =>
      canvasTexture(
        256,
        256,
        (g, w, h) => {
          const grd = g.createLinearGradient(0, 0, 0, h);
          grd.addColorStop(0, '#5b4aa8');
          grd.addColorStop(1, '#2b2368');
          g.fillStyle = grd;
          g.fillRect(0, 0, w, h);
          g.strokeStyle = 'rgba(255,255,255,0.12)';
          g.lineWidth = 3;
          for (let i = 0; i < 18; i++) {
            g.beginPath();
            const y = (i / 18) * h;
            g.moveTo(0, y);
            g.bezierCurveTo(w * 0.3, y - 6, w * 0.6, y + 6, w, y);
            g.stroke();
          }
        },
        [3, 6],
      ),
    [],
  );
  return (
    <group>
      <NightSky
        stops={[
          [0, '#0a0a2c'],
          [0.45, '#1c1a5e'],
          [0.6, '#3e2d84'],
          [0.7, '#7a4a9a'],
          [1, '#1c1a5e'],
        ]}
      />
      <fog attach="fog" args={['#2a2266', 22, 70]} />
      <NightLights dir={[-8, 12, 10]} keyColor="#ffe0c0" keyI={1.6} fill={1.1} />

      {/* plaza + pool */}
      {/* plaza ground with a hole for the pool (x -4.5..4.5, z -1..9) */}
      <StoneGround position={[0, 0, -16]} size={[60, 30]} base="#cbbfe6" line="#9f92c6" rep={[30, 15]} />
      <StoneGround position={[0, 0, 24]} size={[60, 30]} base="#cbbfe6" line="#9f92c6" rep={[30, 15]} />
      <StoneGround position={[-17.25, 0, 4]} size={[25.5, 10]} base="#cbbfe6" line="#9f92c6" rep={[12, 5]} />
      <StoneGround position={[17.25, 0, 4]} size={[25.5, 10]} base="#cbbfe6" line="#9f92c6" rep={[12, 5]} />
      {/* pool rim */}
      {[[0, -1, 9.4, 0.4], [0, 9, 9.4, 0.4]].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.08, z]}>
          <boxGeometry args={[w, 0.16, d]} />
          <Cel color="#e9e2f5" />
          <Line />
        </mesh>
      ))}
      {[-4.7, 4.7].map((x) => (
        <mesh key={x} position={[x, 0.08, 4]}>
          <boxGeometry args={[0.4, 0.16, 10.4]} />
          <Cel color="#e9e2f5" />
          <Line />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 4]}>
        <planeGeometry args={[9, 10]} />
        <meshBasicMaterial map={water} color="#ffffff" transparent opacity={0.72} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, 4]}>
        <planeGeometry args={[12, 30]} />
        <meshBasicMaterial color="#1c1650" />
      </mesh>
      {/* reflection of the temple (flipped silhouette glow) */}
      <Glow position={[0, 0.1, 1.2]} color="#e8dcff" size={6} opacity={0.12} />
      {[
        [-2.8, 0.05, 6.5, 1.3],
        [2.4, 0.05, 7.6, 1.1],
        [-1.2, 0.05, 2.6, 0.9],
        [3.2, 0.05, 3.4, 0.8],
        [-3.5, 0.05, 3.2, 0.7],
        [0.8, 0.05, 5.2, 1],
      ].map(([x, y, z, s], i) => (
        <Lotus key={i} position={[x, y, z]} s={s * 1.4} />
      ))}

      <Temple />
      {/* reflection */}
      <group scale={[1, -1, 1]} position={[0, -0.1, 0]}>
        <Temple />
      </group>
      {/* divine light beam */}
      <Beam position={[0.3, 9, -4.4]} color="#fff6d8" h={24} r={0.35} o={0.22 + 0.04 * Math.sin(f * 0.1)} />
      <Beam position={[0.3, 9, -4.4]} color="#fff6d8" h={24} r={0.9} o={0.07} />
      <Glow position={[0.3, 5.2, -3]} color="#fff3cf" size={5} opacity={0.4} />
      {Array.from({length: 30}).map((_, i) => (
        <Glow key={i} position={[((i * 1.3) % 14) - 7, 1 + ((i * 0.77) % 7), ((i * 0.9) % 8) - 2]} color="#fff0c0" size={0.12} opacity={0.8} />
      ))}
      <pointLight position={[0, 2, 0]} intensity={8} distance={8} color="#ffcf8a" />
    </group>
  );
};

export const _ink = INK;
