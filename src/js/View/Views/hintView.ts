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
    this.hintDOMElement = hintElement;
  }

  public getDOMElement(): HTMLElement {
    return this.hintDOMElement;
  }

  public onChangedValue(value: number | number[], percent: number): void {
    this.state.value = value;
    this.hintDOMElement.style.left = percent - (this.hintOffset * 100) + '%';
    this.hintDOMElement.textContent = (this.state.value as number).toString();
  }

  public setStartValueWidth(percent: number): void {
    this.hintDOMElement.style.left = percent - (this.hintOffset * 100) + '%';
  }
}

export default HintView;