import View from './view';
import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';
import HintView from './Views/hintView';
import ScaleView from './Views/scaleView';
import ConfigureView from './Views/configureView';

test('Should create right slider view', (): void => {
  document.body.innerHTML = '<div id="bar"></div>';

  const view = new View({parentId: 'bar', type: 'range'});

  expect(view.slider).toEqual(expect.any(RangeSliderView));
})

// TO DO: add getDOMElement to IntervalSLider view

// test('Should create right slider view for interval', (): void => {
//   document.body.innerHTML = '<div id="bar"></div>';

//   const view = new View({parentId: 'bar', type: 'interval'});

//   expect(view.slider).toEqual(expect.any(IntervalSliderView));
// })

test('Should create hint', (): void => {
  const view = new View({parentId: 'bar', hint: 'yes', type: 'range'});

  expect(view.hint).toEqual(expect.any(HintView));
})

test('Should not create hint', (): void => {
  const view = new View({parentId: 'bar', hint: 'no', type: 'range'});

  expect(view.hint).toBeUndefined();
})

test('Should create scale', (): void => {
  const view = new View({parentId: 'bar', scale: 'yes', type: 'range'});

  expect(view.scale).toEqual(expect.any(ScaleView));
})

test('Should not create scale', (): void => {
  const view = new View({parentId: 'bar', scale: 'no', type: 'range'});

  expect(view.scale).toBeUndefined();
})

test('Should create configuration panel', (): void => {;
  const view = new View({parentId: 'bar', configure: 'yes', type: 'range'});

  expect(view.configure).toEqual(expect.any(ConfigureView));
})

test('Should not create configuration panel', (): void => {
  const view = new View({parentId: 'bar', configure: 'no', type: 'range'});

  expect(view.configure).toBeUndefined();
})

test('Should save parent element', (): void => {
  document.body.innerHTML = '<div id="bar"></div>';

  const view = new View({parentId: 'bar', type: 'range'});

  expect(view.parentElement).toBeDefined();
  expect(view.parentElement).toEqual(expect.anything());
})

test('Should add slider in DOM', (): void => {
  document.body.innerHTML = '<div id="first-slider"></div>';

  const view = new View({parentId: 'first-slider', type: 'range'});

  expect(document.querySelectorAll('#first-slider .slider-wrapper').length).toEqual(1);
  expect(document.querySelectorAll('#first-slider .slider').length).toEqual(1);
  expect(document.querySelectorAll('#first-slider .slider__bar').length).toEqual(1);
  expect(document.querySelectorAll('#first-slider .slider__point').length).toEqual(1);
})

test('Should add hint in DOM', (): void => {
  document.body.innerHTML = '<div id="foo"></div>';

  const view = new View({parentId: 'foo', type: 'range', hint: 'yes'});

  expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(1);
})

test('Should not add hint in DOM', (): void => {
  document.body.innerHTML = '<div id="foo"></div>';

  const view = new View({parentId: 'foo', type: 'range', hint: 'no'});

  expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(0);
})