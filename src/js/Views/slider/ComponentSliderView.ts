import { ISliderSettings } from '../../Interfaces/view/IView';
import { DIRECTION_VERTICAL, PERCENT_MAX, PERCENT_MIN } from '../../constants';
import ComponentView from '../ComponentView';

abstract class ComponentSliderView extends ComponentView {
  protected $stripElement: JQuery<HTMLDivElement>;
  protected size: number;
  protected distanceFromPageBorder: number;
  protected $sliderElement: JQuery<HTMLDivElement>;
  protected $barElement: JQuery<HTMLDivElement>;
  protected $pointElement: JQuery<HTMLDivElement>;
  protected $parentElement: JQuery<HTMLElement>;
  protected minValue: number;
  protected maxValue: number;
  protected positionLength: number[];
  protected direction: 'horizontal' | 'vertical';

  public constructor({ direction, minValue, maxValue, $parentElement, positionLength }: ISliderSettings) {
    super();

    this.direction = direction;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.$parentElement = $parentElement;
    this.positionLength = positionLength;
  }

  protected getSliderSizes(): void {
    const distanceFromPageBorder = this.$sliderElement.offset();
    const lengthProperty = this.direction === DIRECTION_VERTICAL ? 'outerHeight' : 'outerWidth';
    const positionProperty = this.direction === DIRECTION_VERTICAL ? 'top' : 'left';

    this.size = parseInt(`${this.$sliderElement[lengthProperty]()}`, 10);

    if (distanceFromPageBorder) {
      this.distanceFromPageBorder = parseInt(`${distanceFromPageBorder[positionProperty]}`, 10);
    }
  }

  protected template = require('./templates/template.hbs');

  protected countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > PERCENT_MAX) percent = 1;
    if (percent < PERCENT_MIN) percent = 0;
    return percent;
  }
}

export default ComponentSliderView;
