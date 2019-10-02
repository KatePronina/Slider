import Application from './application';
import DEFAULT_SETTINGS from './defaultSettings';

$.fn.slider = function callSlider(method, ...args) {
  let slider;

  const onNewSettings = (settings, eventType) => {
    switch(eventType) {
      case 'positionPercentUpdated':
        this.trigger('slider.onNewValue', [settings.value]);
        break;
      case 'settingsUpdated':
        this.trigger('slider.onNewSettings', [settings]);
        break;
    }
  }

  const methods = {
    init(options) {
      const fullSettings = { $parentElement: this, ...options };
      slider = new Application(fullSettings);

      slider.subscribe(onNewSettings, 'onNewSettings');
      slider.publish('getSettings');
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
      slider.publish('setSettings', settings);
    }
  }
};

export default $.fn.slider;