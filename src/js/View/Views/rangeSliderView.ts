import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class RangeSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;
  public sliderBarDOMElement: HTMLElement | null;
  public sliderPointDOMElement: HTMLElement | null;

  public sliderLength: number;
  public sliderOffset: number;
  public pointWidth: number;
  public pointOffset: number;
  public percent: number;

  private isMouseDown: boolean;

  public constructor(state: FullSettings) {
    super(state);
    this.isMouseDown = false;
    this.createSliderDOMElement();
  }

  private templateHorizontal: string = 
      '<div class="slider">' +
        '<div class="slider__bar"></div>' +
        '<div class="slider__point"></div>' +
      '</div>';

  private templateVertical: string = 
  '<div class="slider slider--vertical">' +
    '<div class="slider__bar slider__bar--vertical"></div>' +
    '<div class="slider__point slider__point--vertical"></div>' +
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
    this.sliderPointDOMElement = sliderElement.querySelector('.slider__point');
    this.bindEventsToSlider(sliderElement);
  }

  public getDOMElement(): HTMLElement {
    return this.sliderDOMElement;
  }

  public bindEventsToSlider(sliderElement: HTMLElement): void {
    (this.sliderPointDOMElement as HTMLElement).addEventListener('mousedown', (): void => {
      this.onPointMouseDown();
    });
    (this.sliderPointDOMElement as HTMLElement).addEventListener('mouseup', (): void => {
      this.onPointMouseUp();
    });
    document.addEventListener('mousemove', (e): void => {
      this.onDocumentMouseMove(e);
    })
  }

  private onPointMouseDown(): void {
    this.isMouseDown = true;
  }

  private onPointMouseUp(): void {
    this.isMouseDown = false;
  }

  public onDocumentMouseMove(e: MouseEvent): void {
    if (this.isMouseDown) {
      let eventCoordinate = e.pageX - this.sliderOffset;
      if (this.state.direction === 'vertical') {
        eventCoordinate = e.pageY - this.sliderOffset;
      }

      this.percent = this.countPercent(eventCoordinate, this.sliderLength);
      this.onNewValue(this.countValue(this.percent));
    }
  }

  public onChangedValue(value: number): void {
    if (this.state.direction === 'vertical') {
      (this.sliderBarDOMElement as HTMLElement).style.height = this.countLength(value) + '%';
      (this.sliderPointDOMElement as HTMLElement).style.top = this.countLength(value) - (this.pointOffset * 100) + '%';
    } else {
      (this.sliderBarDOMElement as HTMLElement).style.width = this.countLength(value) + '%';
      (this.sliderPointDOMElement as HTMLElement).style.left = this.countLength(value) - (this.pointOffset * 100) + '%';
    }  
  }

  public countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  public onNewValue(value: number): void {

  }

  // public setStartValueLength(): void {
  //   if (this.state.direction === 'vertical') {
  //     (this.sliderBarDOMElement as HTMLElement).style.height = this.startValueLength() + '%';
  //     (this.sliderPointDOMElement as HTMLElement).style.top = this.startValueLength() - (this.pointOffset * 100) + '%';
  //   } else {
  //     (this.sliderBarDOMElement as HTMLElement).style.width = this.startValueLength() + '%';
  //     (this.sliderPointDOMElement as HTMLElement).style.left = this.startValueLength() - (this.pointOffset * 100) + '%';
  //   }
  // }

  // public startValueLength(): number {
  //   return (((this.state.value as number) - this.state.minValue) / (this.state.maxValue - this.state.minValue)) * 100;
  // }

  private countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    return percent;
  }

  private countValue(percent: number): number {
    return parseInt(((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue)).toFixed());  
  }
}

export default RangeSliderView;