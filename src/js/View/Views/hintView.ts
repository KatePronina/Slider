import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class HintView extends ComponentView {
  public offset: number;
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
    this.DOMElement = hintElement;
  }

  public onChangedValue(value: number | number[], percent: number): void {
    this.state.value = value;
    if (this.state.direction === 'vertical') {
      this.DOMElement.style.top = percent - (this.offset * 100) + '%';
    } else {
      this.DOMElement.style.left = percent - (this.offset * 100) + '%';
    }
    
    if (this.state.type === 'interval' && this.isMaxValue) {
      this.DOMElement.textContent = (this.state.value as number[])[1].toString();
    } else if (this.state.type === 'interval') {
      this.DOMElement.textContent = (this.state.value as number[])[0].toString();
    } else {
      this.DOMElement.textContent = (this.state.value as number).toString();
    }
  }

  public setStartValueWidth(percent: number): void {
    if (this.state.direction === 'vertical') {
      this.DOMElement.style.top = percent - (this.offset * 100) + '%';
    } else {
      this.DOMElement.style.left = percent - (this.offset * 100) + '%';
    }
  }

  public toggleDisplay(): void {
    if (this.DOMElement.classList.contains('slider__hint--disable')) {
      this.DOMElement.classList.remove('slider__hint--disable');
    } else {
      this.DOMElement.classList.add('slider__hint--disable');
    }
  }
}

export default HintView;