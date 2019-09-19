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
    super({ direction, minValue, maxValue, value });

    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;
    this.createDOMElement();
  }

  public onChangedValue(value: number[], newPositionLength: number[]): void {
    this.value = value;
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.minPointDOMElement && (this.minPointDOMElement.style.top = `${newPositionLength[constants.VALUE_START] - (this.pointOffset * 100)}%`);
      this.maxPointDOMElement && (this.maxPointDOMElement.style.top = `${newPositionLength[constants.VALUE_END] - (this.pointOffset * 100)}%`);
      if (this.barDOMElement) {
        this.barDOMElement.style.top = `${newPositionLength[constants.VALUE_START]}%`;
        this.barDOMElement.style.height = `${newPositionLength[constants.VALUE_END] - newPositionLength[constants.VALUE_START]}%`;
      }
    } else {
      this.minPointDOMElement && (this.minPointDOMElement.style.left = `${newPositionLength[constants.VALUE_START] - (this.pointOffset * 100)}%`);
      this.maxPointDOMElement && (this.maxPointDOMElement.style.left = `${newPositionLength[constants.VALUE_END] - (this.pointOffset * 100)}%`);
      if (this.barDOMElement) {
        this.barDOMElement.style.left = `${newPositionLength[constants.VALUE_START]}%`;
        this.barDOMElement.style.width = `${newPositionLength[constants.VALUE_END] - newPositionLength[constants.VALUE_START]}%`;
      }
    }
  }

  public onPositionPercentChange = (positionPercent: number, valueType: string) => {};

  private createDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    const context = {
      isVertical: this.direction === constants.DIRECTION_VERTICAL,
      isRange: false,
    };
    sliderElement.innerHTML = this.template(context);

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
    const eventCoordinate = this.direction === constants.DIRECTION_VERTICAL ?
                            event.pageY - this.offset :
                            event.pageX - this.offset;

    if (this.isMinMouseDown && this.value instanceof Array) {
      this.minPercent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      this.onPositionPercentChange(this.minPercent, constants.VALUE_TYPE_MIN);
    }

    if (this.isMaxMouseDown && this.value instanceof Array) {
      this.maxPercent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      this.onPositionPercentChange(this.maxPercent, constants.VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;