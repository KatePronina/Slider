import ISliderSettings from '../../Interfaces/view/ISliderSettings';
import IIntervalSliderView from '../../Interfaces/view/IIntervalSliderView';
import constants from '../../constants';
import ComponentSliderView from './ComponentSliderView';

class IntervalSliderView extends ComponentSliderView implements IIntervalSliderView {
  private maxPointDOMElement: JQuery<HTMLDivElement>;
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

  public update(newPositionLength: number[]): void {
    this.minPercent = newPositionLength[constants.VALUE_START];
    this.maxPercent = newPositionLength[constants.VALUE_END];

    const positionProperty = this.direction === constants.DIRECTION_VERTICAL ? 'top' : 'left';
    const lengthProperty = this.direction === constants.DIRECTION_VERTICAL ? 'height' : 'width';

    this.pointDOMElement.css(positionProperty, `${newPositionLength[constants.VALUE_START] - (this.pointOffset * 100)}%`);
    this.maxPointDOMElement.css(positionProperty, `${newPositionLength[constants.VALUE_END] - (this.pointOffset * 100)}%`);
    this.barDOMElement.css(positionProperty, `${newPositionLength[constants.VALUE_START]}%`);
    this.barDOMElement.css(lengthProperty, `${newPositionLength[constants.VALUE_END] - newPositionLength[constants.VALUE_START]}%`);
  }

  public onPositionPercentChange = (positionPercent: number[], valueType: string) => {};

  private createDOMElement(): void {
    const sliderElement = $(document.createElement('div'));
    sliderElement.addClass('slider-wrapper');

    const context = {
      isVertical: this.direction === constants.DIRECTION_VERTICAL,
      isSingle: false,
    };
    sliderElement.html(this.template(context));

    this.sliderElement = sliderElement;
    this.barDOMElement = sliderElement.find('.slider__bar');
    this.stripDOMElement = sliderElement.find('.slider');
    this.pointDOMElement = sliderElement.find('.slider__point_min');
    this.maxPointDOMElement = sliderElement.find('.slider__point_max');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.pointDOMElement.on('mousedown', this.minPointMousedownHandler);
    this.maxPointDOMElement.on('mousedown', this.maxPointMousedownHandler);
  }

  private minPointMousedownHandler = (): void => {
    this.isMinMouseDown = true;

    this.bindEventsToDocument();

    this.pointDOMElement.addClass(constants.POINT_ACTIVE_CLASS);
    this.maxPointDOMElement.removeClass(constants.POINT_ACTIVE_CLASS);
  }

  private maxPointMousedownHandler = (): void => {
    this.isMaxMouseDown = true;

    this.bindEventsToDocument();

    this.pointDOMElement.removeClass(constants.POINT_ACTIVE_CLASS);
    this.maxPointDOMElement.addClass(constants.POINT_ACTIVE_CLASS);
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
