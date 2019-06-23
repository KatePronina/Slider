import Model from './model';
import {FullSettings, Settings} from '../application.interfaces';

test('Should set default settings', (): void => {
  const model = new Model({parentId: 'foo'});

  expect(model.state.parentId).toEqual('foo');
  expect(model.state.type).toEqual('range');
  expect(model.state.minValue).toEqual(0);
  expect(model.state.maxValue).toEqual(100);
  expect(model.state.value).toEqual(model.state.minValue);
  expect(model.state.step).toEqual(1);
  expect(model.state.direction).toEqual('horizontal');
  expect(model.state.hint).toEqual(true);
  expect(model.state.scale).toEqual(false);
  expect(model.state.configure).toEqual(false);
})

test('Should set custom settings', (): void => {
  const model = new Model({
    parentId: 'bar',
    type: 'interval',
    minValue: 5,
    maxValue: 30,
    step: 5,
    direction: 'vertical',
    hint: false,
    scale: true,
    configure: true,
  });

  expect(model.state.parentId).toEqual('bar');
  expect(model.state.type).toEqual('interval');
  expect(model.state.minValue).toEqual(5);
  expect(model.state.maxValue).toEqual(30);
  expect(model.state.step).toEqual(5);
  expect(model.state.direction).toEqual('vertical');
  expect(model.state.hint).toEqual(false);
  expect(model.state.scale).toEqual(true);
  expect(model.state.configure).toEqual(true);
})

test('Should update value', (): void => {
  const model = new Model({parentId: 'foo'});

  model.setValue(10);

  expect(model.state.value).toEqual(10);
})

test('Should not update wrong value', (): void => {
  const model = new Model({parentId: 'foo'});

  model.setValue(10000);

  expect(model.state.value).toEqual(100);
})

test('Should not update wrong value', (): void => {
  const model = new Model({parentId: 'foo'});

  model.setValue(-10000);

  expect(model.state.value).toEqual(0);
})