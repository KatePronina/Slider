import ISliderSettings from '../../../Interfaces/view/ISliderSettings';
import IComponentSliderView from '../../../Interfaces/view/IComponentSliderView';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

abstract class ComponentSliderView extends ComponentView implements IComponentSliderView {
  public stripDOMElement: JQuery<HTMLDivElement>;
  public sliderElement: JQuery<HTMLDivElement>;
  public length: number;
  public offset: number;
  public pointWidth: number;
  public pointOffset: number;

  protected barDOMElement: JQuery<HTMLDivElement>;
  protected pointDOMElement: JQuery<HTMLDivElement>;
  protected minValue: number;
  protected maxValue: number;
  protected direction: 'horizontal' | 'vertical';

  public constructor({ direction, minValue, maxValue }: ISliderSettings) {
    super();

    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  public setSliderSizes(): void {
    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.length = parseInt(`${this.sliderElement.outerHeight()}`, 10);
      const offset = this.sliderElement.offset();
      if (offset) {
        this.offset = parseInt(`${offset.top}`, 10);
      }
    } else {
      this.length = parseInt(`${this.sliderElement.outerWidth()}`, 10);
      const offset = this.sliderElement.offset();
      if (offset) {
        this.offset = parseInt(`${offset.left}`, 10);
      }
    }

    if (this.pointDOMElement) {
      this.pointWidth = parseInt(`${this.pointDOMElement.outerWidth()}`, 10);
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
