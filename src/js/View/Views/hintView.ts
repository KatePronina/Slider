import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class HintView extends ComponentView {
  public hintDOMElement: HTMLElement;
  public hintOffset: number;

  public constructor(state: FullSettings) {
    super(state);
    this.createHintDOMElement();
  }

  public createHintDOMElement(): void {
    const hintElement = document.createElement('div');
    hintElement.textContent = (this.state.value as number).toString();
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
    
    this.hintDOMElement.textContent = (this.state.value as number).toString();
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