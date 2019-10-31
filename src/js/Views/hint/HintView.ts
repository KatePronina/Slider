import IHintSettings from '../../Interfaces/view/IHintSettings';
import IHintView from '../../Interfaces/view/IHintView';
import constants from '../../constants';
import ComponentView from '../ComponentView';

class HintView extends ComponentView implements IHintView {
  private isMaxValue?: boolean;
  private type: 'single' | 'interval';
  private value: number | number[];
  private direction: 'horizontal' | 'vertical';

  public constructor({ value, type, direction, isMaxValue, $parentElement }: IHintSettings) {
    super();
    this.value = value;
    this.type = type;
    this.direction = direction;
    this.isMaxValue = isMaxValue;
    this.makeElement();
    $parentElement.append(this.element);
  }

  public update (value: number | number[], percent: number): void {
    this.value = value;
    this.updatePosition(percent);
    this.rewriteTextContent();
  }

  private rewriteTextContent(): void {
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
    this.element.style[offsetProperty] = `${percent}%`;
  }

  private makeElement(): void {
    this.element = document.createElement('div');
    this.rewriteTextContent();

    this.element.classList.add('slider__hint');
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.element.classList.add(constants.HINT_VERTICAL_CLASS);
    }
  }
}

export default HintView;
