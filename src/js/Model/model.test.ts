
test('Should set default settings', (): void => {
  const model = new Model({parentId: 'id'});

  expect(model.parentId).toEqual('id');
  expect(model.interval).toEqual(false);
  expect(model.minValue).toEqual(0);
  expect(model.maxValue).toEqual(100);
  expect(model.value).toEqual(model.minValue);
  expect(model.step).toEqual(1);
  expect(model.horizontal).toEqual(true);
  expect(model.hint).toEqual(true);
  expect(model.configure).toEqual(false);
})