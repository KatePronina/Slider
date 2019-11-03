import { ISliderSettings, IIntervalSliderView } from '../../Interfaces/view/IView';
import { VALUE_START, VALUE_END, DIRECTION_VERTICAL, POINT_ACTIVE_CLASS, VALUE_TYPE_MAX, VALUE_TYPE_MIN } from '../../constants';
import ComponentSliderView from './ComponentSliderView';

class IntervalSliderView extends ComponentSliderView implements IIntervalSliderView {
  private $secondPointElement: JQuery<HTMLDivElement>;
  private minPositionPercent: number;
  private maxPositionPercent: number;
  private isMouseDownTargetEqualMin: boolean = false;
  private isMouseDownTargetEqualMax: boolean = false;

  public constructor({ direction, minValue, maxValue, $parentElement, positionLength }: ISliderSettings) {
    super({ direction, minValue, maxValue, $parentElement, positionLength });

    this.establishElement();
    $parentElement.append(this.$sliderElement);
    this.getSliderSizes();
  }

  public updateSlider(newPositionLength: number[]): void {
    this.minPositionPercent = newPositionLength[VALUE_START];
    this.maxPositionPercent = newPositionLength[VALUE_END];

    const positionProperty = this.direction === DIRECTION_VERTICAL ? 'top' : 'left';
    const sizeProperty = this.direction === DIRECTION_VERTICAL ? 'height' : 'width';

    this.$pointElement.css(positionProperty, `${newPositionLength[VALUE_START]}%`);
    this.$secondPointElement.css(positionProperty,
                              `${newPositionLength[VALUE_END]}%`);
    this.$barElement.css(positionProperty, `${newPositionLength[VALUE_START]}%`);
    this.$barElement.css(sizeProperty, `${newPositionLength[VALUE_END] - newPositionLength[VALUE_START]}%`);
  }

  public dispatchPositionPercent = (positionPercent: number[], valueType: string) => {};

  private establishElement(): void {
    const sliderElement = $(document.createElement('div'));
    sliderElement.addClass('slider-wrapper');

    const context = {
      isVertical: this.direction === DIRECTION_VERTICAL,
      isSingle: false,
    };
    sliderElement.html(this.template(context));

    this.$sliderElement = sliderElement;
    this.$barElement = sliderElement.find('.js-slider__bar');
    this.$stripElement = sliderElement.find('.js-slider');
    this.$pointElement = sliderElement.find('.js-slider__point-min');
    this.$secondPointElement = sliderElement.find('.js-slider__point-max');
    this.subscribeEventsToSlider();
  }

  private subscribeEventsToSlider(): void {
    this.$pointElement.on('mousedown', this.handleMinPointMousedown);
    this.$secondPointElement.on('mousedown', this.handleMaxPointMousedown);
  }

  private handleMinPointMousedown = (): void => {
    this.isMouseDownTargetEqualMin = true;

    this.subscribeEventsToDocument();

    this.$pointElement.addClass(POINT_ACTIVE_CLASS);
    this.$secondPointElement.removeClass(POINT_ACTIVE_CLASS);
  }

  private handleMaxPointMousedown = (): void => {
    this.isMouseDownTargetEqualMax = true;

    this.subscribeEventsToDocument();

    this.$pointElement.removeClass(POINT_ACTIVE_CLASS);
    this.$secondPointElement.addClass(POINT_ACTIVE_CLASS);
  }

  private subscribeEventsToDocument(): void {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseUp = (): void => {
    this.isMouseDownTargetEqualMin = false;
    this.isMouseDownTargetEqualMax = false;

    document.removeEventListener('mousemove', this.handleDocumentMousemove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private handleDocumentMousemove = (event: MouseEvent): void => {
    const eventCoordinate = this.direction === DIRECTION_VERTICAL ?
                            event.pageY - this.distanceFromPageBorder :
                            event.pageX - this.distanceFromPageBorder;

    if (this.isMouseDownTargetEqualMin) {
      this.minPositionPercent = this.countPercent(eventCoordinate, this.size);
      this.dispatchPositionPercent([this.minPositionPercent], VALUE_TYPE_MIN);
    }

    if (this.isMouseDownTargetEqualMax) {
      this.maxPositionPercent = this.countPercent(eventCoordinate, this.size);
      this.dispatchPositionPercent([this.maxPositionPercent], VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;
