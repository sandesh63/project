import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Cam} from '../three/Stage';
import {Toon, MASCOT, CHEMIST, DISTRIBUTOR} from './Toon2';
import {TabletStrip} from '../three/props';

export const CharSheet: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #ffb36b 0%, #c25a7a 45%, #3a2470 100%)'}}>
    <Stage bg="transparent">
      <Cam position={[0, 1.2, 10]} target={[0, 1.05, 0]} fov={24} />
      <hemisphereLight args={['#ffffff', '#444444', 1]} />
      <directionalLight position={[3, 5, 6]} intensity={1} castShadow />
      <Toon {...MASCOT} position={[-0.6, 1.15, 0]} scale={0.85} mood="smile" handR={[-0.3, 0.75, 0.5]} holdR={<TabletStrip />} />
      <Toon {...CHEMIST} position={[0.6, 1.15, 0]} scale={0.85} mood="calm" />
      <Toon {...DISTRIBUTOR} position={[-0.6, -1.05, 0]} rotY={0.5} scale={0.85} mood="happy" walk />
      <Toon {...MASCOT} position={[0.6, -1.05, 0]} rotY={-0.5} scale={0.85} mood="shock" handL={[0.6, 1.05, 0.3]} handR={[-0.6, 1.05, 0.3]} />
    </Stage>
  </AbsoluteFill>
);
