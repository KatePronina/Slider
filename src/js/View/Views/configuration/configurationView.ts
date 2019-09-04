import IConfigurationSettings from '../../../Interfaces/view/IConfigurationSettings';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class ConfigurationView extends ComponentView {
  private currentValueInput: HTMLInputElement | null;
  private currentMinValueInput: HTMLInputElement | null;
  private currentMaxValueInput: HTMLInputElement | null;
  private stepSizeInput: HTMLInputElement | null;
  private minValueInput: HTMLInputElement | null;
  private maxValueInput: HTMLInputElement | null;
  private hintToggle: HTMLInputElement | null;
  private scaleToggle: HTMLInputElement | null;
  private typeToggle: HTMLInputElement | null;
  private verticalToggle: HTMLInputElement | null;

  private type: string;
  private minValue: number;
  private maxValue: number;
  private value: number | number[];
  private step: number;
  private direction: string;
  private hint: boolean;
  private scale: boolean;

  public constructor({ type, value, minValue, maxValue, hint, scale, direction, step }: IConfigurationSettings) {
    super();
    this.type = type;
    this.value = value;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.hint = hint;
    this.scale = scale;
    this.direction = direction;
    this.step = step;
    this.createDOMElement();
  }

  public onChangedValue(value: number | number[]): void {
    if (this.type === constants.TYPE_RANGE) {
      this.currentValueInput && (typeof value === 'number') && (this.currentValueInput.value = value.toString());
    } else {
      this.currentMinValueInput && (value instanceof Array) && (this.currentMinValueInput.value = value[constants.VALUE_START].toString());
      this.currentMaxValueInput && (value instanceof Array) && (this.currentMaxValueInput.value = value[constants.VALUE_END].toString());
    }
  }

  public onNewValue = (value: number | number[], valueType?: string): void => {};

  public onStepChange = (event: Event): void => {};

  public onMinValueChange = (event: Event): void => {};

  public onMaxValueChange = (event: Event): void => {};

  public onHintChange = (): void => {};

  public onScaleChange = (): void => {};

  public onDirectionChange = (): void => {};

  public onTypeChange = (): void => {};

  public bindEvents(): void {
    if (this.type === constants.TYPE_RANGE) {
      this.currentValueInput && this.bindInputValueEvent(this.currentValueInput);
    } else {
      this.currentMinValueInput && this.bindInputValueEvent(this.currentMinValueInput, constants.VALUE_TYPE_MIN);
      this.currentMaxValueInput && this.bindInputValueEvent(this.currentMaxValueInput, constants.VALUE_TYPE_MAX);
    }

    this.stepSizeInput && this.stepSizeInput.addEventListener('input', this.onStepChange);

    this.minValueInput && this.minValueInput.addEventListener('input', this.onMinValueChange);

    this.maxValueInput && this.maxValueInput.addEventListener('input', this.onMaxValueChange);

    this.hintToggle && this.hintToggle.addEventListener('change', this.onHintChange);

    this.scaleToggle && this.scaleToggle.addEventListener('change', this.onScaleChange);

    this.verticalToggle && this.verticalToggle.addEventListener('change', this.onDirectionChange);

    this.typeToggle && this.typeToggle.addEventListener('change', this.onTypeChange);
  }

  private templateRange = require('./templates/range.hbs');

  private templateInterval = require('./templates/interval.hbs');

  private createDOMElement(): void {
    const configurationForm = document.createElement('form');
    configurationForm.classList.add('configuration', 'slider-section__configuration');

    if (this.type === constants.TYPE_RANGE) {
      configurationForm.innerHTML = this.templateRange();
    } else {
      configurationForm.innerHTML = this.templateInterval();
    }

    this.DOMElement = configurationForm;
    if (this.type === constants.TYPE_RANGE) {
      this.currentValueInput = this.DOMElement.querySelector('.js-configuration__value-input_type_current-value');
    } else {
      this.currentMinValueInput = this.DOMElement.querySelector('.js-configuration__value-input_type_current-min-value');
      this.currentMaxValueInput = this.DOMElement.querySelector('.js-configuration__value-input_type_current-max-value');
    }
    this.stepSizeInput = this.DOMElement.querySelector('.js-configuration__value-input_type_step');
    this.minValueInput = this.DOMElement.querySelector('.js-configuration__value-input_type_min-value');
    this.maxValueInput = this.DOMElement.querySelector('.js-configuration__value-input_type_max-value');
    this.hintToggle = this.DOMElement.querySelector('.js-configuration__value-input_type_hint');
    this.scaleToggle = this.DOMElement.querySelector('.js-configuration__value-input_type_scale');
    this.typeToggle = this.DOMElement.querySelector('.js-configuration__value-input_type_toggle-interval');
    this.verticalToggle = this.DOMElement.querySelector('.js-configuration__value-input_type_vertical');

    this.setStartValues();
  }

  private bindInputValueEvent(input: HTMLInputElement, valueType?: string): void {
    input.addEventListener('input', (): void => {
      setTimeout((): void => {
        if (input.value.length === 0) {
          this.onNewValue(this.minValue);
        } else if (valueType) {
          this.onNewValue(parseInt(input.value, 10), valueType);
        } else {
          this.onNewValue(parseInt(input.value, 10));
        }
      }, 800);
    });
  }

  private setStartValues(): void {
    if (this.type === constants.TYPE_RANGE && typeof this.value === 'number') {
      const value = this.value.toString();
      this.currentValueInput && (this.currentValueInput.value = value);
    } else if (this.value instanceof Array) {
      const minValue = this.value[constants.VALUE_START].toString();
      const maxValue = this.value[constants.VALUE_END].toString();
      this.currentMinValueInput && (this.currentMinValueInput.value = minValue);
      this.currentMaxValueInput && (this.currentMaxValueInput.value = maxValue);
    }
    this.stepSizeInput && (this.stepSizeInput.value = (this.step).toString());
    this.minValueInput && (this.minValueInput.value = (this.minValue).toString());
    this.maxValueInput && (this.maxValueInput.value = (this.maxValue).toString());
    this.hintToggle && (this.hintToggle.checked = this.hint);
    this.scaleToggle && (this.scaleToggle.checked = this.scale);
    const isInterval = this.type === constants.TYPE_INTERVAL;
    this.typeToggle && (this.typeToggle.checked = isInterval);
    const isVertical = this.direction === constants.DIRECTION_VERTICAL;
    this.verticalToggle && (this.verticalToggle.checked = isVertical);
  }
}

export default ConfigurationView;
