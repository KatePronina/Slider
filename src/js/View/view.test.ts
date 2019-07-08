import View from './view';
import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';
import HintView from './Views/hintView';
import ScaleView from './Views/scaleView';
import configurationView from './Views/configurationView';

describe('Constructor', (): void => {
  test('Should create right slider view', (): void => {
    document.body.innerHTML = '<div id="bar"></div>';

    const view = new View({parentId: 'bar', 
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(view.slider).toEqual(expect.any(RangeSliderView));
  })

  // TO DO: add getDOMElement to IntervalSLider view

  test('Should create right slider view for interval', (): void => {
    document.body.innerHTML = '<div id="bar"></div>';

    const view = new View({parentId: 'bar', 
                          type: 'interval',
                          minValue: 0,
                          maxValue: 100,
                          value: [0, 1],
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(view.slider).toEqual(expect.any(IntervalSliderView));
  })

  test('Should create hint', (): void => {
    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(view.hint).toEqual(expect.any(HintView));
  })

  test('Should not create hint', (): void => {
    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: false,
                          scale: false,
                          configuration: false,
                        });

    expect(view.hint).toBeUndefined();
  })

  test('Should create scale', (): void => {
    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: true,
                          configuration: false,
                        });

    expect(view.scale).toEqual(expect.any(ScaleView));
  })

  test('Should not create scale', (): void => {
    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(view.scale).toBeUndefined();
  })

  test('Should create configuration panel', (): void => {;
    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: true,
                        });

    expect(view.configuration).toEqual(expect.any(configurationView));
  })

  test('Should not create configuration panel', (): void => {
    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(view.configuration).toBeUndefined();
  })

  test('Should save parent element', (): void => {
    document.body.innerHTML = '<div id="bar"></div>';

    const view = new View({parentId: 'bar',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(view.parentElement).toBeDefined();
    expect(view.parentElement).toEqual(expect.anything());
  })
});

