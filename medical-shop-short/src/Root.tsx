import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import {FPS, WIDTH, HEIGHT, TOTAL_FRAMES, SCENES} from './timeline';
import {Video, SceneOnly} from './Video';
import {CharSheet} from './v2/CharSheet';
import {CastSheet, CastInWorld, ShopInside} from './v5/CastTest';
import {Video3} from './v3/Video3';
import {FRAMES as V3_FRAMES} from './v3/timeline';
import {TestStreet, TestHero, TestShop, TestHeritage} from './v2/StyleTest';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Short" component={Video3} durationInFrames={V3_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="MedicalShort" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {SCENES.map((s) => (
      <Composition
        key={s.id}
        id={`scene-${s.id}`}
        component={SceneOnly}
        defaultProps={{id: s.id}}
        durationInFrames={Math.round((s.end - s.start) * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
    {([['v5-sheet', CastSheet], ['v5-world', CastInWorld], ['v5-inside', ShopInside], ['v2-chars', CharSheet], ['v2-street', TestStreet], ['v2-hero', TestHero], ['v2-shop', TestShop], ['v2-heritage', TestHeritage]] as const).map(([id, C]) => (
      <Composition key={id} id={id} component={C} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
  </>
);
