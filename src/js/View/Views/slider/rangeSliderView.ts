import sliderOptions from '../../../sliderOptions';
import IFullSettings from '../../../application.interfaces';
import ComponentSlider from './componentSliderView';

class RangeSliderView extends ComponentSlider {
  public pointDOMElement: HTMLElement | null;

  public percent: number;

  private isMouseDown: boolean;

  public constructor({
              direction,
              minValue,
              maxValue,
              value,
            }: IFullSettings) {
    super();
    this.state = {
              direction,
              minValue,
              maxValue,
              value,
            };
    this.isMouseDown = false;
    this.createSliderDOMElement();
  }

  private templateHorizontal: string =
      '<div class="slider">'
        + '<div class="slider__bar"></div>'
        + '<div class="slider__point"></div>'
      + '</div>';

  private templateVertical: string =
  '<div class="slider slider_vertical">'
    + '<div class="slider__bar slider__bar_vertical"></div>'
    + '<div class="slider__point slider__point_vertical"></div>'
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

    this.bindEventsToDocument();
  }

  private onDocumentMouseUp(): void {
    this.isMouseDown = false;

    $(document).off('mousemove');
    $(document).off('mouseup');
  }

  private bindEventsToDocument(): void {
    $(document).on('mousemove', this.onDocumentMouseMove.bind(this));
    $(document).on('mouseup', this.onDocumentMouseUp.bind(this));
  }

  public onDocumentMouseMove(event: MouseEvent): void {
    if (this.isMouseDown) {
      let eventCoordinate = event.pageX - this.offset;
      if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
        eventCoordinate = event.pageY - this.offset;
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

  public onNewValue = (value: number): void => {}
}

export default RangeSliderView;
