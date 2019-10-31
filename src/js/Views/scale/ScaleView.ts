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
    this.element.addEventListener('click', this.handleScaleClick);
  }

  public dispatchValue = (value: number): void => {};

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
      this.direction === constants.DIRECTION_VERTICAL ?
        valueElement.classList.add('slider__scale-value', 'slider__scale-value_direction_vertical')
        : valueElement.classList.add('slider__scale-value');
      valueElement.textContent = value.toString();

      const offsetValue = typeof value === 'number' &&  this.countPosition(value) - (valueElement.offsetWidth / 2);
      this.direction === constants.DIRECTION_HORIZONTAL ?
                          valueElement.style.left = `${offsetValue}%` :
                          valueElement.style.top = `${offsetValue}%`;
      valuesFragment.append(valueElement);
    });

    this.element.append(valuesFragment);
  }

  private handleScaleClick = ({ target }: Event): void => {
    if (target && (<HTMLElement>target).classList.contains('slider__scale-value')) {
      const value = (<HTMLElement>target).textContent;
      value && this.dispatchValue(parseInt(value, 10));
    }
  }

  private countPosition(value: number): number {
    return ((value - this.minValue) * 100) / (this.maxValue - this.minValue);
  }
}

export default ScaleView;
