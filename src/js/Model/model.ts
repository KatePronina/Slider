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

  public constructor(settings: Settings) {
    this.state.parentId = settings.parentId;
    this.state.type = settings.type || DEFAULT_SETTINGS.TYPE;
    this.state.minValue = settings.minValue || DEFAULT_SETTINGS.MIN_VALUE;
    this.state.maxValue = settings.maxValue || DEFAULT_SETTINGS.MAX_VALUE;
    this.state.value = settings.value || this.state.minValue;
    this.state.step = settings.step || DEFAULT_SETTINGS.STEP;
    this.state.direction = settings.direction || DEFAULT_SETTINGS.DIRECTION;

    if (typeof settings.hint === 'undefined') {
      this.state.hint = DEFAULT_SETTINGS.HINT;
    } else {
      this.state.hint = settings.hint;
    }

    if (typeof settings.scale === 'undefined') {
      this.state.scale = DEFAULT_SETTINGS.SCALE;
    } else {
      this.state.scale = settings.scale;
    }

    if (typeof settings.configure === 'undefined') {
      this.state.configure = DEFAULT_SETTINGS.CONFIGURE;
    } else {
      this.state.configure = settings.configure;
    }
    
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