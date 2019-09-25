import Application from './application';
import DEFAULT_SETTINGS from './defaultSettings';

$.fn.slider = function callSlider(method, ...args) {
  let slider;

  const onNewValue = (value) => {
    this.trigger('slider.onNewValue', [value]);
  }

  const onNewSettings = (settings) => {
    this.trigger('slider.onNewSettings', [settings]);
  }

  const methods = {
    init(options) {
      const fullSettings = { $parentElement: this, ...options };
      slider = new Application(fullSettings);

      slider.subscribe(onNewValue, 'onNewValue');
      slider.subscribe(onNewSettings, 'onNewSettings');
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
    },
    getSettings() {
      slider.publish('getSettings');
    }
  }
};

export default $.fn.slider;