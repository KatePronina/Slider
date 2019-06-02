import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class RangeSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;
  public sliderBarDOMElement: HTMLElement | null;
  public sliderPointDOMElement: HTMLElement | null;

  public sliderWidth: number;
  public sliderOffsetLeft: number;
  public pointWidth: number;
  public pointOffset: number;
  public percent: number;

  private isMouseDown: boolean;

  public constructor(state: FullSettings) {
    super(state);
    this.isMouseDown = false;
    this.createSliderDOMElement();
  }

  private template: string = 
      '<div class="slider">' +
        '<div class="slider__bar"></div>' +
        '<div class="slider__point"></div>' +
      '</div>';
  
  public createSliderDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');
    sliderElement.innerHTML = this.template;
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

  public onPointMouseDown(): void {
    this.isMouseDown = true;
  }

  public onPointMouseUp(): void {
    this.isMouseDown = false;
  }

  public onDocumentMouseMove(e: MouseEvent): void {
    if (this.isMouseDown) {
      const EventX: number = e.pageX - this.sliderOffsetLeft;
      this.percent = this.countPercent(EventX, this.sliderWidth);
      const value: number = parseInt(((this.percent * (this.state.maxValue - this.state.minValue) + this.state.minValue)).toFixed());
      this.onNewValue(value);
    }
  }

  public onChangedValue(value: number | number[]): void {
    (this.sliderBarDOMElement as HTMLElement).style.width = (this.percent * 100) + '%';
    (this.sliderPointDOMElement as HTMLElement).style.left = (this.percent * 100) - (this.pointOffset * 100) + '%';
  }

  public onNewValue(value: number): void {

  }

  private countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    return percent;
  }
}

export default RangeSliderView;