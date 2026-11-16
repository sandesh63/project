import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Stage, Cam} from '../Stage';
import {ShopStreet} from './Shop';
import {Character, COMMON_MAN, CHEMIST} from '../Character';
import {TabletStrip} from '../props';
import {lerp, lerp3, prog} from '../util';

/** Scene 1 – Hook: night street, camera pushes into the glowing medical shop. */
export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 100);
  const turn = prog(f, 40, 62);
  return (
    <Stage>
      <Cam position={lerp3([0, 3.6, 13.5], [0.25, 2.5, 6.0], t)} target={lerp3([0, 3, 0], [-0.05, 1.75, -0.6], t)} fov={44} />
      <ShopStreet />
      <Character
        {...COMMON_MAN}
        position={[-0.75, 0.16, 0.55]}
        rotationY={lerp(-2.5, 0.35, turn)}
        armR={{x: -lerp(0.2, 1.2, turn), z: 0.3}}
        holdR={<TabletStrip rotation={[1.4, 0, 0]} scale={1.1} />}
        talk={f > 50}
        mood="happy"
        eyeLook={[0.3, 0]}
      />
      <Character {...CHEMIST} position={[0.75, 0, -1.75]} rotationY={-0.35} armL={{z: 0.5}} mood="happy" />
    </Stage>
  );
};
