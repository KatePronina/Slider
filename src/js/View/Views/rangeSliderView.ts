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
  public percentStep: number;

  private isMouseDown: boolean;

  public constructor(state: FullSettings) {
    super(state);
    this.isMouseDown = false;
    this.percentStep = 100 / (((this.state.maxValue - this.state.minValue) / this.state.step));
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

      this.onNewValue(this.countValue(this.percent));
    }
  }

  public onChangedValue(value: number): void {
    (this.sliderBarDOMElement as HTMLElement).style.width = this.countWidth(value) + '%';
    (this.sliderPointDOMElement as HTMLElement).style.left = this.countWidth(value) - (this.pointOffset * 100) + '%';
  }

  public countWidth(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  public onNewValue(value: number): void {

  }

  public setStartValueWidth(): void {
    (this.sliderBarDOMElement as HTMLElement).style.width = this.startValueWidth() + '%';
    (this.sliderPointDOMElement as HTMLElement).style.left = this.startValueWidth() - (this.pointOffset * 100) + '%';
  }

  public startValueWidth(): number {
    return (((this.state.value as number) - this.state.minValue) / (this.state.maxValue - this.state.minValue)) * 100;
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
}

export default RangeSliderView;