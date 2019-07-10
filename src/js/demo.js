import Application from './application';

(function( $ ) {
  let slider;

  const methods = {
    init: function (options) {
      slider = new Application({parentElement: this, ...options});
    },
    setValue: function (value, valueType) {
      slider.setValue(value, valueType);
    }
  };

  $.fn.slider = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error(`Метод с именем ${method} не существует`);
    }
  }
})(jQuery);

$('#first-slider').slider({configuration: true,});
$('#first-slider').slider('setValue', 5);

$('#second-slider').slider({minValue: 3, 
                          maxValue: 19, 
                          step: 5, 
                          value: 8, 
                          scale: true, 
                          configuration: true,
                        });

$('#third-slider').slider({minValue: 2,
                          maxValue: 31, 
                          step: 8, 
                          direction: 'vertical', 
                          scale: true, 
                          configuration: true,
                        });

$('#fourth-slider').slider({type: 'interval', 
                          value: [10, 31],
                          direction: 'vertical', 
                          scale: true, 
                          step: 5, 
                          configuration: true, 
                          hint: false,
                        });
$('#fourth-slider').slider('setValue', 20, 'min');