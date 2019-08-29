import constants from '../../../constants';
import IFullSettings from '../../../IFullSettings';
import ComponentSliderView from './ComponentSliderView';

class RangeSliderView extends ComponentSliderView {
  public pointDOMElement: HTMLElement | null;

  private percent: number;

  private isMouseDown: boolean;

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
    this.isMouseDown = false;
    this.createDOMElement();
  }

  public onChangedValue(value: number): void {
    if (this.state.direction === constants.DIRECTION_VERTICAL) {
      (this.barDOMElement as HTMLElement).style.height = `${this.countLength(value)}%`;
      (this.pointDOMElement as HTMLElement).style.top = `${this.countLength(value) - (this.pointOffset * 100)}%`;
    } else {
      (this.barDOMElement as HTMLElement).style.width = `${this.countLength(value)}%`;
      (this.pointDOMElement as HTMLElement).style.left = `${this.countLength(value) - (this.pointOffset * 100)}%`;
    }
  }

  public onNewValue = (value: number): void => {};

  private templateHorizontal = require('./templates/rangeHorizontal.hbs');

  private templateVertical = require('./templates/rangeVertical.hbs');

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
    this.pointDOMElement = sliderElement.querySelector('.slider__point');
    this.stripDOMElement = sliderElement.querySelector('.slider');
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    (this.pointDOMElement as HTMLElement).addEventListener('mousedown', this.onPointMouseDown);
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
      const eventCoordinate = this.state.direction === constants.DIRECTION_VERTICAL ? event.pageY - this.offset : event.pageX - this.offset;

      this.percent = ComponentSliderView.countPercent(eventCoordinate, this.length);
      this.onNewValue(this.countValue(this.percent));
    }
  }
}

export default RangeSliderView;
