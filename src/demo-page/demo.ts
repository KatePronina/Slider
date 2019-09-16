import ConfigurationView from './ConfigurationView';

const slidersData = [
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

slidersData.forEach(({ configurationClass, sliderClass, settings }) => {
  const container = document.querySelector(`.${configurationClass}`);
  container && new ConfigurationView(container, sliderClass, settings);
});
