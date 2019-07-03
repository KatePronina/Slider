import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

abstract class ComponentSlider extends ComponentView {
  public barDOMElement: HTMLElement | null;
  public stripDOMElement: HTMLElement | null;

  public sliderLength: number;
  public sliderOffset: number;
  public pointWidth: number;
  public pointOffset: number;

  public constructor(state: FullSettings) {
    super(state);
  }

  public countLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  protected countValue(percent: number): number {
    return parseInt(((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue)).toFixed());  
  }

  protected countPercent(coordinate: number, length: number): number {
    let percent = coordinate / length;
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    return percent;
  }
}

export default ComponentSlider;