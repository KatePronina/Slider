import IHintSettings from '../../../Interfaces/view/IHintSettings';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class HintView extends ComponentView {
  public offset: number;

  private isMaxValue?: boolean;
  private type: string;
  private value: number | number[];
  private direction: string;

  public constructor({ value, type, direction, isMaxValue }: IHintSettings) {
    super();
    this.value = value;
    this.type = type;
    this.direction = direction;
    this.isMaxValue = isMaxValue;
    this.createDOMElement();
  }

  public onChangedValue(value: number | number[], percent: number): void {
    this.value = value;
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.DOMElement.style.top = `${percent - (this.offset * 100)}%`;
    } else {
      this.DOMElement.style.left = `${percent - (this.offset * 100)}%`;
    }

    if (this.type === constants.TYPE_INTERVAL && this.isMaxValue) {
      this.value instanceof Array && (this.DOMElement.textContent = this.value[constants.VALUE_END].toString());
    } else if (this.type === constants.TYPE_INTERVAL) {
      this.value instanceof Array && (this.DOMElement.textContent = this.value[constants.VALUE_START].toString());
    } else {
      (typeof this.value === 'number') && (this.DOMElement.textContent = this.value.toString());
    }
  }

  public toggleDisplay(): void {
    if (this.DOMElement.classList.contains(constants.HINT_DISABLE_CLASS)) {
      this.DOMElement.classList.remove(constants.HINT_DISABLE_CLASS);
    } else {
      this.DOMElement.classList.add(constants.HINT_DISABLE_CLASS);
    }
  }

  private createDOMElement(): void {
    const hintElement = document.createElement('div');

    if (this.type === constants.TYPE_INTERVAL && this.isMaxValue) {
      this.value instanceof Array && (hintElement.textContent = this.value[constants.VALUE_END].toString());
    } else if (this.type === constants.TYPE_INTERVAL) {
      this.value instanceof Array && (hintElement.textContent = this.value [constants.VALUE_START].toString());
    } else {
      (typeof this.value === 'number') && (hintElement.textContent = this.value.toString());
    }

    hintElement.classList.add('slider__hint');
    if (this.direction === constants.DIRECTION_VERTICAL) {
      hintElement.classList.add(constants.HINT_VERTICAL_CLASS);
    }
    this.DOMElement = hintElement;
  }
}

export default HintView;
