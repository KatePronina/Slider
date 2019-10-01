import IValidateValue from '../Interfaces/model/IvalidateValue';
import ICheckValue from '../Interfaces/model/ICheckValue';
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
    const value = this.validateValue({
      type: state.type,
      minValue: state.minValue,
      maxValue: state.maxValue,
      value: state.value,
      step: state.step,
    });
    const positionLength = this.createPositionLength(value, state.minValue, state.maxValue);

    return {
      ...state,
      value,
      positionLength,
    };
  }

  private createPositionLength(newValue: number | number[], minValue: number, maxValue: number): number | number[] {
    if (typeof newValue === 'number') {
      return this.countPositionLength(newValue, minValue, maxValue);
    }

    return [
      this.countPositionLength(newValue[constants.VALUE_START], minValue, maxValue),
      this.countPositionLength(newValue[constants.VALUE_END], minValue, maxValue),
    ];
  }

  private setValue = (value: number | number[], valueType?: string): void => {
    const newValue = this.validateValue({
      value,
      valueType,
      type: this.state.type,
      minValue: this.state.minValue,
      maxValue: this.state.maxValue,
      step: this.state.step,
    });
    this.state = this.validateState({ ...this.state, value: newValue });

    this.publish('onSetValue', this.state.value, this.state.positionLength);
  }

  private validateValue = (settings: IValidateValue): number | number[] => {
    if (typeof settings.value === 'undefined') {
      settings.value = settings.type === constants.TYPE_INTERVAL ?
                                          [settings.minValue, settings.maxValue] :
                                          settings.minValue;
    }

    if (settings.type === constants.TYPE_INTERVAL) {
      return this.validateIntervalValue(settings);
    }

    if (settings.type === constants.TYPE_RANGE && settings.value instanceof Array) {
      return settings.value[constants.VALUE_START];
    }

    if (typeof settings.value === 'number') {
      return this.checkValue({
        value: settings.value,
        minValue: settings.minValue,
        maxValue: settings.maxValue,
        step: settings.step,
      });
    }

    return settings.value;
  }

  private countValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private countPositionLength(value: number, minValue: number, maxValue: number): number {
    return ((value - minValue) * 100) / (maxValue - minValue);
  }

  private validateIntervalValue(settings: IValidateValue): number | number[] {
    if (typeof settings.value === 'number') {
      return this.makeIntervalValueFromNumber(settings);
    }

    if (settings.value instanceof Array) {
      const checkedValues = settings.value.map((value): number => this.checkValue({
        value,
        minValue: settings.minValue,
        maxValue: settings.maxValue,
        step: settings.step,
      }));
      return Model.validateInterval(checkedValues, settings.valueType);
    }

    return settings.value;
  }

  private makeIntervalValueFromNumber(settings: IValidateValue): number[] {
    if (typeof settings.value === 'number') {
      const checkedValue = this.checkValue({
        value: settings.value,
        minValue: settings.minValue,
        maxValue: settings.maxValue,
        step: settings.step,
      });
      if (settings.valueType === constants.VALUE_TYPE_MIN && this.state.value instanceof Array) {
        const newValue = [checkedValue, this.state.value[constants.VALUE_END]];
        return Model.validateInterval(newValue, settings.valueType);
      }

      if (settings.valueType === constants.VALUE_TYPE_MAX && this.state.value instanceof Array) {
        const newValue = [this.state.value[constants.VALUE_START], checkedValue];
        return Model.validateInterval(newValue, settings.valueType);
      }

      if (typeof settings.value === 'number' && typeof this.state.value === 'number') {
        return [settings.value, this.state.maxValue];
      }

      return this.createIntervalValue(checkedValue);
    }

    return settings.value;
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

  private checkValue(settings: ICheckValue): number {
    switch (true) {
      case settings.value >= settings.maxValue:
        return settings.maxValue;

      case settings.value <= settings.minValue:
        return settings.minValue;

      default:
        return this.validateStep(settings);
    }
  }

  private validateStep(settings: ICheckValue): number {
    const checkedValue = this.adjustValueToStep(settings);

    return checkedValue >= settings.maxValue ? settings.maxValue : checkedValue;
  }

  private adjustValueToStep(settings: ICheckValue): number {
    return ((Math.round((settings.value - settings.minValue) / settings.step)) * settings.step) + settings.minValue;
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
