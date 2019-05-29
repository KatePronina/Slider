import View from './view';
import RangeSliderView from './Views/rangeSliderView';

test('Should create right slider view', (): void => {
    const view = new View({parentId: 'bar', type: 'range'});

    expect(view.slider).toEqual(expect.any(RangeSliderView));
})