import DEFAULT_SETTINGS from './defaultSettings';
import {Settings, FullSettings} from '../application.interfaces';

class Model {
  public state: FullSettings = {
    parentId: '',
    type: 'range',
    minValue: 0,
    maxValue: 100,
    value: 0,
    step: 1,
    direction: 'horizontal',
    hint: true,
    scale: false,
    configure: false
  };

  public constructor({parentId,
                      type = DEFAULT_SETTINGS.TYPE,
                      minValue = DEFAULT_SETTINGS.MIN_VALUE,
                      maxValue = DEFAULT_SETTINGS.MAX_VALUE,
                      value = minValue,
                      step = DEFAULT_SETTINGS.STEP,
                      direction = DEFAULT_SETTINGS.DIRECTION,
                      hint = DEFAULT_SETTINGS.HINT,
                      scale = DEFAULT_SETTINGS.SCALE,
                      configure = DEFAULT_SETTINGS.CONFIGURE
                    }: Settings) {
    this.state = {parentId, type, minValue, maxValue, value, step, direction, hint, scale, configure}
    
    this.state.value = this.checkValue((this.state.value) as number);
  }

  public setValue(value: number): void {
    if (this.state.value != this.checkValue(value)) {
      this.state.value = this.checkValue(value);
      this.onSetValue(this.state.value);
    }
  }

  public onSetValue(value: number | number[]): void {

  }

  private checkValue(value: number): number {
    if(value >= this.state.maxValue) {
      return this.state.maxValue;
    } else if(value <= this.state.minValue) {
      return this.state.minValue;
    } else {
      return this.checkStep(value);
    }
  }

  private checkStep(value: number): number {
    const valueStepCheck = ((Math.round((value - this.state.minValue) / this.state.step)) * this.state.step) + this.state.minValue;

    if (valueStepCheck >= this.state.maxValue) {
      return this.state.maxValue;
    }

    return valueStepCheck;
  }
}

export default Model;