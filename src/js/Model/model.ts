import IFullSettings from '../application.interfaces';
import sliderOptions from '../sliderOptions';
import IModelSettings from './modelInterfaces';

class Model {
  public state: IModelSettings;

  public constructor({
                    type,
                    minValue,
                    maxValue,
                    value = type === sliderOptions.TYPE_INTERVAL ? [minValue, maxValue] : minValue,
                    step,
                   }: IFullSettings) {
    this.state = {
      type, minValue, maxValue, value, step,
    };

    this.setValue(value);
  }

  public setValue(value: number | number[], valueType?: string): void {
    if (this.state.type === sliderOptions.TYPE_INTERVAL) {
      if (typeof value === 'number') {
        const checkedValue = this.checkValue(value);
        if (valueType === 'min') {
          const newValue = [checkedValue, (this.state.value as number[])[sliderOptions.VALUE_END]];
          this.state.value = Model.checkInterval(newValue, valueType);
        } else if (valueType === 'max') {
          const newValue = [(this.state.value as number[])[sliderOptions.VALUE_START], checkedValue];
          this.state.value = Model.checkInterval(newValue, valueType);
        } else if (typeof value === 'number' && typeof this.state.value === 'number') {
          this.state.value = [value, this.state.maxValue];
        } else {
          this.state.value = this.createIntervalValue(checkedValue);
        }
      } else {
        const checkedValues = (value as number[]).map((val): number => this.checkValue(val));
        this.state.value = Model.checkInterval(checkedValues, valueType);
      }
      this.onSetValue(this.state.value);
    } else if (this.state.type === sliderOptions.TYPE_RANGE && Array.isArray(value)) {
      [(this.state.value as number)] = value;
    } else if (this.state.value !== this.checkValue((value as number))) {
      this.state.value = this.checkValue((value as number));
      this.onSetValue(this.state.value);
    }
  }

  public onNewState(newState: IFullSettings): void {
    this.state.maxValue = newState.maxValue;
    this.state.minValue = newState.minValue;
    this.state.step = newState.step;
    this.state.type = newState.type;
    this.setValue(newState.value);
    this.onSetState({ ...newState, value: this.state.value });
  }

  public onSetValue = (value: number | number[]): void => {

  }

  public onSetState = (newState: IFullSettings): void => {

  }

  private static checkInterval(values: number[], valueType?: string): number[] {
    if (valueType === sliderOptions.VALUE_TYPE_MIN) {
      if (values[sliderOptions.VALUE_START] > values[sliderOptions.VALUE_END]) {
        return [values[sliderOptions.VALUE_END], values[sliderOptions.VALUE_END]];
      }
    }

    if (valueType === sliderOptions.VALUE_TYPE_MAX) {
      if (values[sliderOptions.VALUE_START] > values[sliderOptions.VALUE_END]) {
        return [values[sliderOptions.VALUE_START], values[sliderOptions.VALUE_START]];
      }
    }

    if (values[sliderOptions.VALUE_START] > values[sliderOptions.VALUE_END]) {
      return [values[sliderOptions.VALUE_END], values[sliderOptions.VALUE_END]];
    }

    return values;
  }

  private checkValue(value: number): number {
    if (value >= this.state.maxValue) {
      return this.state.maxValue;
    }

    if (value <= this.state.minValue) {
      return this.state.minValue;
    }

    return this.checkStep(value);
  }

  private checkStep(value: number): number {
    let valueStepCheck = (Math.round((value - this.state.minValue) / this.state.step));
    valueStepCheck = (valueStepCheck * this.state.step) + this.state.minValue;

    if (valueStepCheck >= this.state.maxValue) {
      return this.state.maxValue;
    }

    return valueStepCheck;
  }

  private createIntervalValue(value: number): number[] {
    if ((this.state.value as number[])[sliderOptions.VALUE_END] - value < value - (this.state.value as number[])[sliderOptions.VALUE_START]) {
      return [(this.state.value as number[])[sliderOptions.VALUE_START], value];
    }

    return [value, (this.state.value as number[])[sliderOptions.VALUE_END]];
  }
}

export default Model;
