import IFullSettings from '../Interfaces/IFullSettings';
import Controller from './Controller';

const $ = require('jquery');
(window as any).$ = $;

const mockData: IFullSettings = {
  $parentElement: $('div'),
  type: 'single',
  minValue: 0,
  maxValue: 100,
  value: [0],
  step: 1,
  direction: 'horizontal',
  hint: true,
  scale: false,
  positionLength: [0],
  positionPercent: [0],
};

const modelData = {
  direction: 'horizontal',
  hint: true,
  maxValue: 100,
  minValue: 0,
  positionLength: [0],
  scale: false,
  step: 1,
  type: 'single',
  value: [0],
};

const controller = new Controller(mockData);

describe('notifySubscribers', () => {
  it('Should send notification about new state', () => {
    const spy = jest.spyOn(controller, 'notify');
    const mockSubscriber = jest.fn();
    controller.subscribe(mockSubscriber, 'stateUpdated');

    controller.notifySubscribers('stateUpdated');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('stateUpdated', modelData);
    expect(mockSubscriber).toHaveBeenCalled();
    expect(mockSubscriber).toHaveBeenCalledWith(modelData);
  });

  it('Should send notification about new position', () => {
    const spy = jest.spyOn(controller, 'notify');
    const mockSubscriber = jest.fn();
    controller.subscribe(mockSubscriber, 'positionPercentUpdated');

    controller.notifySubscribers('positionPercentUpdated');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('positionPercentUpdated', modelData);
    expect(mockSubscriber).toHaveBeenCalled();
    expect(mockSubscriber).toHaveBeenCalledWith(modelData);
  });
});

describe('Updating state', () => {
  it('Should update state', () => {
    const spy = jest.spyOn(controller, 'notifySubscribers');
    const mockSubscriber = jest.fn();
    controller.subscribe(mockSubscriber, 'stateUpdated');

    controller.updateState({
      direction: 'vertical',
      eventType: 'stateUpdated',
    });

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('stateUpdated');
    expect(mockSubscriber).toHaveBeenCalledWith({
      ...modelData,
      direction: 'vertical',
      eventType: 'stateUpdated',
    });
  });
});
