import ISliderSettings from '../../../Interfaces/view/ISliderSettings';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

abstract class ComponentSliderView extends ComponentView {
  public barDOMElement: HTMLElement | null;
  public stripDOMElement: HTMLElement | null;
  public length: number;
  public offset: number;
  public pointWidth: number;
  public pointOffset: number;

  protected minValue: number;
  protected maxValue: number;
  protected direction: string;
  protected value: number | number[];

  public constructor({ direction, minValue, maxValue, value }: ISliderSettings) {
    super();

    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = value;
  }

  protected template = require('./templates/template.hbs');

  protected static countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > constants.PERCENT_MAX) percent = 1;
    if (percent < constants.PERCENT_MIN) percent = 0;
    return percent;
  }
}

export default ComponentSliderView;
