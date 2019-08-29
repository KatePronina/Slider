import IFullSettings from '../../../IFullSettings';
import sliderOptions from '../../../sliderOptions';
import ComponentView from '../ComponentView';
import IHintSettings from './IHintSettings';

class HintView extends ComponentView {
  public offset: number;

  private isMaxValue?: boolean;

  private state: IHintSettings;

  public constructor({ value, type, direction }: IFullSettings, isMaxValue?: boolean) {
    super();
    this.state = { value, type, direction };
    this.isMaxValue = isMaxValue;
    this.createDOMElement();
  }

  public onChangedValue(value: number | number[], percent: number): void {
    this.state.value = value;
    if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
      this.DOMElement.style.top = `${percent - (this.offset * 100)}%`;
    } else {
      this.DOMElement.style.left = `${percent - (this.offset * 100)}%`;
    }

    if (this.state.type === sliderOptions.TYPE_INTERVAL && this.isMaxValue) {
      this.DOMElement.textContent = (this.state.value as number[])[1].toString();
    } else if (this.state.type === sliderOptions.TYPE_INTERVAL) {
      this.DOMElement.textContent = (this.state.value as number[])[0].toString();
    } else {
      this.DOMElement.textContent = (this.state.value as number).toString();
    }
  }

  public toggleDisplay(): void {
    if (this.DOMElement.classList.contains(sliderOptions.HINT_DISABLE_CLASS)) {
      this.DOMElement.classList.remove(sliderOptions.HINT_DISABLE_CLASS);
    } else {
      this.DOMElement.classList.add(sliderOptions.HINT_DISABLE_CLASS);
    }
  }

  private createDOMElement(): void {
    const hintElement = document.createElement('div');

    if (this.state.type === sliderOptions.TYPE_INTERVAL && this.isMaxValue) {
      hintElement.textContent = (this.state.value as number[])[1].toString();
    } else if (this.state.type === sliderOptions.TYPE_INTERVAL) {
      hintElement.textContent = (this.state.value as number[])[0].toString();
    } else {
      hintElement.textContent = (this.state.value as number).toString();
    }

    hintElement.classList.add('slider__hint');
    if (this.state.direction === sliderOptions.DIRECTION_VERTICAL) {
      hintElement.classList.add(sliderOptions.HINT_VERTICAL_CLASS);
    }
    this.DOMElement = hintElement;
  }
}

export default HintView;
