import IFullSettings from '../Interfaces/IFullSettings';
import Observer from '../Observer/Observer';
import constants from '../constants';

class Model extends Observer {
  public state: IFullSettings;
  public positionLength: number | number[];

  public constructor({
                    $parentElement,
                    type,
                    minValue,
                    maxValue,
                    value = type === constants.TYPE_INTERVAL ? [minValue, maxValue] : minValue,
                    step,
                    direction,
                    hint,
                    scale,
                   }: IFullSettings) {
    super();
    this.state = {
      $parentElement, type, minValue, maxValue, value, step, direction, scale, hint,
    };

    this.saveValue(value);
  }

  public getSettings(): IFullSettings {
    return this.state;
  }

  public onNewPositionPercent = (positionPercent: number, valueType?: string): void => {
    const newValue = this.countValue(positionPercent);
    this.setValue(newValue, valueType);
  }

  public setValue = (value: number | number[], valueType?: string): void => {
    this.saveValue(value, valueType);
    this.publish('onSetValue', this.state.value, this.positionLength);
  }

  public onNewState(newState: IFullSettings): void {
    this.state.maxValue = newState.maxValue;
    this.state.minValue = newState.minValue;
    this.state.step = newState.step;
    this.state.type = newState.type;
    this.state.direction = newState.direction;
    this.state.hint = newState.hint;
    this.state.scale = newState.scale;
    this.setValue(newState.value);
    this.publish('onSetState', { ...newState, value: this.state.value, positionLength: this.positionLength });
  }

  private saveValue = (value: number | number[], valueType?: string) => {
    if (this.state.type === constants.TYPE_INTERVAL) {
      this.setIntervalSliderValue(value, valueType);
      if (this.state.value instanceof Array) {
        const newMinPositionLength = this.countPositionLength(this.state.value[constants.VALUE_START]);
        const newMaxPositionLength = this.countPositionLength(this.state.value[constants.VALUE_END]);
        this.positionLength = [newMinPositionLength, newMaxPositionLength];
      }
    } else if (this.state.type === constants.TYPE_RANGE && value instanceof Array) {
      this.state.value = value[constants.VALUE_START];
      this.positionLength = this.countPositionLength(this.state.value);
    } else if (typeof value === 'number' && typeof this.state.value === 'number') {
      this.state.value = this.checkValue(value);
      this.positionLength = this.countPositionLength(this.state.value);
    }
  }

  private countValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private countPositionLength(value: number): number {
    return ((value - this.state.minValue) * 100) / (this.state.maxValue - this.state.minValue);
  }

  private setIntervalSliderValue(value: number | number[], valueType?: string): void {
    if (typeof value === 'number') {
      const checkedValue = this.checkValue(value);
      if (valueType === constants.VALUE_TYPE_MIN && this.state.value instanceof Array) {
        const newValue = [checkedValue, this.state.value[constants.VALUE_END]];
        this.state.value = Model.checkInterval(newValue, valueType);
      } else if (valueType === constants.VALUE_TYPE_MAX && this.state.value instanceof Array) {
        const newValue = [this.state.value[constants.VALUE_START], checkedValue];
        this.state.value = Model.checkInterval(newValue, valueType);
      } else if (typeof value === 'number' && typeof this.state.value === 'number') {
        this.state.value = [value, this.state.maxValue];
      } else {
        this.state.value = this.createIntervalValue(checkedValue);
      }
    } else if (value instanceof Array) {
      const checkedValues = value.map((val): number => this.checkValue(val));
      this.state.value = Model.checkInterval(checkedValues, valueType);
    }
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
    const valueStepCheck = ((Math.round((value - this.state.minValue) / this.state.step)) * this.state.step)
                            + this.state.minValue;

    if (valueStepCheck >= this.state.maxValue) {
      return this.state.maxValue;
    }

    return valueStepCheck;
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
