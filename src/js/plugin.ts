import Application from './Application';
import { TYPE_INTERVAL, DEFAULT_SETTINGS } from './constants';
import { IModelSettings } from './Interfaces/model/IModel';
import IPluginSettings from './Interfaces/IPluginSettings';
import { INewParams } from './Interfaces/controller/IController';
import IMethods from './Interfaces/IMethods';

$.fn.slider = function callSlider(method: string, ...args) {
  let slider: Application;
  const events = {
    onNewValue: (value: number | number[]) => {},
    onNewSettings: (settings: IModelSettings) => {},
  };

  const onNewSettings = (settings: IModelSettings) => {
    events.onNewSettings(settings);
  };

  const onNewValue = (settings: IModelSettings) => {
    events.onNewValue(settings.value);
  };

  const methods: IMethods = {
    init(options: IPluginSettings): void {
      const fullSettings = { $parentElement: this, ...options };
      if (typeof fullSettings.value === 'undefined') {
        fullSettings.value = fullSettings.type === TYPE_INTERVAL ?
                                            [fullSettings.minValue, fullSettings.maxValue] :
                                            fullSettings.minValue;
      }

      slider = new Application(fullSettings);
      events.onNewValue = options.events.onNewValue;
      events.onNewSettings = options.events.onNewSettings;

      slider.notify(onNewSettings, 'stateUpdated');
      slider.notify(onNewValue, 'positionPercentUpdated');

      slider.publish('sliderInitialized', 'stateUpdated');
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
      slider.publish('dispatchOptions', { ...settings, eventType: 'stateUpdated' });
    },
  };
};

export default $.fn.slider;
