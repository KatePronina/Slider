import * as $ from 'jquery';

import Controller from '../Controller/Controller';

import RangeSliderView from './Views/slider/RangeSliderView';
import IntervalSliderView from './Views/slider/IntervalSliderView';
import HintView from './Views/hint/HintView';
import ScaleView from './Views/scale/ScaleView';
import ConfigurationView from './Views/configuration/ConfigurationView';
import View from './View';

beforeEach((): void => {
  document.body.innerHTML = '<div id="foo"></div>';
});

describe('Constructor', (): void => {
  test('Should create right slider view', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view.slider).toEqual(expect.any(RangeSliderView));
  });

  test('Should create right slider view for interval', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'interval',
      minValue: 0,
      maxValue: 100,
      value: [0, 1],
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view.slider).toEqual(expect.any(IntervalSliderView));
  });

  test('Should create hint', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view.hintView).toEqual(expect.any(HintView));
  });

  test('Should not create hint', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: false,
      configuration: false,
    });

    expect(view.hintView).toBeUndefined();
  });

  test('Should create scale', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: true,
      configuration: false,
    });

    expect(view.scaleView).toEqual(expect.any(ScaleView));
  });

  test('Should not create scale', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view.scaleView).toBeUndefined();
  });

  test('Should create configuration panel', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: true,
    });

    expect(view.configurationView).toEqual(expect.any(ConfigurationView));
  });

  test('Should not create configuration panel', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view.configurationView).toBeUndefined();
  });

  test('Should save parent element', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view.$parentElement).toBeDefined();
    expect(view.$parentElement).toEqual(expect.anything());
  });
});

