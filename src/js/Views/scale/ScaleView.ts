import { IScaleSettings, IScaleView } from '../../Interfaces/view/IView';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL,
        SCALE_HORIZONTAL_CLASS, SCALE_VERTICAL_CLASS } from '../../constants';

class ScaleView implements IScaleView {
  private element: HTMLElement;
  private direction: 'horizontal' | 'vertical';
  private minValue: number;
  private maxValue: number;
  private step: number;

  public constructor({ direction, minValue, maxValue, step, $parentElement }: IScaleSettings) {
    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = step;
    this.establishElement();
    $parentElement.append(this.element);
    this.element.addEventListener('click', this.handleScaleClick);
  }

  public dispatchValue = (value: number): void => {};

  private establishElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('slider__scale');
    if (this.direction === DIRECTION_HORIZONTAL) {
      this.element.classList.add(SCALE_HORIZONTAL_CLASS);
    } else {
      this.element.classList.add(SCALE_VERTICAL_CLASS);
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
      this.direction === DIRECTION_VERTICAL ?
        valueElement.classList.add('slider__scale-value', 'slider__scale-value_direction_vertical')
        : valueElement.classList.add('slider__scale-value');
      valueElement.textContent = value.toString();

      const positionLength = this.convertValueToPosition(value);
      this.direction === DIRECTION_HORIZONTAL ?
                          valueElement.style.left = `${positionLength}%` :
                          valueElement.style.top = `${positionLength}%`;
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

  private convertValueToPosition(value: number): number {
    return ((value - this.minValue) * 100) / (this.maxValue - this.minValue);
  }
}

export default ScaleView;
