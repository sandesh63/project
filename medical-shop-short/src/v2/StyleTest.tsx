import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Cam} from '../three/Stage';
import {MarketStreet, HeritageCourt, ShopRoom, NightLights} from './sets';
import {Pin, MASCOT, CHEMIST, DISTRIBUTOR} from './Pin';
import {TabletStrip} from '../three/props';
import {Glow, Lantern} from './kit';

/** Film look on top: vignette + subtle grain + warm bloom wash. */
const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,4,30,0.55) 100%)'}} />
    <AbsoluteFill
      style={{
        opacity: 0.07,
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
      }}
    />
  </>
);

export const TestStreet: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <Cam position={[0, 1.5, 12.5]} target={[0, 4.2, 0]} fov={52} />
      <MarketStreet />
      <Pin {...MASCOT} position={[-0.9, 0, 2.6]} rotY={0.25} mood="happy" handR={[-0.55, 0.85, 0.35]} holdR={<TabletStrip rotation={[0, 0.3, 0]} />} />
      <Pin {...CHEMIST} position={[0.9, 0, -1.6]} rotY={-0.2} mood="smile" />
      <Pin {...DISTRIBUTOR} position={[3.6, 0, 2.2]} rotY={-0.5} mood="calm" />
    </Stage>
    <Grade />
  </AbsoluteFill>
);

export const TestHero: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <Cam position={[0.6, 1.8, 5.2]} target={[0.1, 1.55, 0.8]} fov={42} />
      <MarketStreet />
      <Pin
        {...MASCOT}
        position={[0, 0, 1.5]}
        rotY={0.18}
        mood="happy"
        talk
        handR={[-0.45, 0.95, 0.42]}
        handL={[0.6, 0.5, 0.1]}
        holdR={<TabletStrip rotation={[0, 0.2, 0]} scale={1.2} />}
        look={[0.4, 0]}
      />
    </Stage>
    <Grade />
  </AbsoluteFill>
);

export const TestShop: React.FC = () => (
  <AbsoluteFill>
    <Stage bg="#2a1f55">
      <Cam position={[0.6, 1.75, 3.1]} target={[0.05, 1.55, -1.7]} fov={52} />
      <color attach="background" args={['#2a1f55']} />
      <NightLights dir={[3, 5, 6]} keyColor="#ffd2a0" keyI={1.6} fill={0.9} />
      <ShopRoom />
      <Pin {...CHEMIST} position={[0, 0, -1.75]} mood="calm" talk handL={[0.5, 1.15, 0.45]} handR={[-0.62, 0.5, 0.1]} />
      <Lantern position={[-1.4, 2.0, -0.4]} color="#ffb03a" />
    </Stage>
    <Grade />
  </AbsoluteFill>
);

export const TestHeritage: React.FC = () => (
  <AbsoluteFill>
    <Stage bg="#120c33">
      <Cam position={[0, 1.6, 12]} target={[0, 3.6, -4]} fov={52} />
      <HeritageCourt />
      <Pin {...CHEMIST} position={[-0.6, 0.9, -2.0]} scale={0.6} mood="worried" />
    </Stage>
    <Grade />
  </AbsoluteFill>
);
