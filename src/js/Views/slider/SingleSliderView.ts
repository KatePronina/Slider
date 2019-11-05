import { ISliderSettings, ISingleSliderView } from '../../Interfaces/view/IView';
import { VALUE_START, DIRECTION_VERTICAL } from '../../constants';
import ComponentSliderView from './ComponentSliderView';

class SingleSliderView extends ComponentSliderView implements ISingleSliderView {
  private positionPercent: number;

  public constructor({ direction, minValue, maxValue, $parentElement, positionLength }: ISliderSettings) {
    super({ direction, minValue, maxValue, $parentElement, positionLength });

    this.establishElement($parentElement);
  }

  public updateSlider(newPositionLength: number[]): void {
    const positionLength = newPositionLength[VALUE_START];

    this.$barElement.css(this.direction === DIRECTION_VERTICAL ? 'height' : 'width', `${positionLength}%`);
    this.$pointElement.css(this.direction === DIRECTION_VERTICAL ? 'top' : 'left', `${positionLength}%`);
  }

  public dispatchPositionPercent = (positionPercent: number): void => {};

  private establishElement($parentElement: JQuery<HTMLElement>): void {
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
    this.subscribeEventsToSlider();
    $parentElement.append(this.$sliderElement);
    this.getSliderSizes();
  }

  private subscribeEventsToSlider(): void {
    this.$pointElement.on('mousedown', this.handlePointMousedown);
  }

  private handlePointMousedown = (): void => {
    this.subscribeEventsToDocument();
  }

  private handleDocumentMouseup = (): void => {
    document.removeEventListener('mousemove', this.handleDocumentMousemove);
    document.removeEventListener('mouseup', this.handleDocumentMouseup);
  }

  private subscribeEventsToDocument(): void {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('mouseup', this.handleDocumentMouseup);
  }

  private handleDocumentMousemove = (event: MouseEvent): void => {
    const eventCoordinate = this.direction === DIRECTION_VERTICAL ?
                            event.pageY - this.distanceFromPageBorder :
                            event.pageX - this.distanceFromPageBorder;

    this.positionPercent = this.countPercent(eventCoordinate, this.size);
    this.dispatchPositionPercent(this.positionPercent);
  }
}

export default SingleSliderView;
