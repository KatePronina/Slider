import IHintSettings from '../../Interfaces/view/IHintSettings';
import IHintView from '../../Interfaces/view/IHintView';
import constants from '../../constants';
import ComponentView from '../ComponentView';

class HintView extends ComponentView implements IHintView {
  private offset: number;
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
    this.createElement();
  }

  public update (value: number | number[], percent: number): void {
    this.value = value;
    this.updatePosition(percent);
    this.updateValue();
  }

  public setOffset(sliderLength: number): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.offset = (this.element.offsetHeight / 2) / sliderLength;
    } else {
      this.offset = (this.element.offsetWidth / 2) / sliderLength;
    }
  }

  private updateValue(): void {
    if (this.type === constants.TYPE_INTERVAL && this.value instanceof Array) {
      this.isMaxValue ?
          this.element.textContent = this.value[constants.VALUE_END].toString()
        : this.element.textContent = this.value[constants.VALUE_START].toString();
    } else if (typeof this.value === 'number') {
      this.element.textContent = this.value.toString();
    }
  }

  private updatePosition(percent: number): void {
    const offsetProperty = this.direction === constants.DIRECTION_VERTICAL ? 'top' : 'left';
    this.element.style[offsetProperty] = `${percent - (this.offset * 100)}%`;
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.updateValue();

    this.element.classList.add('slider__hint');
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.element.classList.add(constants.HINT_VERTICAL_CLASS);
    }
  }
}

export default HintView;
