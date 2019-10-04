import IHintSettings from '../../../Interfaces/view/IHintSettings';
import IHintView from '../../../Interfaces/view/IHintView';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class HintView extends ComponentView implements IHintView {
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
    this.setNewPosition(percent);
    this.setNewValue();
  }

  private setNewValue(): void {
    if (this.type === constants.TYPE_INTERVAL && this.isMaxValue) {
      this.value instanceof Array && (this.DOMElement.textContent = this.value[constants.VALUE_END].toString());
    } else if (this.type === constants.TYPE_INTERVAL) {
      this.value instanceof Array && (this.DOMElement.textContent = this.value[constants.VALUE_START].toString());
    } else {
      (typeof this.value === 'number') && (this.DOMElement.textContent = this.value.toString());
    }
  }

  private setNewPosition(percent: number): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.DOMElement.style.top = `${percent - (this.offset * 100)}%`;
    } else {
      this.DOMElement.style.left = `${percent - (this.offset * 100)}%`;
    }
  }

  private createDOMElement(): void {
    this.DOMElement = document.createElement('div');
    this.setNewValue();

    this.DOMElement.classList.add('slider__hint');
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.DOMElement.classList.add(constants.HINT_VERTICAL_CLASS);
    }
  }
}

export default HintView;
