import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class RangeSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;

  public constructor(state: Settings) {
    super(state);
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
    sliderElement.innerHTML = this.template; // TO DO: add binding events
    this.sliderDOMElement = sliderElement;
  }

  public getDOMElement(): HTMLElement {
    return this.sliderDOMElement;
  }
}

export default RangeSliderView;