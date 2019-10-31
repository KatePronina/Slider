import ISliderSettings from '../../Interfaces/view/ISliderSettings';
import IIntervalSliderView from '../../Interfaces/view/IIntervalSliderView';
import constants from '../../constants';
import ComponentSliderView from './ComponentSliderView';

class IntervalSliderView extends ComponentSliderView implements IIntervalSliderView {
  private $maxPointElement: JQuery<HTMLDivElement>;
  private minPercent: number;
  private maxPercent: number;
  private isMouseDownTargetEqualMin: boolean;
  private isMouseDownTargetEqualMax: boolean;

  public constructor({ direction, minValue, maxValue, $parentElement, positionLength }: ISliderSettings) {
    super({ direction, minValue, maxValue, $parentElement, positionLength });

    this.isMouseDownTargetEqualMin = false;
    this.isMouseDownTargetEqualMax = false;
    this.makeElement();
    $parentElement.append(this.$sliderElement);
    this.setSliderSizes();
  }

  public update(newPositionLength: number[]): void {
    this.minPercent = newPositionLength[constants.VALUE_START];
    this.maxPercent = newPositionLength[constants.VALUE_END];

    const positionProperty = this.direction === constants.DIRECTION_VERTICAL ? 'top' : 'left';
    const lengthProperty = this.direction === constants.DIRECTION_VERTICAL ? 'height' : 'width';

    this.$pointElement.css(positionProperty, `${newPositionLength[constants.VALUE_START]}%`);
    this.$maxPointElement.css(positionProperty,
                              `${newPositionLength[constants.VALUE_END]}%`);
    this.$barElement.css(positionProperty, `${newPositionLength[constants.VALUE_START]}%`);
    this.$barElement.css(lengthProperty, `${newPositionLength[constants.VALUE_END] - newPositionLength[constants.VALUE_START]}%`);
  }

  public dispatchPositionPercent = (positionPercent: number[], valueType: string) => {};

  private makeElement(): void {
    const sliderElement = $(document.createElement('div'));
    sliderElement.addClass('slider-wrapper');

    const context = {
      isVertical: this.direction === constants.DIRECTION_VERTICAL,
      isSingle: false,
    };
    sliderElement.html(this.template(context));

    this.$sliderElement = sliderElement;
    this.$barElement = sliderElement.find('.js-slider__bar');
    this.$stripElement = sliderElement.find('.js-slider');
    this.$pointElement = sliderElement.find('.js-slider__point-min');
    this.$maxPointElement = sliderElement.find('.js-slider__point-max');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.$pointElement.on('mousedown', this.handleMinPointMousedown);
    this.$maxPointElement.on('mousedown', this.handleMaxPointMousedown);
  }

  private handleMinPointMousedown = (): void => {
    this.isMouseDownTargetEqualMin = true;

    this.bindEventsToDocument();

    this.$pointElement.addClass(constants.POINT_ACTIVE_CLASS);
    this.$maxPointElement.removeClass(constants.POINT_ACTIVE_CLASS);
  }

  private handleMaxPointMousedown = (): void => {
    this.isMouseDownTargetEqualMax = true;

    this.bindEventsToDocument();

    this.$pointElement.removeClass(constants.POINT_ACTIVE_CLASS);
    this.$maxPointElement.addClass(constants.POINT_ACTIVE_CLASS);
  }

  private bindEventsToDocument(): void {
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
    const eventCoordinate = this.direction === constants.DIRECTION_VERTICAL ?
                            event.pageY - this.distanceFromPageBorder :
                            event.pageX - this.distanceFromPageBorder;

    if (this.isMouseDownTargetEqualMin) {
      this.minPercent = this.countPercent(eventCoordinate, this.size);
      this.dispatchPositionPercent([this.minPercent], constants.VALUE_TYPE_MIN);
    }

    if (this.isMouseDownTargetEqualMax) {
      this.maxPercent = this.countPercent(eventCoordinate, this.size);
      this.dispatchPositionPercent([this.maxPercent], constants.VALUE_TYPE_MAX);
    }
  }
}

export default IntervalSliderView;
