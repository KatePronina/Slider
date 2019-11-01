import { IValidateSingleValue, IValidateIntervalValue, IValidateValues } from '../Interfaces/model/IValidateValues';
import ICheckValue from '../Interfaces/model/ICheckValue';
import IConvertPercentsToIntervalValues from '../Interfaces/model/IConvertPercentsToIntervalValues';
import IModel from '../Interfaces/model/IModel';
import IModelSettings from '../Interfaces/model/IModelSettings';
import Observer from '../Observer/Observer';
import { TYPE_INTERVAL, TYPE_SINGLE, VALUE_TYPE_MIN, VALUE_TYPE_MAX, VALUE_END, VALUE_START } from '../constants';

class Model extends Observer implements IModel {
  private state: IModelSettings;

  public constructor(state: IModelSettings) {
    super();
    this.state = this.validateState({ ...state });
  }

  public getState(): IModelSettings {
    return this.state;
  }

  public dispatchState(newState: IModelSettings, eventType: 'positionPercentUpdated' | 'stateUpdated'): void {
    this.state = this.validateState(newState, eventType);
    this.publish('stateUpdated', this.state, eventType);
  }

  private validateState(state: IModelSettings, eventType?: 'positionPercentUpdated' | 'stateUpdated'): IModelSettings {
    const { direction, hint, scale, ...settings } = state;
    const { minValue, maxValue } = settings;

    const value = this.validateValue(settings, eventType);
    const positionLength = this.convertValueToPosition(value, minValue, maxValue);

    return { ...state, positionLength, value };
  }

  private validateValue(settings: IValidateValues, eventType?: string): number | number[] {
    if (this.isIntervalType(settings)) {
      return this.validateIntervalValues(settings, eventType);
    }

    if (this.isSingleType(settings)) {
      return this.validateSingleValue(settings, eventType);
    }

    return settings.value;
  }

  private isIntervalType(settings: IValidateValues): settings is IValidateIntervalValue {
    return settings.type === TYPE_INTERVAL;
  }

  private isSingleType(settings: IValidateValues): settings is IValidateSingleValue {
    return settings.type === TYPE_SINGLE;
  }

  private validateSingleValue(settings: IValidateSingleValue, eventType?: string): number {
    const { minValue, maxValue, value, step, positionPercent } = settings;

    const newValue = eventType === 'positionPercentUpdated' && positionPercent ?
                      this.validateSingleBoundaryValue({
                        minValue, maxValue, step, value: this.convertPercentToSingleValue(positionPercent),
                      })
                      : this.validateSingleBoundaryValue({ minValue, maxValue, step, value });

    return newValue;
  }

  private validateIntervalValues(settings: IValidateIntervalValue, eventType?: string): number[] {
    const { minValue, maxValue, step, value: currentValue, positionPercent, valueType } = settings;

    if (currentValue.length === 1) {
      return this.convertSingleValueToInterval({ minValue, maxValue, step, value: currentValue[0] });
    }

    const values = eventType === 'positionPercentUpdated' && positionPercent && valueType ?
                      this.convertPercentsToIntervalValues({ currentValue, positionPercent, valueType })
                    : currentValue;

    const checkedValues = values.map((value): number =>
                            this.validateSingleBoundaryValue({ value, minValue, maxValue, step }));

    return this.validateIntervalBoundaryValues(checkedValues, valueType);
  }

  private convertPercentsToIntervalValues(settings: IConvertPercentsToIntervalValues): number[] {
    switch (settings.valueType) {
      case VALUE_TYPE_MIN:
        return [
          this.convertPercentToSingleValue(settings.positionPercent[0]),
          settings.currentValue[VALUE_END],
        ];
      case VALUE_TYPE_MAX:
        return [
          settings.currentValue[VALUE_START],
          this.convertPercentToSingleValue(settings.positionPercent[0]),
        ];
      default:
        return settings.currentValue;
    }
  }

  private convertPercentToSingleValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private convertValueToPosition(newValue: number | number[], minValue: number, maxValue: number): number[] {
    if (typeof newValue === 'number') {
      return [this.countPositionOffsets(newValue, minValue, maxValue)];
    }

    return [
      this.countPositionOffsets(newValue[VALUE_START], minValue, maxValue),
      this.countPositionOffsets(newValue[VALUE_END], minValue, maxValue),
    ];
  }

  private countPositionOffsets(value: number, minValue: number, maxValue: number): number {
    return ((value - minValue) * 100) / (maxValue - minValue);
  }

  private convertSingleValueToInterval(settings: ICheckValue): number[] {
    const validValue = this.validateSingleBoundaryValue(settings);

    if (typeof this.state.value === 'number') {
      return [settings.value, this.state.maxValue];
    }

    if (this.isSecondValueChange(validValue) && this.state.value instanceof Array) {
      return [this.state.value[VALUE_START], validValue];
    }

    if (this.state.value instanceof Array) {
      return [validValue, (this.state.value)[VALUE_END]];
    }

    return [validValue, validValue];
  }

  private validateIntervalBoundaryValues (values: number[], valueType?: string): number[] {
    if (valueType === VALUE_TYPE_MIN && values[VALUE_START] > values[VALUE_END]) {
      return [values[VALUE_END], values[VALUE_END]];
    }

    if (valueType === VALUE_TYPE_MAX && values[VALUE_START] > values[VALUE_END]) {
      return [values[VALUE_START], values[VALUE_START]];
    }

    if (values[VALUE_START] > values[VALUE_END]) {
      return [values[VALUE_END], values[VALUE_END]];
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

  private isSecondValueChange(value: number): boolean {
    if (this.state.value instanceof Array) {
      const endValueDifference = (this.state.value)[VALUE_END] - value;
      const startValueDifference = value - (this.state.value)[VALUE_START];
      return endValueDifference < startValueDifference;
    }
    return false;
  }
}

export default Model;
