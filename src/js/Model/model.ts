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
    configuration: false
  };

  public constructor({parentId,
                      type = DEFAULT_SETTINGS.TYPE,
                      minValue = DEFAULT_SETTINGS.MIN_VALUE,
                      maxValue = DEFAULT_SETTINGS.MAX_VALUE,
                      value = type === 'interval' ? [minValue, maxValue] : minValue,
                      step = DEFAULT_SETTINGS.STEP,
                      direction = DEFAULT_SETTINGS.DIRECTION,
                      hint = DEFAULT_SETTINGS.HINT,
                      scale = DEFAULT_SETTINGS.SCALE,
                      configuration = DEFAULT_SETTINGS.CONFIGURATION
                    }: Settings) {
    this.state = {parentId, type, minValue, maxValue, value, step, direction, hint, scale, configuration}
    
    this.setValue(value);
  }

  public setValue(value: number | number[], valueType?: string): void {
    if (this.state.type === 'interval') {
      if (typeof value === 'number') {
        const checkedValue = this.checkValue(value);
        if (valueType === 'min') {
          this.state.value = this.checkInterval([checkedValue, (this.state.value as number[])[1]], valueType);
        } else if (valueType === 'max') {
          this.state.value = this.checkInterval([(this.state.value as number[])[0], checkedValue], valueType);
        } else {
          this.state.value = this.createIntervalValue(checkedValue);
        }
      } else {
        const checkedValues = (value as number[]).map((val): number => {
          return this.checkValue(val);
        })
        this.state.value = this.checkInterval(checkedValues, valueType);
      }
      this.onSetValue(this.state.value);
    } else if (this.state.value != this.checkValue((value as number))) {
      this.state.value = this.checkValue((value as number));
      this.onSetValue(this.state.value);
    }
  }

  public onSetValue(value: number | number[]): void {

  }

  private checkInterval(values: number[], valueType?: string): number[] {
    if (valueType === 'min') {
      if (values[0] > values[1]) {
        return [values[1], values[1]];
      }
    }

    if (valueType === 'max') {
      if (values[0] > values[1]) {
        return [values[0], values[0]];
      }
    }

    if(values[0] > values[1]) {
      return [values[1], values[1]];
    }

    return values;
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

  private createIntervalValue(value: number): number[] {
    if ((this.state.value as number[])[1] - value < value - (this.state.value as number[])[0]) {
      return [(this.state.value as number[])[0], value];
    } else {
      return [value, (this.state.value as number[])[1]];
    }
  }
}

export default Model;