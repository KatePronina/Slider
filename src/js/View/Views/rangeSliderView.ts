import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class RangeSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;
  public sliderWidth: number;
  public sliderOffsetLeft: number;

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
    this.bindEventsToSlider(sliderElement);
    this.sliderDOMElement = sliderElement;
  }

  public getDOMElement(): HTMLElement {
    return this.sliderDOMElement;
  }

  public bindEventsToSlider(sliderElement: HTMLElement): void {
    const point = sliderElement.querySelector('.slider__point');
    (point as HTMLElement).addEventListener('mousedown', (): void => {
      this.onPointMouseDown();
    });
    (point as HTMLElement).addEventListener('mouseup', (): void => {
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
      const percent: number = this.countPercent(EventX, this.sliderWidth);
      const value = percent * (this.state.maxValue - this.state.minValue) + this.state.minValue;
    }
  }

  private countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    return percent;
  }
}

export default RangeSliderView;