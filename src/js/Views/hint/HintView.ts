import { IHintSettings, IHintView } from '../../Interfaces/view/IView';
import { TYPE_INTERVAL, VALUE_END, VALUE_START, DIRECTION_VERTICAL, HINT_VERTICAL_CLASS } from '../../constants';

class HintView implements IHintView {
  private element: HTMLElement;
  private isMaxValue?: boolean;
  private type: 'single' | 'interval';
  private value: number | number[];
  private direction: 'horizontal' | 'vertical';

  public constructor({ value, type, direction, isMaxValue, $parentElement }: IHintSettings) {
    this.value = value;
    this.type = type;
    this.direction = direction;
    this.isMaxValue = isMaxValue;
    this.establishElement();
    $parentElement.append(this.element);
  }

  public updateHint (value: number | number[], percent: number): void {
    this.value = value;
    this.updatePosition(percent);
    this.rewriteHintValue();
  }

  private rewriteHintValue(): void {
    if (this.type === TYPE_INTERVAL && this.value instanceof Array) {
      this.isMaxValue ?
          this.element.textContent = this.value[VALUE_END].toString()
        : this.element.textContent = this.value[VALUE_START].toString();
    } else if (typeof this.value === 'number') {
      this.element.textContent = this.value.toString();
    }
  }

  private updatePosition(percent: number): void {
    const offsetProperty = this.direction === DIRECTION_VERTICAL ? 'top' : 'left';
    this.element.style[offsetProperty] = `${percent}%`;
  }

  private establishElement(): void {
    this.element = document.createElement('div');
    this.rewriteHintValue();

    this.element.classList.add('slider__hint');
    if (this.direction === DIRECTION_VERTICAL) {
      this.element.classList.add(HINT_VERTICAL_CLASS);
    }
  }
}

export default HintView;
