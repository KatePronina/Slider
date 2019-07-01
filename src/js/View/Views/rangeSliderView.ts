import ComponentSlider from './componentSliderView';
import {FullSettings} from '../../application.interfaces';

class RangeSliderView extends ComponentSlider {
  public sliderPointDOMElement: HTMLElement | null;
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
    this.sliderStripDOMElement = sliderElement.querySelector('.slider');
    this.bindEventsToSlider(sliderElement);
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

  public onNewValue(value: number): void {

  }
}

export default RangeSliderView;