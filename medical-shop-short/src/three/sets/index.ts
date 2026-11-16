import React from 'react';
import type {SceneId} from '../../timeline';
import {HookScene} from './scenes1';
import {JourneyScene, SplitScene} from './scenes2';
import {SchemeScene, GovtScene, ExpensesScene, CliffScene, CtaScene} from './scenes3';

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: HookScene,
  journey: JourneyScene,
  split: SplitScene,
  scheme: SchemeScene,
  govt: GovtScene,
  expenses: ExpensesScene,
  cliff: CliffScene,
  cta: CtaScene,
};
