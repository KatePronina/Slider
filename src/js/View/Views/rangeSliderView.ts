import IFullSettings from '../../application.interfaces';
import sliderOptions from '../../sliderOptions';
import ComponentSlider from './componentSliderView';

class RangeSliderView extends ComponentSlider {
  public pointDOMElement: HTMLElement | null;

  public percent: number;

  private isMouseDown: boolean;

  public constructor(state: IFullSettings) {
    super(state);
    this.isMouseDown = false;
    this.createSliderDOMElement();
  }

  private templateHorizontal: string =
      '<div class="slider">'
        + '<div class="slider__bar"></div>'
        + '<div class="slider__point"></div>'
      + '</div>';

  private templateVertical: string =
  '<div class="slider slider--vertical">'
    + '<div class="slider__bar slider__bar--vertical"></div>'
    + '<div class="slider__point slider__point--vertical"></div>'
  + '</div>';

  public createSliderDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
      sliderElement.innerHTML = this.templateVertical;
    } else {
      sliderElement.innerHTML = this.templateHorizontal;
    }

    this.DOMElement = sliderElement;
    this.barDOMElement = sliderElement.querySelector('.slider__bar');
    this.pointDOMElement = sliderElement.querySelector('.slider__point');
    this.stripDOMElement = sliderElement.querySelector('.slider');
    this.bindEventsToSlider();
  }

  public bindEventsToSlider(): void {
    (this.pointDOMElement as HTMLElement).addEventListener('mousedown', this.onPointMouseDown.bind(this));
  }

  private onPointMouseDown(): void {
    this.isMouseDown = true;

    $(document).on('mousemove', this.onDocumentMouseMove.bind(this));
    $(document).on('mouseup', this.onPointMouseUp.bind(this));
  }

  private onPointMouseUp(): void {
    this.isMouseDown = false;

    $(document).off('mousemove');
    $(document).off('mouseup');
  }

  public onDocumentMouseMove(e: MouseEvent): void {
    if (this.isMouseDown) {
      let eventCoordinate = e.pageX - this.offset;
      if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
        eventCoordinate = e.pageY - this.offset;
      }

      this.percent = ComponentSlider.countPercent(eventCoordinate, this.length);
      this.onNewValue(this.countValue(this.percent));
    }
  }

  public onChangedValue(value: number): void {
    if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
      (this.barDOMElement as HTMLElement).style.height = `${this.countLength(value)}%`;
      (this.pointDOMElement as HTMLElement).style.top = `${this.countLength(value) - (this.pointOffset * 100)}%`;
    } else {
      (this.barDOMElement as HTMLElement).style.width = `${this.countLength(value)}%`;
      (this.pointDOMElement as HTMLElement).style.left = `${this.countLength(value) - (this.pointOffset * 100)}%`;
    }
  }

  public onNewValue = (value: number): void => {

  }
}

export default RangeSliderView;
