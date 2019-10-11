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
      this.sliderPlugin = $(`.${sliderClass}`).slider({ ...settings, events: {
        onNewValue: this.onNewValue,
        onNewSettings: this.onNewSettings,
      }});
    } else {
      this.sliderPlugin = $(`.${sliderClass}`).slider({events: {
        onNewValue: this.onNewValue,
        onNewSettings: this.onNewSettings,
      }});
    }

    this.renderConfiguration();
  }

  private template = require('./templates/template.hbs');

  private renderConfiguration(): void {
    this.appendConfigurationToDOM();

    this.setValueInputs();
    this.stepSizeInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_step');
    this.minValueInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_min-value');
    this.maxValueInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_max-value');
    this.hintToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_hint');
    this.scaleToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_scale');
    this.typeToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_toggle-interval');
    this.verticalToggle = this.containerDOMElement.querySelector('.js-configuration__value-input_type_vertical');

    if (this.settings.direction === constants.DIRECTION_VERTICAL) {
      this.addClassForVerticalSlider();
    }

    this.bindEventsToInputs();
    this.updateInputs();
  }

  private appendConfigurationToDOM(): void {
    const context = {
      isRange: this.settings.type === constants.TYPE_RANGE,
      valueInputs: [
        {
          label: 'Размер шага',
          type: 'step',
        },
        {
          label: 'Минимальное значение',
          type: 'min-value',
        },
        {
          label: 'Максимальное значение',
          type: 'max-value',
        },
      ],
      checkboxInputs: [
        {
          label: 'Подсказка',
          type: 'hint',
        },
        {
          label: 'Шкала',
          type: 'scale',
        },
        {
          label: 'Два значения',
          type: 'toggle-interval',
        },
        {
          label: 'Вертикальный вид',
          type: 'vertical',
        },
      ],
    };
    this.containerDOMElement.innerHTML = this.template(context);
  }

  private addClassForVerticalSlider(): void {
    this.settings.$parentElement.addClass('slider-section__slider_direction_vertical');
  }

  private setValueInputs(): void {
    if (this.settings.type === constants.TYPE_RANGE) {
      this.currentValueInput = this.containerDOMElement.querySelector('.js-configuration__value-input_type_current-value');
    } else {
      this.currentMinValueInput
        = this.containerDOMElement.querySelector('.js-configuration__value-input_type_current-min-value');
      this.currentMaxValueInput
        = this.containerDOMElement.querySelector('.js-configuration__value-input_type_current-max-value');
    }
  }

  private updateInputs(): void {
    this.updateValueInputs();
    this.stepSizeInput && (this.stepSizeInput.value = (this.settings.step).toString());
    this.minValueInput && (this.minValueInput.value = (this.settings.minValue).toString());
    this.maxValueInput && (this.maxValueInput.value = (this.settings.maxValue).toString());
    this.hintToggle && (this.hintToggle.checked = this.settings.hint);
    this.scaleToggle && (this.scaleToggle.checked = this.settings.scale);
    this.typeToggle && (this.typeToggle.checked = this.settings.type === constants.TYPE_INTERVAL);
    this.verticalToggle && (this.verticalToggle.checked = this.settings.direction === constants.DIRECTION_VERTICAL);
  }

  private updateValueInputs(): void {
    if (this.settings.type === constants.TYPE_RANGE && typeof this.settings.value === 'number') {
      const value = this.settings.value.toString();
      this.currentValueInput && (this.currentValueInput.value = value);
    } else if (this.settings.value instanceof Array) {
      const minValue = this.settings.value[constants.VALUE_START].toString();
      const maxValue = this.settings.value[constants.VALUE_END].toString();
      this.currentMinValueInput && (this.currentMinValueInput.value = minValue);
      this.currentMaxValueInput && (this.currentMaxValueInput.value = maxValue);
    }
  }

  private bindEventsToInputs(): void {
    this.bindEventsToValueInputs();

    this.stepSizeInput && this.stepSizeInput.addEventListener('input', this.onStepChange);
    this.minValueInput && this.minValueInput.addEventListener('input', this.onMinValueChange);
    this.maxValueInput && this.maxValueInput.addEventListener('input', this.onMaxValueChange);
    this.hintToggle && this.hintToggle.addEventListener('change', this.onHintChange);
    this.scaleToggle && this.scaleToggle.addEventListener('change', this.onScaleChange);
    this.verticalToggle && this.verticalToggle.addEventListener('change', this.onDirectionChange);
    this.typeToggle && this.typeToggle.addEventListener('change', this.onTypeChange);
  }

  private bindEventsToValueInputs() {
    if (this.settings.type === constants.TYPE_RANGE) {
      this.currentValueInput && this.bindInputValueEvent(this.currentValueInput);
    } else {
      this.currentMinValueInput && this.bindInputValueEvent(this.currentMinValueInput, constants.VALUE_TYPE_MIN);
      this.currentMaxValueInput && this.bindInputValueEvent(this.currentMaxValueInput, constants.VALUE_TYPE_MAX);
    }
  }

  private onNumberInputChange({ target }: Event, property: string) {
    if (target instanceof HTMLInputElement && target.value.length > 0) {
      this.sliderPlugin.setSettings({ [property]: parseInt(target.value, 10) });
    }
  }

  private onStepChange = (event: Event): void => {
    this.onNumberInputChange(event, 'step');
  }

  private onMinValueChange = (event: Event): void => {
    this.onNumberInputChange(event, 'minValue');
  }

  private onMaxValueChange = (event: Event): void => {
    this.onNumberInputChange(event, 'maxValue');
  }

  private onHintChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ hint: !this.settings.hint });
    }
  }

  private onScaleChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ scale: !this.settings.scale });
    }
  }

  private onDirectionChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newDirection = this.settings.direction === constants.DIRECTION_HORIZONTAL ?
                                                        constants.DIRECTION_VERTICAL :
                                                        constants.DIRECTION_HORIZONTAL;

      if (newDirection === constants.DIRECTION_VERTICAL) {
        this.settings.$parentElement.addClass('slider-section__slider_direction_vertical');
      } else {
        this.settings.$parentElement.removeClass('slider-section__slider_direction_vertical');
      }

      this.sliderPlugin.setSettings({ direction: newDirection });
    }
  }

  private onTypeChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newType = this.settings.type === constants.TYPE_RANGE ?
                                              constants.TYPE_INTERVAL :
                                              constants.TYPE_RANGE;
      this.sliderPlugin.setSettings({ type: newType });
    }
  }

  private bindInputValueEvent(input: HTMLInputElement, valueType?: string): void {
    input.addEventListener('input', (): void => {
      setTimeout((): void => {
        if (input.value.length === 0) {
          this.sliderPlugin.setSettings({ value: this.settings.minValue });
        } else if (valueType) {
          this.onNewIntervalValue(parseInt(input.value, 10), valueType);
        } else {
          this.sliderPlugin.setSettings({ value: parseInt(input.value, 10) });
        }
      }, 800);
    });
  }

  private onNewIntervalValue = (value: number, valueType: string) => {
    if (valueType === constants.VALUE_TYPE_MIN && this.settings.value instanceof Array) {
      this.sliderPlugin.setSettings({ value: [value, this.settings.value[constants.VALUE_END]] });
    } else if (valueType === constants.VALUE_TYPE_MAX && this.settings.value instanceof Array) {
      this.sliderPlugin.setSettings({ value: [this.settings.value[constants.VALUE_START], value] });
    }
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
