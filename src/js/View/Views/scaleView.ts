import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class ScaleView extends ComponentView {
  public scaleDOMElement: HTMLElement;
  public sliderLength: number;

  public constructor(state: FullSettings, sliderLength: number) {
    super(state);
    this.sliderLength = sliderLength;
    this.createDOMElement();
    this.bindEvents();
  }

  public getDOMElement(): HTMLElement {
    return this.scaleDOMElement;
  }

  private createDOMElement(): void {
    const scale = document.createElement('div');
    scale.classList.add('slider__scale');
    if (this.state.direction === 'horizontal') {
      scale.style.top = '.7rem';
      scale.style.width = this.sliderLength + 'px';
    } else {
      scale.style.left = '-1.7rem';
      scale.style.height = this.sliderLength + 'px';
    }
    
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
      if (this.state.direction === 'horizontal') {
        valueElement.style.left = this.countLength(values[i]) - offsetValue + '%';
      } else {
        valueElement.style.top = this.countLength(values[i]) - offsetValue + '%';
      }
      valuesFragment.append(valueElement);
    }

    scale.append(valuesFragment);
    this.scaleDOMElement = scale;
  }

  public alignValues(): void {
    const valueElements = this.scaleDOMElement.querySelectorAll('.slider__scale-value');
    valueElements.forEach((element): void => {
      const elementOffset = ((element as HTMLElement).offsetWidth / 2) * 100 / this.sliderLength;
      if (this.state.direction === 'horizontal') {
        const elementCurrentOffset = parseInt(((element as HTMLElement).style.left as string).slice(0, -1)); 
        (element as HTMLElement).style.left = elementCurrentOffset - elementOffset + '%';
      } else {
        const elementCurrentOffset = parseInt(((element as HTMLElement).style.top as string).slice(0, -1)); 
        (element as HTMLElement).style.top = elementCurrentOffset - elementOffset + '%';
      }
    })
  }

  private bindEvents(): void {
    this.scaleDOMElement.addEventListener('click', (e): void => {
      if((e.target as HTMLElement).classList.contains('slider__scale-value')) {
        this.onNewValue(parseInt(((e.target as HTMLElement).textContent as string)));
      }
    })
  }

  private countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  public onNewValue(value: number): void {

  }
}

export default ScaleView;