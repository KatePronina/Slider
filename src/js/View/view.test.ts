import View from './view';
import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';
import HintView from './Views/hintView';
import ScaleView from './Views/scaleView';

test('Should create right slider view', (): void => {
  const view = new View({parentId: 'bar', type: 'range'});

  expect(view.slider).toEqual(expect.any(RangeSliderView));
})

test('Should create right slider view for interval', (): void => {
  const view = new View({parentId: 'bar', type: 'interval'});

  expect(view.slider).toEqual(expect.any(IntervalSliderView));
})

test('Should create hint', (): void => {
  const view = new View({parentId: 'bar', hint: 'yes'});

  expect(view.hint).toEqual(expect.any(HintView));
})

test('Should not create hint', (): void => {
  const view = new View({parentId: 'bar', hint: 'no'});

  expect(view.hint).toBeUndefined();
})

test('Should create scale', (): void => {
  const view = new View({parentId: 'bar', scale: 'yes'});

  expect(view.scale).toEqual(expect.any(ScaleView));
})

test('Should not create scale', (): void => {
  const view = new View({parentId: 'bar', scale: 'no'});

  expect(view.scale).toBeUndefined();
})