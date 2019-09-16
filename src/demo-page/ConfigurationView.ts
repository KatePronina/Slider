import IFullSettings from '../js/Interfaces/IFullSettings';
import '../js/plugin';
import constants from '../js/constants';

class ConfigurationView {
  private containerDOMElement: Element;
  private sliderPlugin: any;
  private settings: IFullSettings;

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

  public constructor(containerDOMElement: Element, sliderClass: string, settings?: any) {
    this.containerDOMElement = containerDOMElement;

    if (settings) {
      this.sliderPlugin = $(`.${sliderClass}`).slider({ ...settings });
    } else {
      this.sliderPlugin = $(`.${sliderClass}`).slider({});
    }

    this.bindEventsToSlider(sliderClass);
    this.sliderPlugin.getSettings();
    this.renderConfiguration();

    this.sliderPlugin.setValue(39);
    this.sliderPlugin.setValue(5);
  }

  private template = require('./templates/template.hbs');

  private renderConfiguration(): void {
    const context = {
      isRange: this.settings.type === constants.TYPE_RANGE,
    };
    this.containerDOMElement.innerHTML = this.template(context);

    if (this.settings.type === constants.TYPE_RANGE) {
      this.currentValueInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_current-value');
    } else {
      this.currentMinValueInput
        = this.containerDOMElement.querySelector('.js-configuration__value-input_type_current-min-value');
      this.currentMaxValueInput
        = this.containerDOMElement.querySelector('.js-configuration__value-input_type_current-max-value');
    }
    this.stepSizeInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_step');
    this.minValueInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_min-value');
    this.maxValueInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_max-value');
    this.hintToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_hint');
    this.scaleToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_scale');
    this.typeToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_toggle-interval');
    this.verticalToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_vertical');

    this.bindEventsToInputs();
    this.updateInputs();
  }

  private updateInputs(): void {
    if (this.settings.type === constants.TYPE_RANGE && typeof this.settings.value === 'number') {
      const value = this.settings.value.toString();
      this.currentValueInput && (this.currentValueInput.value = value);
    } else if (this.settings.value instanceof Array) {
      const minValue = this.settings.value[constants.VALUE_START].toString();
      const maxValue = this.settings.value[constants.VALUE_END].toString();
      this.currentMinValueInput && (this.currentMinValueInput.value = minValue);
      this.currentMaxValueInput && (this.currentMaxValueInput.value = maxValue);
    }
    this.stepSizeInput && (this.stepSizeInput.value = (this.settings.step).toString());
    this.minValueInput && (this.minValueInput.value = (this.settings.minValue).toString());
    this.maxValueInput && (this.maxValueInput.value = (this.settings.maxValue).toString());
    this.hintToggle && (this.hintToggle.checked = this.settings.hint);
    this.scaleToggle && (this.scaleToggle.checked = this.settings.scale);
    const isInterval = this.settings.type === constants.TYPE_INTERVAL;
    this.typeToggle && (this.typeToggle.checked = isInterval);
    const isVertical = this.settings.direction === constants.DIRECTION_VERTICAL;
    this.verticalToggle && (this.verticalToggle.checked = isVertical);
  }

  private bindEventsToInputs(): void {
    if (this.settings.type === constants.TYPE_RANGE) {
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

  private onStepChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement && target.value.length > 0) {
      this.sliderPlugin.setSettings({ ...this.settings, step: parseInt(target.value, 10) });
    }
  }

  private onMinValueChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement && target.value.length > 0) {
      this.sliderPlugin.setSettings({ ...this.settings, minValue: parseInt(target.value, 10) });
    }
  }

  private onMaxValueChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement && target.value.length > 0) {
      this.sliderPlugin.setSettings({ ...this.settings, maxValue: parseInt(target.value, 10) });
    }
  }

  private onHintChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ ...this.settings, hint: !this.settings.hint });
    }
  }

  private onScaleChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ ...this.settings, scale: !this.settings.scale });
    }
  }

  private onDirectionChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newDirection = this.settings.direction === constants.DIRECTION_HORIZONTAL ?
                                                        constants.DIRECTION_VERTICAL :
                                                        constants.DIRECTION_HORIZONTAL;
      this.sliderPlugin.setSettings({ ...this.settings, direction: newDirection });
    }
  }

  private onTypeChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newType = this.settings.type === constants.TYPE_RANGE ?
                                              constants.TYPE_INTERVAL :
                                              constants.TYPE_RANGE;
      this.sliderPlugin.setSettings({ ...this.settings, type: newType });
    }
  }

  private bindInputValueEvent(input: HTMLInputElement, valueType?: string): void {
    input.addEventListener('input', (): void => {
      setTimeout((): void => {
        if (input.value.length === 0) {
          this.sliderPlugin.setValue(this.settings.minValue);
        } else if (valueType) {
          this.sliderPlugin.setValue(parseInt(input.value, 10), valueType);
        } else {
          this.sliderPlugin.setValue(parseInt(input.value, 10));
        }
      }, 800);
    });
  }

  private bindEventsToSlider(sliderClass: string): void {
    $(`.${sliderClass}`).on('slider.onNewValue', (event, value) => this.onNewValue(value));
    $(`.${sliderClass}`).on('slider.onNewSettings', (event, settings) => this.onNewSettings(settings));
  }

  private onNewValue = (value: number | number[]) => {
    if (this.settings.type === constants.TYPE_RANGE && typeof value === 'number') {
      this.currentValueInput && (this.currentValueInput.value = value.toString());
    } else if (value instanceof Array) {
      this.currentMinValueInput && (this.currentMinValueInput.value = value[constants.VALUE_START].toString());
      this.currentMaxValueInput && (this.currentMaxValueInput.value = value[constants.VALUE_END].toString());
    }
    this.settings.value = value;
  }

  private onNewSettings = (settings: IFullSettings) => {
    this.settings = settings;
    this.remove();
    this.renderConfiguration();
  }

  private remove(): void {
    this.containerDOMElement.innerHTML = '';
  }
}

export default ConfigurationView;
