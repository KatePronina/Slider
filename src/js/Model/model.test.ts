

test('Should set default settings', (): void => {
  const model = new Model({parentId: 'id'});

  expect(model.parentId).toEqual('id');
  expect(model.type).toEqual('range');
  expect(model.minValue).toEqual(0);
  expect(model.maxValue).toEqual(100);
  expect(model.value).toEqual(model.minValue);
  expect(model.step).toEqual(1);
  expect(model.direction).toEqual('horizontal');
  expect(model.hint).toEqual('yes');
  expect(model.configure).toEqual('no');
})

test('Should set custom settings', (): void => {
  const model = new Model({
    parentId: 'id',
    type: 'interval',
    minValue: 5,
    maxValue: 30,
    value: [20, 25],
    step: 5,
    direction: 'vertical',
    hint: 'no',
    configure: 'yes',
  });

  expect(model.parentId).toEqual('id');
  expect(model.type).toEqual('interval');
  expect(model.minValue).toEqual(5);
  expect(model.maxValue).toEqual(30);
  expect(model.value).toEqual([20, 25]);
  expect(model.step).toEqual(5);
  expect(model.direction).toEqual('vertical');
  expect(model.hint).toEqual('no');
  expect(model.configure).toEqual('yes');
})