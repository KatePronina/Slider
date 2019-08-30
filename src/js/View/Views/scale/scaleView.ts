import IFullSettings from '../../../IFullSettings';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class ScaleView extends ComponentView {
  public sliderLength: number;
  private direction: string;
  private minValue: number;
  private maxValue: number;
  private step: number;

  public constructor(direction: string, minValue: number, maxValue: number, step: number, sliderLength: number) {
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
    const valueElements = this.DOMElement.querySelectorAll('.slider__scale-value');

    valueElements.forEach((element): void => {
      const elementOffset = ((element as HTMLElement).offsetWidth / 2) * 100 / this.sliderLength;

      if (this.direction === constants.DIRECTION_HORIZONTAL) {
        const { left } = (element as HTMLElement).style;
        const elementCurrentOffset = parseInt((left as string).slice(0, -1), 10);
        (element as HTMLElement).style.left = `${elementCurrentOffset - elementOffset}%`;
      } else {
        const { top } = (element as HTMLElement).style;
        const elementCurrentOffset = parseInt((top as string).slice(0, -1), 10);
        (element as HTMLElement).style.top = `${elementCurrentOffset - elementOffset}%`;
      }
    });
  }

  public toggleDisplay(): void {
    if (this.DOMElement.classList.contains(constants.SCALE_DISABLE_CLASS)) {
      this.DOMElement.classList.remove(constants.SCALE_DISABLE_CLASS);
    } else {
      this.DOMElement.classList.add(constants.SCALE_DISABLE_CLASS);
    }
  }

  public onNewValue = (value: number): void => {};

  private createDOMElement(): void {
    const scale = document.createElement('div');
    scale.classList.add('slider__scale');
    if (this.direction === constants.DIRECTION_HORIZONTAL) {
      scale.classList.add(constants.SCALE_HORIZONTAL_CLASS);
      scale.style.width = `${this.sliderLength}px`;
    } else {
      scale.classList.add(constants.SCALE_VERTICAL_CLASS);
      scale.style.height = `${this.sliderLength}px`;
    }

    const values = [this.minValue];
    const valuesNumber = Math.floor((this.maxValue - this.minValue) / this.step);
    let currentValue = this.minValue;
    for (let i = 0; i < valuesNumber; i += 1) {
      currentValue += this.step;
      if (currentValue < this.maxValue) {
        values.push(currentValue);
      }
    }
    values.push(this.maxValue);

    const valuesFragment = document.createDocumentFragment();
    values.forEach((value) => {
      const valueElement = document.createElement('div');
      valueElement.classList.add('slider__scale-value');
      valueElement.textContent = value.toString();

      const offsetValue = this.countLength(value) - (valueElement.offsetWidth / 2);
      this.direction === constants.DIRECTION_HORIZONTAL ? valueElement.style.left = `${offsetValue}%` : valueElement.style.top = `${offsetValue}%`;
      
      valuesFragment.append(valueElement);
    })

    scale.append(valuesFragment);
    this.DOMElement = scale;
  }

  private bindEvents(): void {
    this.DOMElement.addEventListener('click', this.onScaleClick);
  }

  private onScaleClick = (event: Event): void => {
    if ((event.target as HTMLElement).classList.contains('slider__scale-value')) {
      this.onNewValue(parseInt(((event.target as HTMLElement).textContent as string), 10));
    }
  }

  private countLength(value: number): number {
    return ((value - this.minValue) * 100) / (this.maxValue - this.minValue);
  }
}

export default ScaleView;
