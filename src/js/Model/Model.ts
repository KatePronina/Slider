import { IValidateRangeValue, IValidateIntervalValue, IValidateValues } from '../Interfaces/model/IValidateValues';
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

  public getState(): IModelSettings {
    return this.state;
  }

  public dispatchState(newState: IModelSettings, eventType: string): void {
    if (eventType === 'positionPercentUpdated') {
      newState.value = this.setValueFromPositionPercent(newState);
    }

    this.state = this.validateState(newState);
    this.publish('stateUpdated', this.state, eventType);
  }

  private validateState(state: IModelSettings): IModelSettings {
    state.value = this.validateValueType(state);

    const { direction, hint, scale, positionLength, positionPercent, ...settings } = state;

    if (this.isIntervalType(settings)) {
      const { minValue, maxValue } = settings;
      state.value = this.validateIntervalSliderValues(settings);

      return {
        ...state,
        positionLength: this.validatePositionOffsets(state.value, minValue, maxValue),
      };
    }

    if (this.isRangeType(settings)) {
      const { minValue, maxValue, value, step } = settings;
      state.value = this.validateSingleBoundaryValue({ minValue, maxValue, value, step });

      return {
        ...state,
        positionLength: this.validatePositionOffsets(state.value, minValue, maxValue),
      };
    }

    return state;
  }

  private validateValueType(state: IModelSettings): number | number[] {
    if (this.state && state.type !== this.state.type) {
      return this.setRequiredTypeForValue(state.type, state.value);
    }

    return state.value;
  }

  private setRequiredTypeForValue(type: string, value: number | number[]): number | number[] {
    if (type === constants.TYPE_INTERVAL && typeof value === 'number') {
      return [value];
    }

    if (type === constants.TYPE_RANGE && value instanceof Array) {
      return value[constants.VALUE_START];
    }

    return value;
  }

  private isIntervalType(settings: IValidateValues): settings is IValidateIntervalValue {
    return settings.type === constants.TYPE_INTERVAL;
  }

  private isRangeType(settings: IValidateValues): settings is IValidateRangeValue {
    return settings.type === constants.TYPE_RANGE;
  }

  private setValueFromPositionPercent(state: IModelSettings): number | number[] {
    if (typeof state.positionPercent === 'number') {
      state.value = this.countValue(state.positionPercent);
    }

    if (state.positionPercent instanceof Array && state.valueType && this.state.value instanceof Array) {
      switch (state.valueType) {
        case constants.VALUE_TYPE_MIN:
          state.value = [
            this.countValue(state.positionPercent[0]),
            this.state.value[constants.VALUE_END],
          ];
          break;
        case constants.VALUE_TYPE_MAX:
          state.value = [
            this.state.value[constants.VALUE_START],
            this.countValue(state.positionPercent[0]),
          ];
          break;
      }
    }

    return state.value;
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

  private countValue(percent: number): number {
    const value = ((percent * (this.state.maxValue - this.state.minValue) + this.state.minValue));
    return parseInt(value.toFixed(), 10);
  }

  private countPositionOffsets(value: number, minValue: number, maxValue: number): number {
    return ((value - minValue) * 100) / (maxValue - minValue);
  }

  private validateIntervalSliderValues(settings: IValidateIntervalValue): number | number[] {
    if (settings.value.length === 1) {
      return this.makeIntervalValueFromNumber({ ...settings, value: settings.value[0] });
    }

    const checkedValues = settings.value.map((value): number => this.validateSingleBoundaryValue({
      value,
      minValue: settings.minValue,
      maxValue: settings.maxValue,
      step: settings.step,
    }));

    return this.validateIntervalBoundaryValues(checkedValues, settings.valueType);
  }

  private makeIntervalValueFromNumber(settings: IValidateRangeValue): number[] {
    const validValue = this.validateSingleBoundaryValue({
      value: settings.value,
      minValue: settings.minValue,
      maxValue: settings.maxValue,
      step: settings.step,
    });

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
    if (settings.value >= settings.maxValue) {
      return settings.maxValue;
    }

    if (settings.value <= settings.minValue) {
      return settings.minValue;
    }

    const checkedValue = ((Math.round((settings.value - settings.minValue) / settings.step)) * settings.step)
                          + settings.minValue;
    return checkedValue >= settings.maxValue ? settings.maxValue : checkedValue;
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
