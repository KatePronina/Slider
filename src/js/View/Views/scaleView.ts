import ComponentView from './componentView';
import { IFullSettings } from '../../application.interfaces';
import sliderOptions from '../../sliderOptions';

class ScaleView extends ComponentView {
  public sliderLength: number;

  public constructor(state: IFullSettings, sliderLength: number) {
    super(state);
    this.sliderLength = sliderLength;
    this.createDOMElement();
    this.bindEvents();
  }

  private createDOMElement(): void {
    const scale = document.createElement('div');
    scale.classList.add('slider__scale');
    if (this.state.direction === sliderOptions.DIRECTION_HORIZONTAL) {
      scale.style.top = '.7rem';
      scale.style.width = `${this.sliderLength}px`;
    } else {
      scale.style.left = '-1.7rem';
      scale.style.height = `${this.sliderLength}px`;
    }

    const values = [this.state.minValue];
    const valuesNumber = Math.floor((this.state.maxValue - this.state.minValue) / this.state.step);
    let currentValue = this.state.minValue;
    for (let i = 0; i < valuesNumber; i += 1) {
      currentValue += this.state.step;
      if (currentValue < this.state.maxValue) {
        values.push(currentValue);
      }
    }
    values.push(this.state.maxValue);

    const valuesFragment = document.createDocumentFragment();
    for (let i = 0; i < values.length; i += 1) {
      const valueElement = document.createElement('div');
      valueElement.classList.add('slider__scale-value');
      valueElement.textContent = values[i].toString();

      const offsetValue = valueElement.offsetWidth / 2;
      if (this.state.direction === sliderOptions.DIRECTION_HORIZONTAL) {
        valueElement.style.left = `${this.countLength(values[i]) - offsetValue}%`;
      } else {
        valueElement.style.top = `${this.countLength(values[i]) - offsetValue}%`;
      }
      valuesFragment.append(valueElement);
    }

    scale.append(valuesFragment);
    this.DOMElement = scale;
  }

  public alignValues(): void {
    const valueElements = this.DOMElement.querySelectorAll('.slider__scale-value');

    valueElements.forEach((element): void => {
      const elementOffset = ((element as HTMLElement).offsetWidth / 2) * 100 / this.sliderLength;

      if (this.state.direction === sliderOptions.DIRECTION_HORIZONTAL) {
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
    if (this.DOMElement.classList.contains(sliderOptions.SCALE_DISABLE_CLASS)) {
      this.DOMElement.classList.remove(sliderOptions.SCALE_DISABLE_CLASS);
    } else {
      this.DOMElement.classList.add(sliderOptions.SCALE_DISABLE_CLASS);
    }
  }

  private bindEvents(): void {
    this.DOMElement.addEventListener('click', this.onScaleClick.bind(this));
  }

  private onScaleClick(e: Event): void {
    if ((e.target as HTMLElement).classList.contains('slider__scale-value')) {
      this.onNewValue(parseInt(((e.target as HTMLElement).textContent as string), 10));
    }
  }

  private countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  public onNewValue = (value: number): void => {

  }
}

export default ScaleView;
