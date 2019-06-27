import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class HintView extends ComponentView {
  public hintDOMElement: HTMLElement;
  public hintOffset: number;
  public isMaxValue?: boolean;

  public constructor(state: FullSettings, isMaxValue?: boolean) {
    super(state);
    this.isMaxValue = isMaxValue;
    this.createHintDOMElement();
  }

  public createHintDOMElement(): void {
    const hintElement = document.createElement('div');

    if (this.state.type === 'interval' && this.isMaxValue) {
      hintElement.textContent = (this.state.value as number[])[1].toString();
    } else if (this.state.type === 'interval') {
      hintElement.textContent = (this.state.value as number[])[0].toString();
    } else {
      hintElement.textContent = (this.state.value as number).toString();
    }

    hintElement.classList.add('slider__hint');
    if (this.state.direction === 'vertical') {
      hintElement.classList.add('slider__hint--vertical');
    }
    this.hintDOMElement = hintElement;
  }

  public getDOMElement(): HTMLElement {
    return this.hintDOMElement;
  }

  public onChangedValue(value: number | number[], percent: number): void {
    this.state.value = value;
    if (this.state.direction === 'vertical') {
      this.hintDOMElement.style.top = percent - (this.hintOffset * 100) + '%';
    } else {
      this.hintDOMElement.style.left = percent - (this.hintOffset * 100) + '%';
    }
    
    if (this.state.type === 'interval' && this.isMaxValue) {
      this.hintDOMElement.textContent = (this.state.value as number[])[1].toString();
    } else if (this.state.type === 'interval') {
      this.hintDOMElement.textContent = (this.state.value as number[])[0].toString();
    } else {
      this.hintDOMElement.textContent = (this.state.value as number).toString();
    }
  }

  public setStartValueWidth(percent: number): void {
    if (this.state.direction === 'vertical') {
      this.hintDOMElement.style.top = percent - (this.hintOffset * 100) + '%';
    } else {
      this.hintDOMElement.style.left = percent - (this.hintOffset * 100) + '%';
    }
  }
}

export default HintView;