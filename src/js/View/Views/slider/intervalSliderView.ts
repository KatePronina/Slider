import IFullSettings from '../../../IFullSettings';
import constants from '../../../constants';
import ComponentSliderView from './ComponentSliderView';

class IntervalSliderView extends ComponentSliderView {
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

  private templateHorizontal = require('./templates/intervalHorizontal.hbs');

  private templateVertical = require('./templates/intervalVertical.hbs');

  public onChangedValue(value: number[]): void {
    this.state.value = value;
    if (this.state.direction === constants.DIRECTION_VERTICAL) {
      (this.minPointDOMElement as HTMLElement).style.top = `${this.countLength(value[constants.VALUE_START]) - (this.pointOffset * 100)}%`;
      (this.maxPointDOMElement as HTMLElement).style.top = `${this.countLength(value[constants.VALUE_END]) - (this.pointOffset * 100)}%`;
      (this.barDOMElement as HTMLElement).style.top = `${this.countLength(value[constants.VALUE_START])}%`;
      (this.barDOMElement as HTMLElement).style.height = `${this.countLength(value[constants.VALUE_END]) - this.countLength(value[constants.VALUE_START])}%`;
    } else {
      (this.minPointDOMElement as HTMLElement).style.left = `${this.countLength(value[constants.VALUE_START]) - (this.pointOffset * 100)}%`;
      (this.maxPointDOMElement as HTMLElement).style.left = `${this.countLength(value[constants.VALUE_END]) - (this.pointOffset * 100)}%`;
      (this.barDOMElement as HTMLElement).style.left = `${this.countLength(value[constants.VALUE_START])}%`;
      (this.barDOMElement as HTMLElement).style.width = `${this.countLength(value[constants.VALUE_END]) - this.countLength(value[constants.VALUE_START])}%`;
    }
  }

  public onNewValue = (value: number[], valueType: string): void => {};

  private createDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    if (this.state.direction === constants.DIRECTION_VERTICAL) {
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
    (this.minPointDOMElement as HTMLElement).addEventListener('mousedown', this.onMinPointMouseDown);
    (this.maxPointDOMElement as HTMLElement).addEventListener('mousedown', this.onMaxPointMouseDown);
  }

  private onMinPointMouseDown = (): void => {
    this.isMinMouseDown = true;

    this.bindEventsToDocument();

    (this.minPointDOMElement as HTMLElement).classList.add(constants.POINT_ACTIVE_CLASS);
    (this.maxPointDOMElement as HTMLElement).classList.remove(constants.POINT_ACTIVE_CLASS);
  }

  private onMaxPointMouseDown = (): void => {
    this.isMaxMouseDown = true;

    this.bindEventsToDocument();

    (this.minPointDOMElement as HTMLElement).classList.remove(constants.POINT_ACTIVE_CLASS);
    (this.maxPointDOMElement as HTMLElement).classList.add(constants.POINT_ACTIVE_CLASS);
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
    const eventCoordinate = this.state.direction === constants.DIRECTION_VERTICAL ? event.pageY - this.offset : event.pageX - this.offset;

    if (this.isMinMouseDown) {
      this.minPercent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      (this.state.value as number[])[constants.VALUE_START] = this.countValue(this.minPercent);
      this.onNewValue((this.state.value as number[]), constants.VALUE_TYPE_MIN);
    }

    if (this.isMaxMouseDown) {
      this.maxPercent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      (this.state.value as number[])[constants.VALUE_END] = this.countValue(this.maxPercent);
      this.onNewValue((this.state.value as number[]), constants.VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;
