import { ISliderData } from '../demo-page/interfaces';

export const DEFAULT_SETTINGS = {
  type: 'single',
  minValue: 0,
  maxValue: 100,
  step: 1,
  direction: 'horizontal',
  hint: true,
  scale: false,
};

export const slidersData: ISliderData[] = [
  {
    configurationClass: 'js-first-slider-section__configuration',
    sliderClass: 'js-first-slider',
  },
  {
    configurationClass: 'js-second-slider-section__configuration',
    sliderClass: 'js-second-slider',
    settings: {
      minValue: 3,
      maxValue: 19,
      step: 5,
      value: 8,
      scale: true,
    },
  },
  {
    configurationClass: 'js-third-slider-section__configuration',
    sliderClass: 'js-third-slider',
    settings: {
      minValue: 2,
      maxValue: 31,
      step: 8,
      direction: 'vertical',
      scale: true,
    },
  },
  {
    configurationClass: 'js-fourth-slider-section__configuration',
    sliderClass: 'js-fourth-slider',
    settings: {
      type: 'interval',
      value: [5, 25],
      direction: 'vertical',
      scale: true,
      step: 5,
      hint: true,
    },
  },
];
export const TYPE_SINGLE = 'single';
export const TYPE_INTERVAL = 'interval';
export const VALUE_START = 0;
export const VALUE_END = 1;
export const PERCENT_MIN = 0;
export const PERCENT_MAX = 1;
export const DIRECTION_HORIZONTAL = 'horizontal';
export const DIRECTION_VERTICAL = 'vertical';
export const VALUE_TYPE_MIN = 'min';
export const VALUE_TYPE_MAX = 'max';
export const HINT_VERTICAL_CLASS = 'slider__hint_direction_vertical';
export const SCALE_HORIZONTAL_CLASS = 'slider__scale_direction_horizontal';
export const SCALE_VERTICAL_CLASS = 'slider__scale_direction_vertical';
export const POINT_ACTIVE_CLASS = 'slider__point_actived';
