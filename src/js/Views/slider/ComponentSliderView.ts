import ISliderSettings from '../../Interfaces/view/ISliderSettings';
import IComponentSliderView from '../../Interfaces/view/IComponentSliderView';
import constants from '../../constants';
import ComponentView from '../ComponentView';

abstract class ComponentSliderView extends ComponentView implements IComponentSliderView {
  public $stripElement: JQuery<HTMLDivElement>;
  public $sliderElement: JQuery<HTMLDivElement>;
  public length: number;
  public offset: number;
  public pointWidth: number;
  public pointOffset: number;

  protected $barElement: JQuery<HTMLDivElement>;
  protected $pointElement: JQuery<HTMLDivElement>;
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
    const offset = this.$sliderElement.offset();
    const lengthProperty = this.direction === constants.DIRECTION_VERTICAL ? 'outerHeight' : 'outerWidth';
    const positionProperty = this.direction === constants.DIRECTION_VERTICAL ? 'top' : 'left';

    this.length = parseInt(`${this.$sliderElement[lengthProperty]()}`, 10);

    if (offset) {
      this.offset = parseInt(`${offset[positionProperty]}`, 10);
    }

    if (this.$pointElement) {
      this.pointWidth = parseInt(`${this.$pointElement.outerWidth()}`, 10);
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
