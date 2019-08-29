import constants from '../../../constants';
import ComponentView from '../ComponentView';
import ISliderSettings from './ISliderSettings';

abstract class ComponentSlider extends ComponentView {
  public barDOMElement: HTMLElement | null;

  public stripDOMElement: HTMLElement | null;

  public length: number;

  public offset: number;

  public pointWidth: number;

  public pointOffset: number;

  protected state: ISliderSettings;

  public countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  protected countValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  protected static countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > constants.PERCENT_MAX) percent = 1;
    if (percent < constants.PERCENT_MIN) percent = 0;
    return percent;
  }
}

export default ComponentSlider;
