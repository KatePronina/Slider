import IFullSettings from '../../../application.interfaces';
import sliderOptions from '../../../sliderOptions';
import ComponentSlider from './componentSliderView';

class IntervalSliderView extends ComponentSlider {
  public minPointDOMElement: HTMLElement | null;

  public maxPointDOMElement: HTMLElement | null;

  private minPercent: number;

  private maxPercent: number;

  private isMinMouseDown: boolean;

  private isMaxMouseDown: boolean;

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
    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;
    this.createDOMElement();
  }

  private templateHorizontal: string =
  '<div class="slider">'
    + '<div class="slider__bar"></div>'
    + '<div class="slider__point slider__point_min"></div>'
    + '<div class="slider__point slider__point_max"></div>'
  + '</div>';

  private templateVertical: string =
  '<div class="slider slider_vertical">'
    + '<div class="slider__bar slider__bar_vertical"></div>'
    + '<div class="slider__point slider__point_vertical slider__point_min"></div>'
    + '<div class="slider__point slider__point_vertical slider__point_max"></div>'
  + '</div>';

  public onChangedValue(value: number[]): void {
    this.state.value = value;
    if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
      (this.minPointDOMElement as HTMLElement).style.top = `${this.countLength(value[sliderOptions.VALUE_START]) - (this.pointOffset * 100)}%`;
      (this.maxPointDOMElement as HTMLElement).style.top = `${this.countLength(value[sliderOptions.VALUE_END]) - (this.pointOffset * 100)}%`;
      (this.barDOMElement as HTMLElement).style.top = `${this.countLength(value[sliderOptions.VALUE_START])}%`;
      (this.barDOMElement as HTMLElement).style.height = `${this.countLength(value[sliderOptions.VALUE_END]) - this.countLength(value[sliderOptions.VALUE_START])}%`;
    } else {
      (this.minPointDOMElement as HTMLElement).style.left = `${this.countLength(value[sliderOptions.VALUE_START]) - (this.pointOffset * 100)}%`;
      (this.maxPointDOMElement as HTMLElement).style.left = `${this.countLength(value[sliderOptions.VALUE_END]) - (this.pointOffset * 100)}%`;
      (this.barDOMElement as HTMLElement).style.left = `${this.countLength(value[sliderOptions.VALUE_START])}%`;
      (this.barDOMElement as HTMLElement).style.width = `${this.countLength(value[sliderOptions.VALUE_END]) - this.countLength(value[sliderOptions.VALUE_START])}%`;
    }
  }

  public onNewValue = (value: number[], valueType: string): void => {}

  private createDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
      sliderElement.innerHTML = this.templateVertical;
    } else {
      sliderElement.innerHTML = this.templateHorizontal;
    }

    this.DOMElement = sliderElement;
    this.barDOMElement = sliderElement.querySelector('.slider__bar');
    this.stripDOMElement = sliderElement.querySelector('.slider');
    this.minPointDOMElement = sliderElement.querySelector('.slider__point_min');
    this.maxPointDOMElement = sliderElement.querySelector('.slider__point_max');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    (this.minPointDOMElement as HTMLElement).addEventListener('mousedown', this.onMinPointMouseDown);
    (this.maxPointDOMElement as HTMLElement).addEventListener('mousedown', this.onMaxPointMouseDown);
  }

  private onMinPointMouseDown = (): void => {
    this.isMinMouseDown = true;

    this.bindEventsToDocument();

    (this.minPointDOMElement as HTMLElement).style.zIndex = '2';
    (this.maxPointDOMElement as HTMLElement).style.zIndex = '1';
  }

  private onMaxPointMouseDown = (): void => {
    this.isMaxMouseDown = true;

    this.bindEventsToDocument();

    (this.minPointDOMElement as HTMLElement).style.zIndex = '1';
    (this.maxPointDOMElement as HTMLElement).style.zIndex = '2';
  }

  private bindEventsToDocument(): void {
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
  }

  private onDocumentMouseUp = (): void => {
    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;

    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }

  private onDocumentMouseMove = (event: MouseEvent): void => {
    if (this.isMinMouseDown) {
      let eventCoordinate = event.pageX - this.offset;
      if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
        eventCoordinate = event.pageY - this.offset;
      }

      this.minPercent = ComponentSlider.countPercent(eventCoordinate, this.length);
      (this.state.value as number[])[sliderOptions.VALUE_START] = this.countValue(this.minPercent);
      this.onNewValue((this.state.value as number[]), sliderOptions.VALUE_TYPE_MIN);
    }

    if (this.isMaxMouseDown) {
      let eventCoordinate = event.pageX - this.offset;
      if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
        eventCoordinate = event.pageY - this.offset;
      }

      this.maxPercent = ComponentSlider.countPercent(eventCoordinate, this.length);
      (this.state.value as number[])[sliderOptions.VALUE_END] = this.countValue(this.maxPercent);
      this.onNewValue((this.state.value as number[]), sliderOptions.VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;
