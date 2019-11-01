import { ISliderSettings, ISingleSliderView } from '../../Interfaces/view/IView';
import { VALUE_START, DIRECTION_VERTICAL } from '../../constants';
import ComponentSliderView from './ComponentSliderView';

class SingleSliderView extends ComponentSliderView implements ISingleSliderView {
  private positionPercent: number;
  private isMouseDown: boolean;

  public constructor({ direction, minValue, maxValue, $parentElement, positionLength }: ISliderSettings) {
    super({ direction, minValue, maxValue, $parentElement, positionLength });

    this.isMouseDown = false;
    this.makeElement();
    $parentElement.append(this.$sliderElement);
    this.getSliderSizes();
  }

  public update (newPositionLength: number[]): void {
    const positionLength = newPositionLength[VALUE_START];

    this.$barElement.css(this.direction === DIRECTION_VERTICAL ? 'height' : 'width', `${positionLength}%`);
    this.$pointElement.css(this.direction === DIRECTION_VERTICAL ? 'top' : 'left', `${positionLength}%`);
  }

  public dispatchPositionPercent = (positionPercent: number): void => {};

  private makeElement(): void {
    const sliderElement = $(document.createElement('div'));
    sliderElement.addClass('slider-wrapper');

    const context = {
      isVertical: this.direction === DIRECTION_VERTICAL,
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
    this.$pointElement.on('mousedown', this.handlePointMousedown);
  }

  private handlePointMousedown = (): void => {
    this.isMouseDown = true;

    this.bindEventsToDocument();
  }

  private handleDocumentMouseup = (): void => {
    this.isMouseDown = false;

    document.removeEventListener('mousemove', this.handleDocumentMousemove);
    document.removeEventListener('mouseup', this.handleDocumentMouseup);
  }

  private bindEventsToDocument(): void {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('mouseup', this.handleDocumentMouseup);
  }

  private handleDocumentMousemove = (event: MouseEvent): void => {
    if (this.isMouseDown) {
      const eventCoordinate = this.direction === DIRECTION_VERTICAL ?
                              event.pageY - this.distanceFromPageBorder :
                              event.pageX - this.distanceFromPageBorder;

      this.positionPercent = this.countPercent(eventCoordinate, this.size);
      this.dispatchPositionPercent(this.positionPercent);
    }
  }
}

export default SingleSliderView;
