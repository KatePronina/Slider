import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class IntervalSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;
  public sliderBarDOMElement: HTMLElement | null;
  public minPointDOMElement: HTMLElement | null;
  public maxPointDOMElement: HTMLElement | null;

  public sliderLength: number;
  public sliderOffset: number;
  public pointWidth: number;
  public pointOffset: number;
  public minPercent: number;
  public maxPercent: number;

  private isMinMouseDown: boolean;
  private isMaxMouseDown: boolean;

  public constructor(state: FullSettings) {
    super(state);
    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;
    this.createSliderDOMElement();
  }

  private templateHorizontal: string = 
      '<div class="slider">' +
        '<div class="slider__bar"></div>' +
        '<div class="slider__point slider__point--min"></div>' +
        '<div class="slider__point slider__point--max"></div>' +
      '</div>';

  private templateVertical: string = 
  '<div class="slider slider--vertical">' +
    '<div class="slider__bar slider__bar--vertical"></div>' +
    '<div class="slider__point slider__point--vertical slider__point--min"></div>' +
    '<div class="slider__point slider__point--vertical slider__point--max"></div>' +
  '</div>';

  public createSliderDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    if (this.state.direction === 'vertical') {
      sliderElement.innerHTML = this.templateVertical;
    } else {
      sliderElement.innerHTML = this.templateHorizontal;
    }
    
    this.sliderDOMElement = sliderElement;
    this.sliderBarDOMElement = sliderElement.querySelector('.slider__bar');
    this.minPointDOMElement = sliderElement.querySelector('.slider__point--min');
    this.maxPointDOMElement = sliderElement.querySelector('.slider__point--max');
    this.bindEventsToSlider(sliderElement);
  }

  public bindEventsToSlider(slider: HTMLElement): void {
    (this.minPointDOMElement as HTMLElement).addEventListener('mousedown', (): void => {
      this.onMinPointMouseDown();
    });

    (this.maxPointDOMElement as HTMLElement).addEventListener('mousedown', (): void => {
      this.onMaxPointMouseDown();
    });

    (this.minPointDOMElement as HTMLElement).addEventListener('mouseup', (): void => {
      this.onMinPointMouseUp();
    });

    (this.maxPointDOMElement as HTMLElement).addEventListener('mouseup', (): void => {
      this.onMaxPointMouseUp();
    });

    document.addEventListener('mousemove', (e): void => {
      this.onDocumentMouseMove(e);
    })
  }

  private onMinPointMouseDown(): void {
    this.isMinMouseDown = true;
    (this.minPointDOMElement as HTMLElement).style.zIndex = '2';
    (this.maxPointDOMElement as HTMLElement).style.zIndex = '1';
  }

  private onMaxPointMouseDown(): void {
    this.isMaxMouseDown = true;
    (this.minPointDOMElement as HTMLElement).style.zIndex = '1';
    (this.maxPointDOMElement as HTMLElement).style.zIndex = '2';
  }

  private onMinPointMouseUp(): void {
    this.isMinMouseDown = false;
  }

  private onMaxPointMouseUp(): void {
    this.isMaxMouseDown = false;
  }

  public onDocumentMouseMove(e: MouseEvent): void {
    if (this.isMinMouseDown) {
      let eventCoordinate = e.pageX - this.sliderOffset;
      if (this.state.direction === 'vertical') {
        eventCoordinate = e.pageY - this.sliderOffset;
      }

      this.minPercent = this.countPercent(eventCoordinate, this.sliderLength);
      (this.state.value as number[])[0] = this.countValue(this.minPercent); 
      this.onNewValue((this.state.value as number[]), 'min');
    }

    if (this.isMaxMouseDown) {
      let eventCoordinate = e.pageX - this.sliderOffset;
      if (this.state.direction === 'vertical') {
        eventCoordinate = e.pageY - this.sliderOffset;
      }

      this.maxPercent = this.countPercent(eventCoordinate, this.sliderLength);
      (this.state.value as number[])[1] = this.countValue(this.maxPercent);
      this.onNewValue((this.state.value as number[]), 'max');
    }
  }

  public onChangedValue(value: number[]): void {
    if (this.state.direction === 'vertical') {
      (this.minPointDOMElement as HTMLElement).style.top = this.countLength(value[0]) - (this.pointOffset * 100) + '%';
      (this.maxPointDOMElement as HTMLElement).style.top = this.countLength(value[1]) - (this.pointOffset * 100) + '%';
      (this.sliderBarDOMElement as HTMLElement).style.top = this.countLength(value[0]) + '%';
      (this.sliderBarDOMElement as HTMLElement).style.height = this.countLength(value[1]) - this.countLength(value[0]) + '%';
    } else {
      (this.minPointDOMElement as HTMLElement).style.left = this.countLength(value[0]) - (this.pointOffset * 100) + '%';
      (this.maxPointDOMElement as HTMLElement).style.left = this.countLength(value[1]) - (this.pointOffset * 100) + '%';
      (this.sliderBarDOMElement as HTMLElement).style.left = this.countLength(value[0]) + '%';
      (this.sliderBarDOMElement as HTMLElement).style.width = this.countLength(value[1]) - this.countLength(value[0]) + '%';
    }
  }

  public countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  private countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    return percent;
  }

  private countValue(percent: number): number {
    return parseInt(((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue)).toFixed());  
  }

  public getDOMElement(): HTMLElement {
    return this.sliderDOMElement;
  }

  public onNewValue(value: number[], valueType: string): void {

  }
}

export default IntervalSliderView;