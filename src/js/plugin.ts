import Application from './Application';
import { TYPE_INTERVAL, DEFAULT_SETTINGS } from './constants';
import { IModelSettings } from './Interfaces/model/IModel';
import IPluginSettings from './Interfaces/IPluginSettings';
import { INewParams } from './Interfaces/controller/IController';
import IMethods from './Interfaces/IMethods';

$.fn.slider = function callSlider(method: string, ...args) {
  let slider: Application;
  const events = {
    publishUpdatedValue: (value: number[]) => {},
    publishUpdatedSettings: (settings: IModelSettings) => {},
  };

  const publishUpdatedSettings = (settings: IModelSettings) => {
    events.publishUpdatedSettings(settings);
  };

  const publishUpdatedValue = (settings: IModelSettings) => {
    events.publishUpdatedValue(settings.value);
  };

  const methods: IMethods = {
    init(options: IPluginSettings): void {
      const fullSettings = { $parentElement: this, ...options };
      if (typeof fullSettings.value === 'undefined') {
        fullSettings.value = fullSettings.type === TYPE_INTERVAL ?
                                            [fullSettings.minValue, fullSettings.maxValue] :
                                            [fullSettings.minValue];
      }

      slider = new Application(fullSettings);
      events.publishUpdatedValue = options.events.valueUpdated;
      events.publishUpdatedSettings = options.events.settingsUpdated;

      slider.subscribe(publishUpdatedSettings, 'stateUpdated');
      slider.subscribe(publishUpdatedValue, 'positionPercentUpdated');

      slider.notify('sliderInitialized', 'stateUpdated');
    },
  };

  if (methods[method]) {
    methods[method].apply(this, args);
  }
  if (typeof method === 'object') {
    const fullSettings = $.extend(true, { ...DEFAULT_SETTINGS }, method);
    methods.init.call(this, fullSettings);
  }

  return {
    setSettings(settings: INewParams) {
      slider.notify('dispatchOptions', { ...settings, eventType: 'stateUpdated' });
    },
  };
};

export default $.fn.slider;
