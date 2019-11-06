import { IModel, IModelSettings, IValidateSingleValue, IValidateIntervalValue, IValidateValues,
          ICheckValue, IConvertPercentsToIntervalValues } from '../Interfaces/model/IModel';
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
    this.notify('stateUpdated', this.state, eventType);
  }

  private validateState(state: IModelSettings, eventType?: 'positionPercentUpdated' | 'stateUpdated'): IModelSettings {
    const { direction, hint, scale, ...settings } = state;
    const { minValue, maxValue } = settings;

    const value = this.validateValue(settings, eventType);
    const positionLength = this.convertValueToPosition(value, minValue, maxValue);

    return { ...state, positionLength, value };
  }

  private validateValue(settings: IValidateValues, eventType?: string): number[] {
    const { type } = settings;

    if (type === TYPE_INTERVAL) {
      return this.validateIntervalValues({ ...settings, type }, eventType);
    }

    if (type === TYPE_SINGLE) {
      return this.validateSingleValue({ ...settings, type }, eventType);
    }

    return settings.value;
  }

  private validateSingleValue(settings: IValidateSingleValue, eventType?: string): number[] {
    const { minValue, maxValue, value, step, positionPercent } = settings;

    const newValue = eventType === 'positionPercentUpdated' && positionPercent ?
                      this.validateSingleBoundaryValue({
                        minValue, maxValue, step, value: this.convertPercentToSingleValue(positionPercent),
                      })
                      : this.validateSingleBoundaryValue({ minValue, maxValue, step, value: value[VALUE_START] });

    return [newValue];
  }

  private validateIntervalValues(settings: IValidateIntervalValue, eventType?: string): number[] {
    const { minValue, maxValue, step, value: currentValue, positionPercent, valueType } = settings;

    if (currentValue.length === 1) {
      return this.convertSingleValueToInterval({ minValue, maxValue, step, value: currentValue[VALUE_START] });
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
          this.convertPercentToSingleValue(settings.positionPercent[VALUE_START]),
          settings.currentValue[VALUE_END],
        ];
      case VALUE_TYPE_MAX:
        return [
          settings.currentValue[VALUE_START],
          this.convertPercentToSingleValue(settings.positionPercent[VALUE_START]),
        ];
      default:
        return settings.currentValue;
    }
  }

  private convertPercentToSingleValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private convertValueToPosition(newValue: number[], minValue: number, maxValue: number): number[] {
    if (newValue.length === 1) {
      return [this.countPositionOffsets(newValue[VALUE_START], minValue, maxValue)];
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

    if (this.state.value.length === 1) {
      return [settings.value, this.state.maxValue];
    }

    if (this.isSecondValueChange(validValue)) {
      return [this.state.value[VALUE_START], validValue];
    }

    return [validValue, (this.state.value)[VALUE_END]];
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
