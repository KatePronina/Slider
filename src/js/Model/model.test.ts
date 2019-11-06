import Model from './Model';

beforeEach((): void => {
  document.body.innerHTML = '<div id="foo"></div>';
});

describe('Constructor', (): void => {
  test('Should set custom settings', (): void => {
    const model = new Model({
      type: 'interval',
      value: [14, 19],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });

    const state = model.getState();

    expect(state.type).toEqual('interval');
    expect(state.value).toEqual([15, 20]);
    expect(state.minValue).toEqual(5);
    expect(state.maxValue).toEqual(30);
    expect(state.step).toEqual(5);
    expect(state.direction).toEqual('vertical');
    expect(state.hint).toEqual(false);
    expect(state.scale).toEqual(true);
    expect(state.positionLength).toEqual([40, 60]);
  });
});

describe('Setting value', (): void => {
  test('Should update value', (): void => {
    const model = new Model({
      type: 'single',
      value: [15],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [10] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([10]);
  });

  test('Should not update wrong value', (): void => {
    const model = new Model({
      type: 'single',
      value: [15],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [10000] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([30]);
  });

  test('Should not update wrong value', (): void => {
    const model = new Model({
      type: 'single',
      value: [15],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [-10000] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([5]);
  });

  test('Should update interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [15, 20],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });

    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [5, 10] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([5, 10]);
  });

  test('Should update and correct interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [15, 20],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [6, 9] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([5, 10]);
  });

  test('Should set interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [15, 20],
      minValue: 0,
      maxValue: 100,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [5, 70] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([5, 70]);
  });

  test('Should set interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 300,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [70, 70] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([70, 70]);
  });

  test('Should set interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [15, 20],
      minValue: 5,
      maxValue: 300,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [5, 50] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([5, 50]);
  });

  test('Should set interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 300,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [50, 72] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([50, 70]);
  });

  test('Should set interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [15, 20],
      minValue: 0,
      maxValue: 100,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [-50, 110] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([0, 100]);
  });

  test('Should not set interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 90,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [100, 100] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([90, 90]);
  });

  test('Should set and correct interval value', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 100,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [33, 36] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([35, 35]);
  });

  test('Should set one value for interval slider', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 100,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [51] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([10, 50]);
  });

  test('Should set one value for interval slider', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 300,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [21] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([20, 60]);
  });

  test('Should not set one value for interval slider', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 5,
      maxValue: 100,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [150] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([10, 100]);
  });

  test('Should not set one value for interval slider', (): void => {
    const model = new Model({
      type: 'interval',
      value: [10, 60],
      minValue: 0,
      maxValue: 100,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({ ...settings, value: [-10] }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([0, 60]);
  });
});

describe('Setting state', (): void => {
  test('Should update state', (): void => {
    const model = new Model({
      type: 'single',
      value: [15],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    model.dispatchState({
      type: 'interval',
      value: [10],
      minValue: 0,
      maxValue: 35,
      step: 5,
      direction: 'vertical',
      hint: true,
      scale: false,
    }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([10, 30]);
    expect(newSettings.type).toEqual('interval');
    expect(newSettings.minValue).toEqual(0);
    expect(newSettings.maxValue).toEqual(35);
    expect(newSettings.step).toEqual(5);
    expect(newSettings.direction).toEqual('vertical');
    expect(newSettings.hint).toEqual(true);
    expect(newSettings.scale).toEqual(false);
    expect(newSettings.positionLength).toBeInstanceOf(Array);
  });

  test('Should update state', (): void => {
    const model = new Model({
      type: 'single',
      value: [15],
      minValue: 5,
      maxValue: 30,
      step: 5,
      direction: 'vertical',
      hint: false,
      scale: true,
    });
    model.subscribe(() => {}, 'stateUpdated');

    const settings = model.getState();
    model.dispatchState({
      ...settings,
      step: 6,
    }, 'stateUpdated');

    const newSettings = model.getState();

    expect(newSettings.value).toEqual([17]);
    expect(newSettings.step).toEqual(6);
  });
});
