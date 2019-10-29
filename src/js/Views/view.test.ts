import * as $ from 'jquery';
import View from './View';

beforeEach((): void => {
  document.body.innerHTML = '<div id="foo"></div>';
});

describe('Constructor', (): void => {
  test('Should create right slider view', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('.slider__point').length).toEqual(1);
    expect(document.querySelectorAll('.slider').length).toEqual(1);
    expect(document.querySelectorAll('.slider__bar').length).toEqual(1);
  });

  test('Should create right slider view for interval', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0, 1],
      type: 'interval',
      minValue: 0,
      maxValue: 100,
      value: [0, 1],
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('.slider__point').length).toEqual(2);
    expect(document.querySelectorAll('.slider').length).toEqual(1);
    expect(document.querySelectorAll('.slider__bar').length).toEqual(1);
  });

  test('Should create hint', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('.slider__hint').length).toEqual(1);
  });

  test('Should not create hint', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: false,
    });

    expect(document.querySelectorAll('.slider__hint').length).toEqual(0);
  });

  test('Should not create scale', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('.slider__scale').length).toEqual(0);
  });
});

describe('DOM actions', (): void => {
  test('Should add slider in DOM', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('.slider-wrapper').length).toEqual(1);
    expect(document.querySelectorAll('.slider').length).toEqual(1);
    expect(document.querySelectorAll('.slider__bar').length).toEqual(1);
    expect(document.querySelectorAll('.slider__point').length).toEqual(1);
  });

  test('Should add hint in DOM with correct value', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(1);
    const sliderHint = document.querySelector('#foo .slider__hint');
    expect(sliderHint instanceof HTMLElement && sliderHint.textContent).toEqual('0');
  });

  test('Should not add hint in DOM', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: false,
    });

    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(0);
  });

  test('Should add hints in DOM for interval', (): void => {
    new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'interval',
      minValue: 0,
      maxValue: 100,
      value: [2, 5],
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(2);
  });
});

describe('InitSlider', (): void => {
  test('Should init new slider', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      positionLength: [0],
      type: 'single',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
    });

    view.redrawSlider({
      positionLength: [5, 10],
      type: 'interval',
      minValue: 0,
      maxValue: 100,
      value: [5, 10],
      step: 5,
      direction: 'vertical',
      hint: true,
      scale: true,
    });

    expect(document.querySelectorAll('.slider').length).toEqual(1);
    expect(document.querySelectorAll('.slider__bar').length).toEqual(1);
    expect(document.querySelectorAll('.slider__point').length).toEqual(2);
  });
});
