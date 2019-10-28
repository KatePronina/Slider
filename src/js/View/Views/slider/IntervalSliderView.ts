import ISliderSettings from '../../../Interfaces/view/ISliderSettings';
import IIntervalSliderView from '../../../Interfaces/view/IIntervalSliderView';
import constants from '../../../constants';
import ComponentSliderView from './ComponentSliderView';

class IntervalSliderView extends ComponentSliderView implements IIntervalSliderView {
  public pointDOMElement: HTMLElement | null;
  public maxPointDOMElement: HTMLElement | null;

  private minPercent: number;
  private maxPercent: number;
  private isMinMouseDown: boolean;
  private isMaxMouseDown: boolean;

  public constructor({ direction, minValue, maxValue }: ISliderSettings) {
    super({ direction, minValue, maxValue });

    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;
    this.createDOMElement();
  }

  public onChangedValue(newPositionLength: number[]): void {
    this.minPercent = newPositionLength[constants.VALUE_START];
    this.maxPercent = newPositionLength[constants.VALUE_END];
    this.direction === constants.DIRECTION_VERTICAL ?
                        this.setNewVerticalPosition(newPositionLength) :
                        this.setNewHorizontalPosition(newPositionLength);
  }

  public onPositionPercentChange = (positionPercent: number[], valueType: string) => {};

  private setNewVerticalPosition(newPositionLength: number[]): void {
    this.pointDOMElement && (this.pointDOMElement.style.top = `${newPositionLength[constants.VALUE_START] - (this.pointOffset * 100)}%`);
    this.maxPointDOMElement && (this.maxPointDOMElement.style.top = `${newPositionLength[constants.VALUE_END] - (this.pointOffset * 100)}%`);
    if (this.barDOMElement) {
      this.barDOMElement.style.top = `${newPositionLength[constants.VALUE_START]}%`;
      this.barDOMElement.style.height = `${newPositionLength[constants.VALUE_END] - newPositionLength[constants.VALUE_START]}%`;
    }
  }

  private setNewHorizontalPosition(newPositionLength: number[]): void {
    this.pointDOMElement && (this.pointDOMElement.style.left = `${newPositionLength[constants.VALUE_START] - (this.pointOffset * 100)}%`);
    this.maxPointDOMElement && (this.maxPointDOMElement.style.left = `${newPositionLength[constants.VALUE_END] - (this.pointOffset * 100)}%`);
    if (this.barDOMElement) {
      this.barDOMElement.style.left = `${newPositionLength[constants.VALUE_START]}%`;
      this.barDOMElement.style.width = `${newPositionLength[constants.VALUE_END] - newPositionLength[constants.VALUE_START]}%`;
    }
  }

  private createDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    const context = {
      isVertical: this.direction === constants.DIRECTION_VERTICAL,
      isSingle: false,
    };
    sliderElement.innerHTML = this.template(context);

    this.element = sliderElement;
    this.barDOMElement = sliderElement.querySelector('.slider__bar');
    this.stripDOMElement = sliderElement.querySelector('.slider');
    this.pointDOMElement = sliderElement.querySelector('.slider__point_min');
    this.maxPointDOMElement = sliderElement.querySelector('.slider__point_max');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.pointDOMElement && this.pointDOMElement.addEventListener('mousedown', this.minPointMousedownHandler);
    this.maxPointDOMElement && this.maxPointDOMElement.addEventListener('mousedown', this.maxPointMousedownHandler);
  }

  private minPointMousedownHandler = (): void => {
    this.isMinMouseDown = true;

    this.bindEventsToDocument();

    this.pointDOMElement && this.pointDOMElement.classList.add(constants.POINT_ACTIVE_CLASS);
    this.maxPointDOMElement && this.maxPointDOMElement.classList.remove(constants.POINT_ACTIVE_CLASS);
  }

  private maxPointMousedownHandler = (): void => {
    this.isMaxMouseDown = true;

    this.bindEventsToDocument();

    this.pointDOMElement && this.pointDOMElement.classList.remove(constants.POINT_ACTIVE_CLASS);
    this.maxPointDOMElement && this.maxPointDOMElement.classList.add(constants.POINT_ACTIVE_CLASS);
  }

  private bindEventsToDocument(): void {
    document.addEventListener('mousemove', this.documentMousemoveHandler);
    document.addEventListener('mouseup', this.documentMouseUpHandler);
  }

  private documentMouseUpHandler = (): void => {
    this.isMinMouseDown = false;
    this.isMaxMouseDown = false;

    document.removeEventListener('mousemove', this.documentMousemoveHandler);
    document.removeEventListener('mouseup', this.documentMouseUpHandler);
  }

  private documentMousemoveHandler = (event: MouseEvent): void => {
    const eventCoordinate = this.direction === constants.DIRECTION_VERTICAL ?
                            event.pageY - this.offset :
                            event.pageX - this.offset;

    if (this.isMinMouseDown) {
      this.minPercent = this.countPercent(eventCoordinate, this.length);
      this.onPositionPercentChange([this.minPercent], constants.VALUE_TYPE_MIN);
    }

    if (this.isMaxMouseDown) {
      this.maxPercent = this.countPercent(eventCoordinate, this.length);
      this.onPositionPercentChange([this.maxPercent], constants.VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;
