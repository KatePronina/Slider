import ConfigurationView from './ConfigurationView';
import { slidersData } from '../js/constants';

slidersData.forEach(({ configurationClass, sliderClass, settings }) => {
  const container = document.querySelector(`.${configurationClass}`);
  if (container) new ConfigurationView(container, sliderClass, settings);
});
