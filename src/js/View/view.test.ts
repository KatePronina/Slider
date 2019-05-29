import View from './view';

test('Should create right slider view', (): void => {
    const view = new View({parentId: 'bar', type: 'range'});

    expect(view.slider).toEqual(expect.any(RangeSliderView));
})