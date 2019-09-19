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
      slider = new Application({ $parentElement: this, ...options });

      slider.subscribe(onNewValue, 'onNewValue');
      slider.subscribe(onNewSettings, 'onNewSettings');
    },
    setValue(value, valueType) {
      slider.setValue(value, valueType);
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
    setValue(value, valueType) {
      slider.setValue(value, valueType);
    },
    setSettings(settings) {
      slider.setSettings(settings);
    },
    getSettings() {
      slider.getSettings();
    }
  }
};

export default $.fn.slider;