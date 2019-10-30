import ISliderSettings from '../../Interfaces/view/ISliderSettings';
import ISingleSliderView from '../../Interfaces/view/ISingleSliderView';
import constants from '../../constants';
import ComponentSliderView from './ComponentSliderView';

class SingleSliderView extends ComponentSliderView implements ISingleSliderView {
  private percent: number;
  private isMouseDown: boolean;

  public constructor({ direction, minValue, maxValue }: ISliderSettings) {
    super({ direction, minValue, maxValue });

    this.isMouseDown = false;
    this.createElement();
  }

  public update (newPositionLength: number[]): void {
    const positionLength = newPositionLength[constants.VALUE_START];

    this.$barElement.css(this.direction === constants.DIRECTION_VERTICAL ? 'height' : 'width', `${positionLength}%`);
    this.$pointElement.css(this.direction === constants.DIRECTION_VERTICAL ? 'top' : 'left', `${positionLength - (this.pointOffset * 100)}%`);
  }

  public onPositionPercentChange = (positionPercent: number): void => {};

  private createElement(): void {
    const sliderElement = $(document.createElement('div'));
    sliderElement.addClass('slider-wrapper');

    const context = {
      isVertical: this.direction === constants.DIRECTION_VERTICAL,
      isSingle: true,
    };

    sliderElement.html(this.template(context));

    this.$sliderElement = sliderElement;
    this.$barElement = sliderElement.find('.js-slider__bar');
    this.$pointElement = sliderElement.find('.js-slider__point');
    this.$stripElement = sliderElement.find('.js-slider');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.$pointElement.on('mousedown', this.pointMousedownHandler);
  }

  private pointMousedownHandler = (): void => {
    this.isMouseDown = true;

    this.bindEventsToDocument();
  }

  private documentMouseUpHandler = (): void => {
    this.isMouseDown = false;

    document.removeEventListener('mousemove', this.documentMousemoveHandler);
    document.removeEventListener('mouseup', this.documentMouseUpHandler);
  }

  private bindEventsToDocument(): void {
    document.addEventListener('mousemove', this.documentMousemoveHandler);
    document.addEventListener('mouseup', this.documentMouseUpHandler);
  }

  private documentMousemoveHandler = (event: MouseEvent): void => {
    if (this.isMouseDown) {
      const eventCoordinate = this.direction === constants.DIRECTION_VERTICAL ?
                              event.pageY - this.offset :
                              event.pageX - this.offset;

      this.percent = this.countPercent(eventCoordinate, this.length);
      this.onPositionPercentChange(this.percent);
    }
  }
}

export default SingleSliderView;