describe('DOM actions', (): void => {
  test('Should add slider in DOM', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view).toBeDefined();
    expect(document.querySelectorAll('.slider-wrapper').length).toEqual(1);
    expect(document.querySelectorAll('.slider').length).toEqual(1);
    expect(document.querySelectorAll('.slider__bar').length).toEqual(1);
    expect(document.querySelectorAll('.slider__point').length).toEqual(1);
  });

  test('Should add hint in DOM with correct value', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view).toBeDefined();
    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(1);
    const sliderHint = document.querySelector('#foo .slider__hint');
    expect(sliderHint instanceof HTMLElement && sliderHint.textContent).toEqual('0');
  });

  test('Should not add hint in DOM', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 100,
      value: 0,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: false,
      configuration: false,
    });

    expect(view).toBeDefined();
    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(0);
  });

  test('Should add hints in DOM for interval', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'interval',
      minValue: 0,
      maxValue: 100,
      value: [2, 5],
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: false,
      configuration: false,
    });

    expect(view).toBeDefined();
    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(2);
  });

  test('Should add configuration with correct values', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 0,
      maxValue: 95,
      value: 6,
      step: 3,
      direction: 'vertical',
      hint: true,
      scale: false,
      configuration: true,
    });

    expect(view).toBeDefined();

    const currentValueInput = document.getElementById('currentValue');
    expect(currentValueInput instanceof HTMLInputElement && currentValueInput.value).toEqual('6');

    const stepSizeInput = document.getElementById('stepSize');
    expect(stepSizeInput instanceof HTMLInputElement && stepSizeInput.value).toEqual('3');

    const minValueInput = document.getElementById('minValue');
    expect(minValueInput instanceof HTMLInputElement && minValueInput.value).toEqual('0');

    const maxValueInput = document.getElementById('maxValue');
    expect(maxValueInput instanceof HTMLInputElement && maxValueInput.value).toEqual('95');

    const toggleHintInput = document.getElementById('toggleHint');
    expect(toggleHintInput instanceof HTMLInputElement && toggleHintInput.checked).toEqual(true);

    const toggleScaleInput = document.getElementById('toggleScale');
    expect(toggleScaleInput instanceof HTMLInputElement && toggleScaleInput.checked).toEqual(false);

    const toggleTypeInput = document.getElementById('toggleType');
    expect(toggleTypeInput instanceof HTMLInputElement && toggleTypeInput.checked).toEqual(false);

    const toggleVerticalInput = document.getElementById('toggleVertical');
    expect(toggleVerticalInput instanceof HTMLInputElement && toggleVerticalInput.checked).toEqual(true);
  });

  test('Should add configuration with correct values fot interval slider', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'interval',
      minValue: 10,
      maxValue: 95,
      value: [13, 95],
      step: 3,
      direction: 'horizontal',
      hint: false,
      scale: true,
      configuration: true,
    });

    expect(view).toBeDefined();

    const currentMinValueInput = document.getElementById('currentMinValue');
    expect(currentMinValueInput instanceof HTMLInputElement && currentMinValueInput.value).toEqual('13');

    const currentMaxValueInput = document.getElementById('currentMaxValue');
    expect(currentMaxValueInput instanceof HTMLInputElement && currentMaxValueInput.value).toEqual('95');

    const stepSizeInput = document.getElementById('stepSize');
    expect(stepSizeInput instanceof HTMLInputElement && stepSizeInput.value).toEqual('3');

    const minValueInput = document.getElementById('minValue');
    expect(minValueInput instanceof HTMLInputElement && minValueInput.value).toEqual('10');

    const maxValueInput = document.getElementById('maxValue');
    expect(maxValueInput instanceof HTMLInputElement && maxValueInput.value).toEqual('95');

    const toggleHintInput = document.getElementById('toggleHint');
    expect(toggleHintInput instanceof HTMLInputElement && toggleHintInput.checked).toEqual(false);

    const toggleScaleInput = document.getElementById('toggleScale');
    expect(toggleScaleInput instanceof HTMLInputElement && toggleScaleInput.checked).toEqual(true);

    const toggleTypeInput = document.getElementById('toggleType');
    expect(toggleTypeInput instanceof HTMLInputElement && toggleTypeInput.checked).toEqual(true);

    const toggleVerticalInput = document.getElementById('toggleVertical');
    expect(toggleVerticalInput instanceof HTMLInputElement && toggleVerticalInput.checked).toEqual(false);
  });

  test('Should hide hint', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: true,
      configuration: true,
    });

    const event = new Event('click');
    const toggleHintInput = document.getElementById('toggleHint');
    const sliderHint = document.querySelector('.slider__hint');
    toggleHintInput instanceof HTMLElement && toggleHintInput.dispatchEvent(event);

    expect(view).toBeDefined();
    expect(sliderHint instanceof HTMLElement && (sliderHint.classList.contains('slider__hint_disable'))).toEqual(true);
  });

  test('Should show hint', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: true,
      configuration: true,
    });

    const event = new Event('click');
    const toggleHint = document.getElementById('toggleHint');
    const sliderHint = document.querySelector('.slider__hint');
    toggleHint instanceof HTMLElement && toggleHint.dispatchEvent(event);

    expect(view).toBeDefined();
    expect(sliderHint instanceof HTMLElement && sliderHint.classList.contains('slider__hint_disable')).toEqual(false);
  });

  test('Should hide scale', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'horizontal',
      hint: true,
      scale: true,
      configuration: true,
    });

    const event = new Event('click');
    const toggleScale = document.getElementById('toggleScale');
    const scale = document.querySelector('.slider__scale');
    toggleScale instanceof HTMLElement && toggleScale.dispatchEvent(event);

    expect(view).toBeDefined();
    expect(scale instanceof HTMLElement && scale.classList.contains('slider__scale_disable')).toEqual(true);
  });

  test('Should show hint', (): void => {
    const view = new View({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: false,
      configuration: true,
    });

    const event = new Event('click');
    const toggleScale = document.getElementById('toggleScale');
    const scale = document.querySelector('.slider__scale');
    toggleScale instanceof HTMLElement && toggleScale.dispatchEvent(event);

    expect(view).toBeDefined();
    expect(scale instanceof HTMLElement && scale.classList.contains('slider__scale_disable')).toEqual(false);
  });

  test('Should change slider direction from horizontal to vertical', (): void => {
    const controller = new Controller({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'horizontal',
      hint: false,
      scale: false,
      configuration: true,
    });

    const event = new Event('click');
    const toggleVertical = document.getElementById('toggleVertical');
    const slider = document.querySelector('.slider');
    toggleVertical instanceof HTMLElement && toggleVertical.dispatchEvent(event);

    expect(controller).toBeDefined();
    expect(slider instanceof HTMLElement && slider.classList.contains('slider_vertical')).toEqual(true);
  });

  test('Should change slider direction from vertical to horizontal', (): void => {
    const controller = new Controller({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'vertical',
      hint: false,
      scale: false,
      configuration: true,
    });

    const event = new Event('click');
    const toggleVertical = document.getElementById('toggleVertical');
    const slider = document.querySelector('.slider');
    toggleVertical instanceof HTMLElement && toggleVertical.dispatchEvent(event);

    expect(controller).toBeDefined();
    expect(slider instanceof HTMLElement && slider.classList.contains('slider_vertical')).toEqual(false);
  });

  test('Should change slider type from range to interval', (): void => {
    const controller = new Controller({
      $parentElement: $('#foo'),
      type: 'range',
      minValue: 10,
      maxValue: 95,
      value: 10,
      step: 1,
      direction: 'vertical',
      hint: false,
      scale: false,
      configuration: true,
    });

    const event = new Event('click');
    const toggleType = document.getElementById('toggleType');
    toggleType instanceof HTMLElement && toggleType.dispatchEvent(event);

    expect(controller).toBeDefined();
    expect(document.querySelector('.slider__point_max')).toBeTruthy();
  });

  test('Should change slider type from interval to range', (): void => {
    const controller = new Controller({
      $parentElement: $('#foo'),
      type: 'interval',
      minValue: 10,
      maxValue: 95,
      value: [10, 12],
      step: 1,
      direction: 'vertical',
      hint: false,
      scale: false,
      configuration: true,
    });

    const event = new Event('click');
    const toggleType = document.getElementById('toggleType');
    toggleType instanceof HTMLElement && toggleType.dispatchEvent(event);

    expect(controller).toBeDefined();
    expect(document.querySelector('.slider__point_max')).toBeNull();
  });
});
