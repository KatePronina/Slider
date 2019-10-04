import IScaleSettings from '../../../Interfaces/view/IScaleSettings';
import IScaleView from '../../../Interfaces/view/IScaleView';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class ScaleView extends ComponentView implements IScaleView {
  public sliderLength: number;
  private direction: string;
  private minValue: number;
  private maxValue: number;
  private step: number;

  public constructor({ direction, minValue, maxValue, step, sliderLength }: IScaleSettings) {
    super();
    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = step;
    this.sliderLength = sliderLength;
    this.createDOMElement();
    this.bindEvents();
  }

  public alignValues(): void {
    const valueElements = this.element.querySelectorAll('.slider__scale-value');

    valueElements.forEach((element): void => {
      if (element instanceof HTMLElement) {
        const elementOffset = (element.offsetWidth / 2) * 100 / this.sliderLength;
        this.setOffset(element, elementOffset);
      }
    });
  }

  public onNewValue = (value: number): void => {};

  private setOffset(element: HTMLElement, elementOffset: number): void {
    if (this.direction === constants.DIRECTION_HORIZONTAL) {
      const { left } = element.style;
      const elementCurrentOffset = left && (parseInt(left.slice(0, -1), 10));

      if (elementCurrentOffset || elementCurrentOffset === 0) {
        element.style.left = `${elementCurrentOffset - elementOffset}%`;
      }
    } else {
      const { top } = element.style;
      const elementCurrentOffset = top && parseInt(top.slice(0, -1), 10);

      if (elementCurrentOffset || elementCurrentOffset === 0) {
        element.style.top = `${elementCurrentOffset - elementOffset}%`;
      }
    }
  }

  private createDOMElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('slider__scale');
    if (this.direction === constants.DIRECTION_HORIZONTAL) {
      this.element.classList.add(constants.SCALE_HORIZONTAL_CLASS);
      this.element.style.width = `${this.sliderLength}px`;
    } else {
      this.element.classList.add(constants.SCALE_VERTICAL_CLASS);
      this.element.style.height = `${this.sliderLength}px`;
    }

    this.createValues();
  }

  private createValues(): void {
    const valuesNumber = Math.floor((this.maxValue - this.minValue) / this.step);
    const values = [
      this.minValue,
      ...Array.from({ length: valuesNumber }, (_, index) => (index + 1) * this.step + this.minValue),
      this.maxValue,
    ];

    const valuesFragment = document.createDocumentFragment();
    values.forEach((value) => {
      const valueElement = document.createElement('div');
      valueElement.classList.add('slider__scale-value');
      valueElement.textContent = value.toString();

      const offsetValue = typeof value === 'number' &&  this.countLength(value) - (valueElement.offsetWidth / 2);
      this.direction === constants.DIRECTION_HORIZONTAL ?
                          valueElement.style.left = `${offsetValue}%` :
                          valueElement.style.top = `${offsetValue}%`;
      valuesFragment.append(valueElement);
    });

    this.element.append(valuesFragment);
  }

  private bindEvents(): void {
    this.element.addEventListener('click', this.onScaleClick);
  }

  private onScaleClick = ({ target }: Event): void => {
    if (target instanceof HTMLElement && target.classList.contains('slider__scale-value')) {
      target.textContent && this.onNewValue(parseInt(target.textContent, 10));
    }
  }

  private countLength(value: number): number {
    return ((value - this.minValue) * 100) / (this.maxValue - this.minValue);
  }
}

export default ScaleView;