describe('DOM actions', (): void => {
  test('Should add slider in DOM', (): void => {
    document.body.innerHTML = '<div id="first-slider"></div>';

    const view = new View({parentId: 'first-slider',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(document.querySelectorAll('#first-slider .slider-wrapper').length).toEqual(1);
    expect(document.querySelectorAll('#first-slider .slider').length).toEqual(1);
    expect(document.querySelectorAll('#first-slider .slider__bar').length).toEqual(1);
    expect(document.querySelectorAll('#first-slider .slider__point').length).toEqual(1);
  })

  test('Should add hint in DOM with correct value', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo', 
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(1);
    expect((document.querySelector('#foo .slider__hint') as HTMLElement).textContent).toEqual('0');
  })

  test('Should not add hint in DOM', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 0,
                          maxValue: 100,
                          value: 0,
                          step: 1,
                          direction: 'horizontal',
                          hint: false,
                          scale: false,
                          configuration: false,
                        });

    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(0);
  })

  test('Should add hints in DOM for interval', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'interval',
                          minValue: 0,
                          maxValue: 100,
                          value: [2, 5],
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: false,
                          configuration: false,
                        });

    expect(document.querySelectorAll('#foo .slider__hint').length).toEqual(2);
  })

  test('Should add configuration with correct values', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 0,
                          maxValue: 95,
                          value: 6,
                          step: 3,
                          direction: 'vertical',
                          hint: true,
                          scale: false,
                          configuration: true,
                        });

    expect((document.getElementById('currentValue') as HTMLInputElement).value).toEqual('6');
    expect((document.getElementById('stepSize') as HTMLInputElement).value).toEqual('3');
    expect((document.getElementById('minValue') as HTMLInputElement).value).toEqual('0');
    expect((document.getElementById('maxValue') as HTMLInputElement).value).toEqual('95');
    expect((document.getElementById('toggleHint') as HTMLInputElement).checked).toEqual(true);
    expect((document.getElementById('toggleScale') as HTMLInputElement).checked).toEqual(false);
    expect((document.getElementById('toggleType') as HTMLInputElement).checked).toEqual(false);
    expect((document.getElementById('toggleVertical') as HTMLInputElement).checked).toEqual(true);
  })

  test('Should add configuration with correct values fot interval slider', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'interval',
                          minValue: 10,
                          maxValue: 95,
                          value: [13, 95],
                          step: 3,
                          direction: 'horizontal',
                          hint: false,
                          scale: true,
                          configuration: true,
                        });

    expect((document.getElementById('currentMinValue') as HTMLInputElement).value).toEqual('13');
    expect((document.getElementById('currentMaxValue') as HTMLInputElement).value).toEqual('95');
    expect((document.getElementById('stepSize') as HTMLInputElement).value).toEqual('3');
    expect((document.getElementById('minValue') as HTMLInputElement).value).toEqual('10');
    expect((document.getElementById('maxValue') as HTMLInputElement).value).toEqual('95');
    expect((document.getElementById('toggleHint') as HTMLInputElement).checked).toEqual(false);
    expect((document.getElementById('toggleScale') as HTMLInputElement).checked).toEqual(true);
    expect((document.getElementById('toggleType') as HTMLInputElement).checked).toEqual(true);
    expect((document.getElementById('toggleVertical') as HTMLInputElement).checked).toEqual(false);
  })

  test('Should hide hint', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 10,
                          maxValue: 95,
                          value: 10,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: true,
                          configuration: true,
                        });
    
    const event = new Event('click');
    (document.getElementById('toggleHint') as HTMLInputElement).dispatchEvent(event);

    expect((document.querySelector('.slider__hint') as HTMLElement).classList.contains('slider__hint--disable')).toEqual(true);
  })

  test('Should show hint', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 10,
                          maxValue: 95,
                          value: 10,
                          step: 1,
                          direction: 'horizontal',
                          hint: false,
                          scale: true,
                          configuration: true,
                        });
    
    const event = new Event('click');
    (document.getElementById('toggleHint') as HTMLInputElement).dispatchEvent(event);

    expect((document.querySelector('.slider__hint') as HTMLElement).classList.contains('slider__hint--disable')).toEqual(false);
  })

  test('Should hide scale', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 10,
                          maxValue: 95,
                          value: 10,
                          step: 1,
                          direction: 'horizontal',
                          hint: true,
                          scale: true,
                          configuration: true,
                        });
    
    const event = new Event('click');
    (document.getElementById('toggleScale') as HTMLInputElement).dispatchEvent(event);

    expect((document.querySelector('.slider__scale') as HTMLElement).classList.contains('slider__scale--disable')).toEqual(true);
  })

  test('Should show hint', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 10,
                          maxValue: 95,
                          value: 10,
                          step: 1,
                          direction: 'horizontal',
                          hint: false,
                          scale: false,
                          configuration: true,
                        });
    
    const event = new Event('click');
    (document.getElementById('toggleScale') as HTMLInputElement).dispatchEvent(event);

    expect((document.querySelector('.slider__scale') as HTMLElement).classList.contains('slider__scale--disable')).toEqual(false);
  })

  test('Should change slider direction from horizontal to vertical', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 10,
                          maxValue: 95,
                          value: 10,
                          step: 1,
                          direction: 'horizontal',
                          hint: false,
                          scale: false,
                          configuration: true,
                        });
    
    const event = new Event('click');
    (document.getElementById('toggleVertical') as HTMLInputElement).dispatchEvent(event);

    expect((document.querySelector('.slider') as HTMLElement).classList.contains('slider--vertical')).toEqual(true);
  })

  test('Should change slider direction from vertical to horizontal', (): void => {
    document.body.innerHTML = '<div id="foo"></div>';

    const view = new View({parentId: 'foo',
                          type: 'range',
                          minValue: 10,
                          maxValue: 95,
                          value: 10,
                          step: 1,
                          direction: 'vertical',
                          hint: false,
                          scale: false,
                          configuration: true,
                        });
    
    const event = new Event('click');
    (document.getElementById('toggleVertical') as HTMLInputElement).dispatchEvent(event);

    expect((document.querySelector('.slider') as HTMLElement).classList.contains('slider--vertical')).toEqual(false);
  })
});

