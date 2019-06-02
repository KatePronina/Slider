import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class RangeSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;
  private isMouseDown: boolean;

  public constructor(state: Settings) {
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
    (point as HTMLElement).addEventListener('mousedown', this.onPointMouseDown);
    (point as HTMLElement).addEventListener('mouseup', this.onPointMouseUp);
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
      
    }
  }
}

export default RangeSliderView;