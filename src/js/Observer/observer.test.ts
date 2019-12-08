import Observer from './Observer';

describe('Adding subscribers', () => {
  it('Should subscribe callback to new event', () => {
    const observer = new Observer();
    const mockCallback = jest.fn();

    observer.subscribe(mockCallback, 'stateUpdated');
    observer.notify('stateUpdated', { direction: 'vertical' });

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalledWith({ direction: 'vertical' });
  });

  it('Should subscribe callback to existing event', () => {
    const observer = new Observer();
    const mockCallback = jest.fn();
    const secondMockCallback = jest.fn();

    observer.subscribe(mockCallback, 'stateUpdated');
    observer.subscribe(secondMockCallback, 'stateUpdated');
    observer.notify('stateUpdated', { direction: 'vertical' });

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalledWith({ direction: 'vertical' });
    expect(secondMockCallback).toBeCalled();
    expect(secondMockCallback).toHaveBeenCalledWith({ direction: 'vertical' });
  });
});
