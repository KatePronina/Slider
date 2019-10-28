import IHintSettings from '../../../Interfaces/view/IHintSettings';
import IHintView from '../../../Interfaces/view/IHintView';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class HintView extends ComponentView implements IHintView {
  public offset: number;

  private isMaxValue?: boolean;
  private type: 'single' | 'interval';
  private value: number | number[];
  private direction: 'horizontal' | 'vertical';

  public constructor({ value, type, direction, isMaxValue }: IHintSettings) {
    super();
    this.value = value;
    this.type = type;
    this.direction = direction;
    this.isMaxValue = isMaxValue;
    this.createDOMElement();
  }

  public update (value: number | number[], percent: number): void {
    this.value = value;
    this.setNewPosition(percent);
    this.setNewValue();
  }

  public setSizes(sliderLength: number): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.offset = (this.element.offsetHeight / 2) / sliderLength;
    } else {
      this.offset = (this.element.offsetWidth / 2) / sliderLength;
    }
  }

  private setNewValue(): void {
    if (this.type === constants.TYPE_INTERVAL && this.isMaxValue) {
      this.value instanceof Array && (this.element.textContent = this.value[constants.VALUE_END].toString());
    } else if (this.type === constants.TYPE_INTERVAL) {
      this.value instanceof Array && (this.element.textContent = this.value[constants.VALUE_START].toString());
    } else {
      (typeof this.value === 'number') && (this.element.textContent = this.value.toString());
    }
  }

  private setNewPosition(percent: number): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.element.style.top = `${percent - (this.offset * 100)}%`;
    } else {
      this.element.style.left = `${percent - (this.offset * 100)}%`;
    }
  }

  private createDOMElement(): void {
    this.element = document.createElement('div');
    this.setNewValue();

    this.element.classList.add('slider__hint');
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.element.classList.add(constants.HINT_VERTICAL_CLASS);
    }
  }
}

export default HintView;
