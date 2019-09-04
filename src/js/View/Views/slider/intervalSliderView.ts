import ISliderSettings from '../../../Interfaces/view/ISliderSettings';
import constants from '../../../constants';
import ComponentSliderView from './ComponentSliderView';

class IntervalSliderView extends ComponentSliderView {
  public minPointDOMElement: HTMLElement | null;
  public maxPointDOMElement: HTMLElement | null;

  private minPercent: number;
  private maxPercent: number;
  private isMinMouseDown: boolean;
  private isMaxMouseDown: boolean;

  public constructor({ direction, minValue, maxValue, value }: ISliderSettings) {
    super();
    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = value;
    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;
    this.createDOMElement();
  }

  private templateHorizontal = require('./templates/intervalHorizontal.hbs');

  private templateVertical = require('./templates/intervalVertical.hbs');

  public onChangedValue(value: number[]): void {
    this.value = value;
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.minPointDOMElement && (this.minPointDOMElement.style.top = `${this.countLength(value[constants.VALUE_START]) - (this.pointOffset * 100)}%`);
      this.maxPointDOMElement && (this.maxPointDOMElement.style.top = `${this.countLength(value[constants.VALUE_END]) - (this.pointOffset * 100)}%`);
      if (this.barDOMElement) {
        this.barDOMElement.style.top = `${this.countLength(value[constants.VALUE_START])}%`;
        this.barDOMElement.style.height = `${this.countLength(value[constants.VALUE_END]) - this.countLength(value[constants.VALUE_START])}%`;
      }
    } else {
      this.minPointDOMElement && (this.minPointDOMElement.style.left = `${this.countLength(value[constants.VALUE_START]) - (this.pointOffset * 100)}%`);
      this.maxPointDOMElement && (this.maxPointDOMElement.style.left = `${this.countLength(value[constants.VALUE_END]) - (this.pointOffset * 100)}%`);
      if (this.barDOMElement) {
        this.barDOMElement.style.left = `${this.countLength(value[constants.VALUE_START])}%`;
        this.barDOMElement.style.width = `${this.countLength(value[constants.VALUE_END]) - this.countLength(value[constants.VALUE_START])}%`;
      }
    }
  }

  public onNewValue = (value: number[], valueType: string): void => {};

  private createDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    if (this.direction === constants.DIRECTION_VERTICAL) {
      sliderElement.innerHTML = this.templateVertical();
    } else {
      sliderElement.innerHTML = this.templateHorizontal();
    }

    this.DOMElement = sliderElement;
    this.barDOMElement = sliderElement.querySelector('.slider__bar');
    this.stripDOMElement = sliderElement.querySelector('.slider');
    this.minPointDOMElement = sliderElement.querySelector('.slider__point_min');
    this.maxPointDOMElement = sliderElement.querySelector('.slider__point_max');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.minPointDOMElement && this.minPointDOMElement.addEventListener('mousedown', this.onMinPointMouseDown);
    this.maxPointDOMElement && this.maxPointDOMElement.addEventListener('mousedown', this.onMaxPointMouseDown);
  }

  private onMinPointMouseDown = (): void => {
    this.isMinMouseDown = true;

    this.bindEventsToDocument();

    this.minPointDOMElement && this.minPointDOMElement.classList.add(constants.POINT_ACTIVE_CLASS);
    this.maxPointDOMElement && this.maxPointDOMElement.classList.remove(constants.POINT_ACTIVE_CLASS);
  }

  private onMaxPointMouseDown = (): void => {
    this.isMaxMouseDown = true;

    this.bindEventsToDocument();

    this.minPointDOMElement && this.minPointDOMElement.classList.remove(constants.POINT_ACTIVE_CLASS);
    this.maxPointDOMElement && this.maxPointDOMElement.classList.add(constants.POINT_ACTIVE_CLASS);
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
    const eventCoordinate = this.direction === constants.DIRECTION_VERTICAL ? event.pageY - this.offset : event.pageX - this.offset;

    if (this.isMinMouseDown) {
      this.minPercent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      (this.value as number[])[constants.VALUE_START] = this.countValue(this.minPercent);
      this.onNewValue((this.value as number[]), constants.VALUE_TYPE_MIN);
    }

    if (this.isMaxMouseDown) {
      this.maxPercent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      (this.value as number[])[constants.VALUE_END] = this.countValue(this.maxPercent);
      this.onNewValue((this.value as number[]), constants.VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;
