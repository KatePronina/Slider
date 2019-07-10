import * as $ from 'jquery';
import Model from './model';

beforeEach((): void => {
  document.body.innerHTML = '<div id="foo"></div>';
});

describe('Constructor', (): void => {
  test('Should set default settings', (): void => {
    const model = new Model({parentElement: $('.foo')});

    expect(model.state.type).toEqual('range');
    expect(model.state.minValue).toEqual(0);
    expect(model.state.maxValue).toEqual(100);
    expect(model.state.value).toEqual(model.state.minValue);
    expect(model.state.step).toEqual(1);
    expect(model.state.direction).toEqual('horizontal');
    expect(model.state.hint).toEqual(true);
    expect(model.state.scale).toEqual(false);
    expect(model.state.configuration).toEqual(false);
  })

  test('Should set custom settings', (): void => {
    const model = new Model({
     parentElement: $('.foo'),
      type: 'interval',
      value: [15, 20],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
      configuration: true,
    });

    expect(model.state.type).toEqual('interval');
    expect(model.state.value).toEqual([15, 20]);
    expect(model.state.minValue).toEqual(5);
    expect(model.state.maxValue).toEqual(30);
    expect(model.state.step).toEqual(5);
    expect(model.state.direction).toEqual('vertical');
    expect(model.state.hint).toEqual(false);
    expect(model.state.scale).toEqual(true);
    expect(model.state.configuration).toEqual(true);
  })
});

describe('Setting value', (): void => {
  test('Should update value', (): void => {
    const model = new Model({parentElement: $('.foo')});

    model.setValue(10);

    expect(model.state.value).toEqual(10);
  })

  test('Should not update wrong value', (): void => {
    const model = new Model({parentElement: $('.foo')});

    model.setValue(10000);

    expect(model.state.value).toEqual(100);
  })

  test('Should not update wrong value', (): void => {
    const model = new Model({parentElement: $('.foo')});

    model.setValue(-10000);

    expect(model.state.value).toEqual(0);
  })

  test('Should update interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval'});

    model.setValue([5, 10]);

    expect(model.state.value).toEqual([5, 10]);
  })

  test('Should update and correct interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5});

    model.setValue([6, 9]);

    expect(model.state.value).toEqual([5, 10]);
  })

  test('Should correct interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval'});

    model.setValue([10, 15]);
    model.setValue([10, 9], 'max');
    model.setValue([10, 1], 'max');

    expect(model.state.value).toEqual([10, 10]);
  })

  test('Should correct interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval'});

    model.setValue([5, 9]);
    model.setValue([10, 9]);

    expect(model.state.value).toEqual([9, 9]);
  })

  test('Should set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [50, 55]});

    model.setValue([5, 70]);

    expect(model.state.value).toEqual([5, 70]);
  })

  test('Should set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue([30, 35]);

    expect(model.state.value).toEqual([30, 35]);
  })

  test('Should set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue([70, 70]);

    expect(model.state.value).toEqual([70, 70]);
  })

  test('Should set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue([5, 50]);

    expect(model.state.value).toEqual([5, 50]);
  })

  test('Should set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue([50, 72]);

    expect(model.state.value).toEqual([50, 70]);
  })

  test('Should set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue([-50, 110]);

    expect(model.state.value).toEqual([0, 100]);
  })

  test('Should not set interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60], maxValue: 90});

    model.setValue([100, 100]);

    expect(model.state.value).toEqual([90, 90]);
  })

  test('Should set and correct interval value', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue([33, 36]);

    expect(model.state.value).toEqual([35, 35]);
  })

  test('Should set one value for interval slider', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue(51);

    expect(model.state.value).toEqual([10, 50]);
  })

  test('Should set one value for interval slider', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue(21);

    expect(model.state.value).toEqual([20, 60]);
  })

  test('Should not set one value for interval slider', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue(150);

    expect(model.state.value).toEqual([10, 100]);
  })

  test('Should not set one value for interval slider', (): void => {
    const model = new Model({parentElement: $('.foo'), type: 'interval', step: 5, value: [10, 60]});

    model.setValue(-10);

    expect(model.state.value).toEqual([0, 60]);
  })
});