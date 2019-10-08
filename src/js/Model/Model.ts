import IValidateValue from '../Interfaces/model/IValidateValue';
import ICheckValue from '../Interfaces/model/ICheckValue';
import IModel from '../Interfaces/model/IModel';
import IModelSettings from '../Interfaces/model/IModelSettings';
import Observer from '../Observer/Observer';
import constants from '../constants';

class Model extends Observer implements IModel {
  private state: IModelSettings;

  public constructor(state: IModelSettings) {
    super();
    this.state = this.validateState({ ...state });
  }

  public getSettings(): IModelSettings {
    return this.state;
  }

  public onNewState(newState: IModelSettings, eventType: string): void {
    this.state = this.validateState(newState, eventType);
    this.publish('onSetState', this.state, eventType);
  }

  private validateState(state: IModelSettings, eventType?: string): IModelSettings {
    const value = this.validateValue({
      type: state.type,
      minValue: state.minValue,
      maxValue: state.maxValue,
      value: state.value,
      valueType: state.valueType,
      step: state.step,
      positionPercent: state.positionPercent,
    }, eventType);
    const positionLength = this.createPositionLength(value, state.minValue, state.maxValue);

    return {
      value,
      positionLength,
      type: state.type,
      minValue: state.minValue,
      maxValue: state.maxValue,
      step: state.step,
      direction: state.direction,
      hint: state.hint,
      scale: state.scale,
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

  private validateValue = (settings: IValidateValue, eventType?: string): number | number[] => {
    if (eventType === 'positionPercentUpdated' && settings.positionPercent) {
      settings.value = this.countValue(settings.positionPercent);
    }

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
      return this.adjustValuesToStartAndEnd(checkedValues, settings.valueType);
    }

    return settings.value;
  }

  private makeIntervalValueFromNumber(settings: IValidateValue): number[] {
    if (typeof settings.value === 'number') {
      const validValue = this.checkValue({
        value: settings.value,
        minValue: settings.minValue,
        maxValue: settings.maxValue,
        step: settings.step,
      });

      if (settings.valueType === constants.VALUE_TYPE_MIN && this.state.value instanceof Array) {
        const newValue = [validValue, this.state.value[constants.VALUE_END]];
        return this.adjustValuesToStartAndEnd(newValue, settings.valueType);
      }

      if (settings.valueType === constants.VALUE_TYPE_MAX && this.state.value instanceof Array) {
        const newValue = [this.state.value[constants.VALUE_START], validValue];
        return this.adjustValuesToStartAndEnd(newValue, settings.valueType);
      }

      if (typeof settings.value === 'number' && typeof this.state.value === 'number') {
        return [settings.value, this.state.maxValue];
      }

      if (this.defineIfValueIsEnd(validValue) && this.state.value instanceof Array) {
        return [this.state.value[constants.VALUE_START], validValue];
      }

      if (this.state.value instanceof Array) {
        return [validValue, (this.state.value)[constants.VALUE_END]];
      }

      return [validValue, validValue];
    }

    return settings.value;
  }

  private adjustValuesToStartAndEnd(values: number[], valueType?: string): number[] {
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

  private defineIfValueIsEnd(value: number): boolean {
    if (this.state.value instanceof Array) {
      const endValueDifference = (this.state.value)[constants.VALUE_END] - value;
      const startValueDifference = value - (this.state.value)[constants.VALUE_START];
      return endValueDifference < startValueDifference;
    }
    return false;
  }
}

export default Model;
