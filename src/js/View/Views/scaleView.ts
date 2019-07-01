import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class ScaleView extends ComponentView {
  public scaleDOMElement: HTMLElement;

  public constructor(state: FullSettings) {
    super(state);
    this.createDOMElement();
  }

  public getDOMElement(): HTMLElement {
    return this.scaleDOMElement;
  }

  private createDOMElement(): void {
    const scale = document.createElement('div');
    scale.classList.add('slider__scale');
    
    const values = [this.state.minValue];
    const valuesNumber = Math.floor((this.state.maxValue - this.state.minValue) / this.state.step);
    let currentValue = this.state.minValue;
    for (let i = 0; i < valuesNumber; i++) {
      currentValue += this.state.step;
      if (currentValue < this.state.maxValue) {
        values.push(currentValue);
      }
    }
    values.push(this.state.maxValue);

    const valuesFragment = document.createDocumentFragment();
    for (let i = 0; i < values.length; i++) {
      const valueElement = document.createElement('div');
      valueElement.classList.add('slider__scale-value');
      valueElement.textContent = values[i].toString();

      const offsetValue = valueElement.offsetWidth / 2;
      valueElement.style.left = this.countLength(values[i]) - offsetValue + '%';
      valuesFragment.append(valueElement);
    }

    scale.append(valuesFragment);
    this.scaleDOMElement = scale;
  }

  public alignValues(sliderWidth: number): void {
    const valueElements = this.scaleDOMElement.querySelectorAll('.slider__scale-value');
    valueElements.forEach((element): void => {
      const elementOffset = ((element as HTMLElement).offsetWidth / 2) * 100 / sliderWidth;
      const elementCurrentOffset = parseInt(((element as HTMLElement).style.left as string).slice(0, -1)); 
      (element as HTMLElement).style.left = elementCurrentOffset - elementOffset + '%';
    })
  }

  private countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }
}

export default ScaleView;