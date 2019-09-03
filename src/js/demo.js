import Application from './application';
import DEFAULT_SETTINGS from './defaultSettings';

((function createSlider($) {
  let slider;

  const methods = {
    init(options) {
      slider = new Application({ $parentElement: this, ...options });
    },
    setValue(value, valueType) {
      slider.setValue(value, valueType);
    },
  };

  $.fn.slider = function callSlider(method, ...args) {
    if (methods[method]) {
      return methods[method].apply(this, args);
    }
    if (typeof method === 'object') {
      const fullSettings = $.extend(true, { ...DEFAULT_SETTINGS }, method);
      return methods.init.call(this, fullSettings);
    }
    return $.error(`Метод с именем ${method} не существует`);
  };
})(jQuery));

$('#first-slider').slider({ configuration: true });
$('#first-slider').slider('setValue', 5);

$('.js-second-slider').slider({
                          minValue: 3,
                          maxValue: 19,
                          step: 5,
                          value: 8,
                          scale: true,
                          configuration: true,
                        });

$('.js-third-slider').slider({
                          minValue: 2,
                          maxValue: 31,
                          step: 8,
                          direction: 'vertical',
                          scale: true,
                          // configuration: true,
                        });

$('.js-fourth-slider').slider({
                          type: 'interval',
                          value: [5, 31],
                          direction: 'vertical',
                          scale: true,
                          step: 5,
                          // configuration: true,
                          hint: false,
                        });
$('.js-fourth-slider').slider('setValue', 20);
