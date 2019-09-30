import IFullSettings from '../Interfaces/IFullSettings';
import Observer from '../Observer/Observer';
import constants from '../constants';

class Model extends Observer {
  private state: IFullSettings;

  public constructor(state: IFullSettings) {
    super();
    this.state = this.validateState({ ...state });
  }

  public getSettings(): IFullSettings {
    return this.state;
  }

  public onNewPositionPercent = (positionPercent: number, valueType?: string): void => {
    const newValue = this.countValue(positionPercent);
    this.setValue(newValue, valueType);
  }

  public onNewState(newState: IFullSettings): void {
    this.state = this.validateState(newState);
    this.publish('onSetState', this.state);
  }

  private validateState(state: IFullSettings): IFullSettings {
    if (!this.state) {
      this.state = state;
    }

    this.state.maxValue = state.maxValue;
    this.state.minValue = state.minValue;
    this.state.step = state.step;
    this.state.type = state.type;
    this.state.direction = state.direction;
    this.state.hint = state.hint;
    this.state.scale = state.scale;

    if (typeof state.value === 'undefined') {
      state.value = state.type === constants.TYPE_INTERVAL ? [state.minValue, state.maxValue] : state.minValue;
    }

    const newValue = this.validateValue(state.value);
    const newPositionLength = this.createPositionLength(newValue);

    return {
      ...state,
      value: newValue,
      positionLength: newPositionLength,
    };
  }

  private createPositionLength(newValue: number | number[]): number | number[] {
    if (typeof newValue === 'number') {
      return this.countPositionLength(newValue);
    }

    return [
      this.countPositionLength(newValue[constants.VALUE_START]),
      this.countPositionLength(newValue[constants.VALUE_END]),
    ];
  }

  private setValue = (value: number | number[], valueType?: string): void => {
    const newValue = this.validateValue(value, valueType);
    this.state = this.validateState({ ...this.state, value: newValue });

    this.publish('onSetValue', this.state.value, this.state.positionLength);
  }

  private validateValue = (value: number | number[], valueType?: string): number | number[] => {
    if (this.state.type === constants.TYPE_INTERVAL) {
      return this.validateIntervalValue(value, valueType);
    }

    if (this.state.type === constants.TYPE_RANGE && value instanceof Array) {
      return value[constants.VALUE_START];
    }

    if (typeof value === 'number' && typeof this.state.value === 'number') {
      return this.checkValue(value);
    }

    return value;
  }

  private countValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private countPositionLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  private validateIntervalValue(value: number | number[], valueType?: string): number | number[] {
    if (typeof value === 'number') {
      return this.makeIntervalValueFromNumber(value, valueType);
    }

    if (value instanceof Array) {
      const checkedValues = value.map((val): number => this.checkValue(val));
      return Model.validateInterval(checkedValues, valueType);
    }

    return value;
  }

  private makeIntervalValueFromNumber(value: number, valueType?: string): number[] {
    const checkedValue = this.checkValue(value);
    if (valueType === constants.VALUE_TYPE_MIN && this.state.value instanceof Array) {
      const newValue = [checkedValue, this.state.value[constants.VALUE_END]];
      return Model.validateInterval(newValue, valueType);
    }

    if (valueType === constants.VALUE_TYPE_MAX && this.state.value instanceof Array) {
      const newValue = [this.state.value[constants.VALUE_START], checkedValue];
      return Model.validateInterval(newValue, valueType);
    }

    if (typeof value === 'number' && typeof this.state.value === 'number') {
      return [value, this.state.maxValue];
    }

    return this.createIntervalValue(checkedValue);
  }

  private static validateInterval(values: number[], valueType?: string): number[] {
    switch (true) {
      case valueType === constants.VALUE_TYPE_MIN && values[constants.VALUE_START] > values[constants.VALUE_END]:
        return [values[constants.VALUE_END], values[constants.VALUE_END]];

      case valueType === constants.VALUE_TYPE_MAX && values[constants.VALUE_START] > values[constants.VALUE_END]:
        return [values[constants.VALUE_START], values[constants.VALUE_START]];

      case values[constants.VALUE_START] > values[constants.VALUE_END]:
        return [values[constants.VALUE_END], values[constants.VALUE_END]];

      default:
        return values;
    }
  }

  private checkValue(value: number): number {
    switch (true) {
      case value >= this.state.maxValue:
        return this.state.maxValue;

      case value <= this.state.minValue:
        return this.state.minValue;

      default:
        return this.validateStep(value);
    }
  }

  private validateStep(value: number): number {
    const checkedValue = this.adjustValueToStep(value);

    return checkedValue >= this.state.maxValue ? this.state.maxValue : checkedValue;
  }

  private adjustValueToStep(value: number): number {
    return ((Math.round((value - this.state.minValue) / this.state.step)) * this.state.step) + this.state.minValue;
  }

  private createIntervalValue(value: number): number[] {
    if (this.defineValueType(value) && this.state.value instanceof Array) {
      return [this.state.value[constants.VALUE_START], value];
    }

    if (this.state.value instanceof Array) {
      return [value, (this.state.value)[constants.VALUE_END]];
    }

    return [value, value];
  }

  private defineValueType(value: number): boolean {
    if (this.state.value instanceof Array) {
      const endValueDifference = (this.state.value)[constants.VALUE_END] - value;
      const startValueDifference = value - (this.state.value)[constants.VALUE_START];
      return endValueDifference < startValueDifference;
    }
    return false;
  }
}

export default Model;
