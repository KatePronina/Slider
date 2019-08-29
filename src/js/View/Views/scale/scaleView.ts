import IFullSettings from '../../../IFullSettings';
import sliderOptions from '../../../sliderOptions';
import ComponentView from '../ComponentView';
import IScaleSettings from './IScaleSettings';

class ScaleView extends ComponentView {
  public sliderLength: number;

  private state: IScaleSettings;

  public constructor({
      direction,
      minValue,
      maxValue,
      step,
    }: IFullSettings, sliderLength: number) {
    super();
    this.state = {
      direction,
      minValue,
      maxValue,
      step,
    };
    this.sliderLength = sliderLength;
    this.createDOMElement();
    this.bindEvents();
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

  public onNewValue = (value: number): void => {};

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

  private bindEvents(): void {
    this.DOMElement.addEventListener('click', this.onScaleClick);
  }

  private onScaleClick = (event: Event): void => {
    if ((event.target as HTMLElement).classList.contains('slider__scale-value')) {
      this.onNewValue(parseInt(((event.target as HTMLElement).textContent as string), 10));
    }
  }

  private countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }
}

export default ScaleView;
