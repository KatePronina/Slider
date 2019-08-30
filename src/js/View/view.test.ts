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
    expect((document.querySelector('#foo .slider__hint') as HTMLElement).textContent).toEqual('0');
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
    expect((document.getElementById('currentValue') as HTMLInputElement).value).toEqual('6');
    expect((document.getElementById('stepSize') as HTMLInputElement).value).toEqual('3');
    expect((document.getElementById('minValue') as HTMLInputElement).value).toEqual('0');
    expect((document.getElementById('maxValue') as HTMLInputElement).value).toEqual('95');
    expect((document.getElementById('toggleHint') as HTMLInputElement).checked).toEqual(true);
    expect((document.getElementById('toggleScale') as HTMLInputElement).checked).toEqual(false);
    expect((document.getElementById('toggleType') as HTMLInputElement).checked).toEqual(false);
    expect((document.getElementById('toggleVertical') as HTMLInputElement).checked).toEqual(true);
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
    expect((document.getElementById('currentMinValue') as HTMLInputElement).value).toEqual('13');
    expect((document.getElementById('currentMaxValue') as HTMLInputElement).value).toEqual('95');
    expect((document.getElementById('stepSize') as HTMLInputElement).value).toEqual('3');
    expect((document.getElementById('minValue') as HTMLInputElement).value).toEqual('10');
    expect((document.getElementById('maxValue') as HTMLInputElement).value).toEqual('95');
    expect((document.getElementById('toggleHint') as HTMLInputElement).checked).toEqual(false);
    expect((document.getElementById('toggleScale') as HTMLInputElement).checked).toEqual(true);
    expect((document.getElementById('toggleType') as HTMLInputElement).checked).toEqual(true);
    expect((document.getElementById('toggleVertical') as HTMLInputElement).checked).toEqual(false);
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
    (document.getElementById('toggleHint') as HTMLInputElement).dispatchEvent(event);

    expect(view).toBeDefined();
    expect((document.querySelector('.slider__hint') as HTMLElement)
          .classList.contains('slider__hint_disable')).toEqual(true);
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
    (document.getElementById('toggleHint') as HTMLInputElement).dispatchEvent(event);

    expect(view).toBeDefined();
    expect((document.querySelector('.slider__hint') as HTMLElement)
          .classList.contains('slider__hint_disable')).toEqual(false);
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
    (document.getElementById('toggleScale') as HTMLInputElement).dispatchEvent(event);

    expect(view).toBeDefined();
    expect((document.querySelector('.slider__scale') as HTMLElement)
          .classList.contains('slider__scale_disable')).toEqual(true);
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
    (document.getElementById('toggleScale') as HTMLInputElement).dispatchEvent(event);

    expect(view).toBeDefined();
    expect((document.querySelector('.slider__scale') as HTMLElement)
          .classList.contains('slider__scale_disable')).toEqual(false);
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
    (document.getElementById('toggleVertical') as HTMLInputElement).dispatchEvent(event);

    expect(controller).toBeDefined();
    expect((document.querySelector('.slider') as HTMLElement).classList.contains('slider_vertical')).toEqual(true);
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
    (document.getElementById('toggleVertical') as HTMLInputElement).dispatchEvent(event);

    expect(controller).toBeDefined();
    expect((document.querySelector('.slider') as HTMLElement).classList.contains('slider_vertical')).toEqual(false);
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
    (document.getElementById('toggleType') as HTMLInputElement).dispatchEvent(event);

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
    (document.getElementById('toggleType') as HTMLInputElement).dispatchEvent(event);

    expect(controller).toBeDefined();
    expect(document.querySelector('.slider__point_max')).toBeNull();
  });
});
