import Application from './application';
import DEFAULT_SETTINGS from './defaultSettings';
import constants from './constants';

$.fn.slider = function callSlider(method, ...args) {
  let slider;
  let events = {
    onNewValue: null,
    onNewSettings: null,
  };

  const onNewSettings = (settings, eventType) => {
    switch(eventType) {
      case 'positionPercentUpdated':
        events.onNewValue(settings.value);
        break;
      case 'stateChanged':
        events.onNewSettings(settings);
        break;
    }
  }

  const methods = {
    init(options) {
      const fullSettings = { $parentElement: this, ...options };
      if (typeof fullSettings.value === 'undefined') {
        fullSettings.value = fullSettings.type === constants.TYPE_INTERVAL ?
                                            [fullSettings.minValue, fullSettings.maxValue] :
                                            fullSettings.minValue;
      }

      slider = new Application(fullSettings);
      events.onNewValue = options.events.onNewValue;
      events.onNewSettings = options.events.onNewSettings;

      slider.notify(onNewSettings, 'stateUpdated');
      slider.publish('sliderInitialized', 'stateChanged');
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
    setSettings(settings) {
      slider.publish('dispatchNewSettings', settings, 'stateChanged');
    }
  }
};

export default $.fn.slider;