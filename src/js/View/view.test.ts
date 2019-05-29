import View from './view';
import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';

test('Should create right slider view', (): void => {
  const view = new View({parentId: 'bar', type: 'range'});

  expect(view.slider).toEqual(expect.any(RangeSliderView));
})

test('Should create right slider view for interval', (): void => {
  const view = new View({parentId: 'bar', type: 'interval'});

  expect(view.slider).toEqual(expect.any(IntervalSliderView));
})