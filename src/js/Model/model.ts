import IFullSettings from '../Interfaces/IFullSettings';
import IModelSettings from '../Interfaces/model/IModelSettings';
import constants from '../constants';

class Model {
  public state: IModelSettings;

  public constructor({
                    type,
                    minValue,
                    maxValue,
                    value = type === constants.TYPE_INTERVAL ? [minValue, maxValue] : minValue,
                    step,
                   }: IFullSettings) {
    this.state = {
      type, minValue, maxValue, value, step,
    };

    this.setValue(value);
  }

  public setValue(value: number | number[], valueType?: string): void {
    if (this.state.type === constants.TYPE_INTERVAL) {
      this.setIntervalSliderValue(value, valueType);
    } else if (this.state.type === constants.TYPE_RANGE && Array.isArray(value)) {
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

  public onSetValue = (value: number | number[]): void => {};

  public onSetState = (newState: IFullSettings): void => {};

  private setIntervalSliderValue(value: number | number[], valueType?: string): void {
    if (typeof value === 'number') {
      const checkedValue = this.checkValue(value);
      if (valueType === constants.VALUE_TYPE_MIN) {
        const newValue = [checkedValue, (this.state.value as number[])[constants.VALUE_END]];
        this.state.value = Model.checkInterval(newValue, valueType);
      } else if (valueType === constants.VALUE_TYPE_MAX) {
        const newValue = [(this.state.value as number[])[constants.VALUE_START], checkedValue];
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
  }

  private static checkInterval(values: number[], valueType?: string): number[] {
    if (valueType === constants.VALUE_TYPE_MIN) {
      if (values[constants.VALUE_START] > values[constants.VALUE_END]) {
        return [values[constants.VALUE_END], values[constants.VALUE_END]];
      }
    }

    if (valueType === constants.VALUE_TYPE_MAX) {
      if (values[constants.VALUE_START] > values[constants.VALUE_END]) {
        return [values[constants.VALUE_START], values[constants.VALUE_START]];
      }
    }

    if (values[constants.VALUE_START] > values[constants.VALUE_END]) {
      return [values[constants.VALUE_END], values[constants.VALUE_END]];
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
    const valueStepCheck = ((Math.round((value - this.state.minValue) / this.state.step)) * this.state.step) + this.state.minValue;

    if (valueStepCheck >= this.state.maxValue) {
      return this.state.maxValue;
    }

    return valueStepCheck;
  }

  private createIntervalValue(value: number): number[] {
    if (this.defineValueType(value)) {
      return [(this.state.value as number[])[constants.VALUE_START], value];
    }

    return [value, (this.state.value as number[])[constants.VALUE_END]];
  }

  private defineValueType(value: number): boolean {
    const endValueDifference = (this.state.value as number[])[constants.VALUE_END] - value;
    const startValueDifference = value - (this.state.value as number[])[constants.VALUE_START];
    return endValueDifference < startValueDifference;
  }
}

export default Model;
