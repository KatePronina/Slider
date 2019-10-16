import { IValidateRangeValue, IValidateIntervalValue, IValidateValues } from '../Interfaces/model/IValidateValues';
import ICheckValue from '../Interfaces/model/ICheckValue';
import ICountIntervalValues from '../Interfaces/model/ICountIntervalValues';
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

  public getState(): IModelSettings {
    return this.state;
  }

  public dispatchState(newState: IModelSettings, eventType: string): void {
    this.state = this.validateState(newState, eventType);
    this.publish('stateUpdated', this.state, eventType);
  }

  private validateState(state: IModelSettings, eventType?: string): IModelSettings {
    const { direction, hint, scale, ...settings } = state;
    const { minValue, maxValue } = settings;

    const value = this.validateValue(settings, eventType);
    const positionLength = this.validatePositionOffsets(value, minValue, maxValue);

    return { ...state, positionLength, value };
  }

  private validateValue(settings: IValidateValues, eventType?: string): number | number[] {
    if (this.isIntervalType(settings)) {
      return this.validateIntervalValues(settings, eventType);
    }

    if (this.isRangeType(settings)) {
      return this.validateRangeValue(settings, eventType);
    }

    return settings.value;
  }

  private isIntervalType(settings: IValidateValues): settings is IValidateIntervalValue {
    return settings.type === constants.TYPE_INTERVAL;
  }

  private isRangeType(settings: IValidateValues): settings is IValidateRangeValue {
    return settings.type === constants.TYPE_RANGE;
  }

  private validateRangeValue(settings: IValidateRangeValue, eventType?: string): number {
    const { minValue, maxValue, value, step, positionPercent } = settings;

    const newValue = eventType === 'positionPercentUpdated' && positionPercent ?
                      this.validateSingleBoundaryValue({
                        minValue, maxValue, step, value: this.countSingleValue(positionPercent),
                      })
                      : this.validateSingleBoundaryValue({ minValue, maxValue, step, value });

    return newValue;
  }

  private validateIntervalValues(settings: IValidateIntervalValue, eventType?: string): number | number[] {
    const { minValue, maxValue, step, value: currentValue, positionPercent, valueType } = settings;

    if (currentValue.length === 1) {
      return this.makeIntervalValueFromNumber({ minValue, maxValue, step, value: currentValue[0] });
    }

    const values = eventType === 'positionPercentUpdated' && positionPercent && valueType ?
                      this.countIntervalValues({ currentValue, positionPercent, valueType })
                    : currentValue;

    const checkedValues = values.map((value): number =>
                            this.validateSingleBoundaryValue({ value, minValue, maxValue, step }));

    return this.validateIntervalBoundaryValues(checkedValues, valueType);
  }

  private countIntervalValues(settings: ICountIntervalValues): number[] {
    switch (settings.valueType) {
      case constants.VALUE_TYPE_MIN:
        return [
          this.countSingleValue(settings.positionPercent[0]),
          settings.currentValue[constants.VALUE_END],
        ];
      case constants.VALUE_TYPE_MAX:
        return [
          settings.currentValue[constants.VALUE_START],
          this.countSingleValue(settings.positionPercent[0]),
        ];
      default:
        return settings.currentValue;
    }
  }

  private countSingleValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private validatePositionOffsets(newValue: number | number[], minValue: number, maxValue: number): number | number[] {
    if (typeof newValue === 'number') {
      return this.countPositionOffsets(newValue, minValue, maxValue);
    }

    return [
      this.countPositionOffsets(newValue[constants.VALUE_START], minValue, maxValue),
      this.countPositionOffsets(newValue[constants.VALUE_END], minValue, maxValue),
    ];
  }

  private countPositionOffsets(value: number, minValue: number, maxValue: number): number {
    return ((value - minValue) * 100) / (maxValue - minValue);
  }

  private makeIntervalValueFromNumber(settings: ICheckValue): number[] {
    const validValue = this.validateSingleBoundaryValue(settings);

    if (typeof this.state.value === 'number') {
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

  private validateIntervalBoundaryValues (values: number[], valueType?: string): number[] {
    if (valueType === constants.VALUE_TYPE_MIN && values[constants.VALUE_START] > values[constants.VALUE_END]) {
      return [values[constants.VALUE_END], values[constants.VALUE_END]];
    }

    if (valueType === constants.VALUE_TYPE_MAX && values[constants.VALUE_START] > values[constants.VALUE_END]) {
      return [values[constants.VALUE_START], values[constants.VALUE_START]];
    }

    if (values[constants.VALUE_START] > values[constants.VALUE_END]) {
      return [values[constants.VALUE_END], values[constants.VALUE_END]];
    }

    return values;
  }

  private validateSingleBoundaryValue(settings: ICheckValue): number {
    const { minValue, maxValue, value, step } = settings;

    if (value >= maxValue) {
      return maxValue;
    }

    if (value <= minValue) {
      return minValue;
    }

    const checkedValue = ((Math.round((value - minValue) / step)) * step) + minValue;
    return checkedValue >= maxValue ? maxValue : checkedValue;
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
