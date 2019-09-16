import ConfigurationView from './ConfigurationView';

const firstSliderConfigurationContainer = document.querySelector('.js-first-slider-section__configuration');
const firstSliderConfigurationView = firstSliderConfigurationContainer
                                     && new ConfigurationView(firstSliderConfigurationContainer, 'js-first-slider');

const secondSliderConfigurationContainer = document.querySelector('.js-second-slider-section__configuration');
const secondSliderConfigurationView = secondSliderConfigurationContainer
                                     && new ConfigurationView(secondSliderConfigurationContainer, 'js-second-slider', {
                                       minValue: 3,
                                       maxValue: 19,
                                       step: 5,
                                       value: 8,
                                       scale: true,
                                     });

const thirdSliderConfigurationContainer = document.querySelector('.js-third-slider-section__configuration');
const thirdSliderConfigurationView = thirdSliderConfigurationContainer
                                    && new ConfigurationView(thirdSliderConfigurationContainer, 'js-third-slider', {
                                      minValue: 2,
                                      maxValue: 31,
                                      step: 8,
                                      direction: 'vertical',
                                      scale: true,
                                    });

const fourthSliderConfigurationContainer = document.querySelector('.js-fourth-slider-section__configuration');
const fourthSliderConfigurationView = fourthSliderConfigurationContainer
                                    && new ConfigurationView(fourthSliderConfigurationContainer, 'js-fourth-slider', {
                                      type: 'interval',
                                      value: [5, 25],
                                      direction: 'vertical',
                                      scale: true,
                                      step: 5,
                                      hint: true,
                                    });
