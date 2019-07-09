import Application from './application';

(function( $ ) {
  $.fn.slider = function(options) {
    new Application({parentElement: this, ...options});
  };
})(jQuery);

$('#first-slider').slider({configuration: true});
$('#second-slider').slider({minValue: 3, maxValue: 19, step: 5, value: 8, scale: true, configuration: true});
$('#third-slider').slider({minValue: 2, maxValue: 31, step: 8, direction: 'vertical', scale: true, configuration: true});
$('#fourth-slider').slider({type: 'interval', value: [10, 31], direction: 'vertical', scale: true, step: 5, configuration: true, hint: false});