import IScaleSettings from '../../Interfaces/view/IScaleSettings';
import IScaleView from '../../Interfaces/view/IScaleView';
import constants from '../../constants';
import ComponentView from '../ComponentView';

class ScaleView extends ComponentView implements IScaleView {
  private sliderLength: number;
  private direction: 'horizontal' | 'vertical';
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
    this.makeElement();
    this.element.addEventListener('click', this.scaleClickHandler);
  }

  public alignValueElements(): void {
    const valueElements = this.element.querySelectorAll('.slider__scale-value');

    valueElements.forEach((element): void => {
      if (element instanceof HTMLElement) {
        const elementOffset = (element.offsetWidth / 2) * 100 / this.sliderLength;
        this.setOffset(element, elementOffset);
      }
    });
  }

  public dispatchValue = (value: number): void => {};

  private setOffset(element: HTMLElement, elementOffset: number): void {
    const positionProperty = this.direction === constants.DIRECTION_HORIZONTAL ? element.style.left : element.style.top;
    const elementCurrentOffset = positionProperty && (parseInt(positionProperty.slice(0, -1), 10));
    // slice из-за процента

    if (elementCurrentOffset || elementCurrentOffset === 0) {
      this.direction === constants.DIRECTION_HORIZONTAL ?
                          element.style.left = `${elementCurrentOffset - elementOffset}%`
                        : element.style.top = `${elementCurrentOffset - elementOffset}%`;
    }
  }

  private makeElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('slider__scale');
    if (this.direction === constants.DIRECTION_HORIZONTAL) {
      this.element.classList.add(constants.SCALE_HORIZONTAL_CLASS);
      this.element.style.width = `${this.sliderLength}px`;
    } else {
      this.element.classList.add(constants.SCALE_VERTICAL_CLASS);
      this.element.style.height = `${this.sliderLength}px`;
    }

    this.createValuesElements();
  }

  private createValuesElements(): void {
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

      const offsetValue = typeof value === 'number' &&  this.countPosition(value) - (valueElement.offsetWidth / 2);
      this.direction === constants.DIRECTION_HORIZONTAL ?
                          valueElement.style.left = `${offsetValue}%` :
                          valueElement.style.top = `${offsetValue}%`;
      valuesFragment.append(valueElement);
    });

    this.element.append(valuesFragment);
  }

  private scaleClickHandler = ({ target }: Event): void => {
    if (target instanceof HTMLElement && target.classList.contains('slider__scale-value')) {
      target.textContent && this.dispatchValue(parseInt(target.textContent, 10));
    }
  }

  private countPosition(value: number): number {
    return ((value - this.minValue) * 100) / (this.maxValue - this.minValue);
  }
}

export default ScaleView;
