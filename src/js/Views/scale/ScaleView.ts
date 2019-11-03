import { IScaleSettings, IScaleView } from '../../Interfaces/view/IView';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL,
        SCALE_HORIZONTAL_CLASS, SCALE_VERTICAL_CLASS } from '../../constants';

class ScaleView implements IScaleView {
  private scaleElement: HTMLElement;
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
    $parentElement.append(this.scaleElement);
    this.scaleElement.addEventListener('click', this.handleScaleClick);
  }

  public dispatchValue = (value: number): void => {};

  private establishElement(): void {
    this.scaleElement = document.createElement('div');
    this.scaleElement.classList.add('slider__scale');
    if (this.direction === DIRECTION_HORIZONTAL) {
      this.scaleElement.classList.add(SCALE_HORIZONTAL_CLASS);
    } else {
      this.scaleElement.classList.add(SCALE_VERTICAL_CLASS);
    }

    this.establishValuesElements();
  }

  private establishValuesElements(): void {
    const valuesNumber = Math.floor((this.maxValue - this.minValue) / this.step);
    const values = [
      this.minValue,
      ...Array.from({ length: valuesNumber }, (_, index) => (index + 1) * this.step + this.minValue),
      this.maxValue,
    ]
    .map((value) => {
      const valueElement = document.createElement('div');
      this.direction === DIRECTION_VERTICAL ?
        valueElement.classList.add('slider__scale-value', 'slider__scale-value_direction_vertical')
        : valueElement.classList.add('slider__scale-value');
      valueElement.textContent = value.toString();

      this.direction === DIRECTION_HORIZONTAL ?
                          valueElement.style.left = `${this.convertValueToPosition(value)}%` :
                          valueElement.style.top = `${this.convertValueToPosition(value)}%`;
      return valueElement;
    });

    this.scaleElement.append(...values);
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
