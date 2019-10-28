import ISliderSettings from '../../../Interfaces/view/ISliderSettings';
import IComponentSliderView from '../../../Interfaces/view/IComponentSliderView';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

abstract class ComponentSliderView extends ComponentView implements IComponentSliderView {
  public barDOMElement: HTMLElement | null;
  public stripDOMElement: HTMLElement | null;
  public pointDOMElement: HTMLElement | null;
  public length: number;
  public offset: number;
  public pointWidth: number;
  public pointOffset: number;

  protected minValue: number;
  protected maxValue: number;
  protected direction: 'horizontal' | 'vertical';
  // protected value: number | number[];

  public constructor({ direction, minValue, maxValue }: ISliderSettings) {
    super();

    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
    // this.value = value;
  }

  public setSliderSizes(): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.length = this.element.offsetHeight;
      this.offset = this.element.offsetTop;
    } else {
      this.length = this.element.offsetWidth;
      this.offset = this.element.offsetLeft;
    }

    if (this.pointDOMElement) {
      this.pointWidth = this.pointDOMElement.offsetWidth;
      this.pointOffset = (this.pointWidth / 2) / this.length;
    }
  }

  protected template = require('./templates/template.hbs');

  protected countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > constants.PERCENT_MAX) percent = 1;
    if (percent < constants.PERCENT_MIN) percent = 0;
    return percent;
  }
}

export default ComponentSliderView;
