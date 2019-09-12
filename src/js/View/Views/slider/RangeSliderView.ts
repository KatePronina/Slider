import ISliderSettings from '../../../Interfaces/view/ISliderSettings';
import constants from '../../../constants';
import ComponentSliderView from './ComponentSliderView';

class RangeSliderView extends ComponentSliderView {
  public pointDOMElement: HTMLElement | null;

  private percent: number;
  private isMouseDown: boolean;

  public constructor({ direction, minValue, maxValue, value }: ISliderSettings) {
    super({ direction, minValue, maxValue, value });

    this.isMouseDown = false;
    this.createDOMElement();
  }

  public onChangedValue(newPositionLength: number): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.barDOMElement && (this.barDOMElement.style.height = `${newPositionLength}%`);
      this.pointDOMElement && (this.pointDOMElement.style.top = `${newPositionLength - (this.pointOffset * 100)}%`);
    } else {
      this.barDOMElement && (this.barDOMElement.style.width = `${newPositionLength}%`);
      this.pointDOMElement && (this.pointDOMElement.style.left = `${newPositionLength - (this.pointOffset * 100)}%`);
    }
  }

  public onPositionPercentChange = (positionPercent: number): void => {};

  private createDOMElement(): void {
    const sliderElement = document.createElement('div');
    sliderElement.classList.add('slider-wrapper');

    const context = {
      isVertical: this.direction === constants.DIRECTION_VERTICAL,
      isRange: true,
    };
    sliderElement.innerHTML = this.template(context);

    this.DOMElement = sliderElement;
    this.barDOMElement = sliderElement.querySelector('.slider__bar');
    this.pointDOMElement = sliderElement.querySelector('.slider__point');
    this.stripDOMElement = sliderElement.querySelector('.slider');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.pointDOMElement && this.pointDOMElement.addEventListener('mousedown', this.onPointMouseDown);
  }

  private onPointMouseDown = (): void => {
    this.isMouseDown = true;

    this.bindEventsToDocument();
  }

  private onDocumentMouseUp = (): void => {
    this.isMouseDown = false;

    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }

  private bindEventsToDocument(): void {
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
  }

  private onDocumentMouseMove = (event: MouseEvent): void => {
    if (this.isMouseDown) {
      const eventCoordinate = this.direction === constants.DIRECTION_VERTICAL ? event.pageY - this.offset : event.pageX - this.offset;

      this.percent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      this.onPositionPercentChange(this.percent);
    }
  }
}

export default RangeSliderView;
