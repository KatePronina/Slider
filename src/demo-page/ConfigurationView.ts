import '../js/plugin';
import constants from '../js/constants';
import IModelSettings from '../js/Interfaces/model/IModelSettings';

class ConfigurationView {
  private $containerElement: JQuery<Element>;
  private $sliderParentElement: JQuery<Element>;
  private sliderPlugin: any;
  private settings: IModelSettings;

  private $currentValueInput: JQuery<Element>;
  private $currentMinValueInput: JQuery<Element>;
  private $currentMaxValueInput: JQuery<Element>;
  private $stepSizeInput: JQuery<Element>;
  private $minValueInput: JQuery<Element>;
  private $maxValueInput: JQuery<Element>;
  private $hintToggle: JQuery<Element>;
  private $scaleToggle: JQuery<Element>;
  private $typeToggle: JQuery<Element>;
  private $verticalToggle: JQuery<Element>;

  public constructor(containerElement: Element, sliderClass: string, settings?: any) {
    this.$containerElement = $(containerElement);
    this.$sliderParentElement = $(`.${sliderClass}`);

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
  }

  private template = require('./templates/template.hbs');

  private renderConfiguration(): void {
    this.appendConfigurationToDOM();

    this.setValueInputs();
    this.$stepSizeInput = this.$containerElement.find('.js-configuration__value-input_type_step');
    this.$minValueInput = this.$containerElement.find('.js-configuration__value-input_type_min-value');
    this.$maxValueInput = this.$containerElement.find('.js-configuration__value-input_type_max-value');
    this.$hintToggle = this.$containerElement.find('.js-configuration__value-input_type_hint');
    this.$scaleToggle = this.$containerElement.find('.js-configuration__value-input_type_scale');
    this.$typeToggle = this.$containerElement.find('.js-configuration__value-input_type_toggle-interval');
    this.$verticalToggle = this.$containerElement.find('.js-configuration__value-input_type_vertical');

    if (this.settings.direction === constants.DIRECTION_VERTICAL) {
      this.$sliderParentElement.addClass('slider-section__slider_direction_vertical');
    }

    this.bindEventsToInputs();
    this.updateInputs();
  }

  private appendConfigurationToDOM(): void {
    const context = {
      isSingle: this.settings.type === constants.TYPE_SINGLE,
      valueInputs: [
        {
          label: 'Размер шага',
          type: 'step',
          minValue: 1,
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
    this.$containerElement.html(this.template(context));
  }

  private setValueInputs(): void {
    if (this.settings.type === constants.TYPE_SINGLE) {
      this.$currentValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-value');
    } else {
      this.$currentMinValueInput
        = this.$containerElement.find('.js-configuration__value-input_type_current-min-value');
      this.$currentMaxValueInput
        = this.$containerElement.find('.js-configuration__value-input_type_current-max-value');
    }
  }

  private updateInputs(): void {
    this.updateValueInputs();
    this.$stepSizeInput.val(this.settings.step.toString());
    this.$minValueInput.val(this.settings.minValue.toString());
    this.$maxValueInput.val(this.settings.maxValue.toString());
    this.$hintToggle.prop('checked', this.settings.hint);
    this.$scaleToggle.prop('checked', this.settings.scale);
    this.$typeToggle.prop('checked', this.settings.type === constants.TYPE_INTERVAL);
    this.$verticalToggle.prop('checked', this.settings.direction === constants.DIRECTION_VERTICAL);
  }

  private updateValueInputs(): void {
    if (this.settings.type === constants.TYPE_SINGLE && typeof this.settings.value === 'number') {
      const value = this.settings.value.toString();
      this.$currentValueInput.val(value);
    } else if (this.settings.value instanceof Array) {
      const minValue = this.settings.value[constants.VALUE_START].toString();
      const maxValue = this.settings.value[constants.VALUE_END].toString();
      this.$currentMinValueInput.val(minValue);
      this.$currentMaxValueInput.val(maxValue);
    }
  }

  private bindEventsToInputs(): void {
    this.bindEventsToValueInputs();

    this.$stepSizeInput.on('input', this.stepInputHandler);
    this.$minValueInput.on('input', this.minValueInputHandler);
    this.$maxValueInput.on('input', this.maxValueInputHandler);
    this.$hintToggle.on('change', this.hintChangeHandler);
    this.$scaleToggle.on('change', this.scaleChangeHandler);
    this.$verticalToggle.on('change', this.directionChangeHandler);
    this.$typeToggle.on('change', this.typeChangeHandler);
  }

  private bindEventsToValueInputs() {
    if (this.settings.type === constants.TYPE_SINGLE) {
      this.bindInputValueEvent(this.$currentValueInput);
    } else {
      this.bindInputValueEvent(this.$currentMinValueInput, constants.VALUE_TYPE_MIN);
      this.bindInputValueEvent(this.$currentMaxValueInput, constants.VALUE_TYPE_MAX);
    }
  }

  private onNumberInputChange({ target }: Event, property: string) {
    if (target instanceof HTMLInputElement && target.value.length > 0) {
      this.sliderPlugin.setSettings({ [property]: parseInt(target.value, 10) });
    }
  }

  private stepInputHandler = (event: Event): void => {
    this.onNumberInputChange(event, 'step');
  }

  private minValueInputHandler = (event: Event): void => {
    this.onNumberInputChange(event, 'minValue');
  }

  private maxValueInputHandler = (event: Event): void => {
    this.onNumberInputChange(event, 'maxValue');
  }

  private hintChangeHandler = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ hint: !this.settings.hint });
    }
  }

  private scaleChangeHandler = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ scale: !this.settings.scale });
    }
  }

  private directionChangeHandler = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newDirection = this.settings.direction === constants.DIRECTION_HORIZONTAL ?
                                                        constants.DIRECTION_VERTICAL :
                                                        constants.DIRECTION_HORIZONTAL;

      if (newDirection === constants.DIRECTION_VERTICAL) {
        this.$sliderParentElement.addClass('slider-section__slider_direction_vertical');
      } else {
        this.$sliderParentElement.removeClass('slider-section__slider_direction_vertical');
      }

      this.sliderPlugin.setSettings({ direction: newDirection });
    }
  }

  private typeChangeHandler = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newType = this.settings.type === constants.TYPE_SINGLE ?
                                              constants.TYPE_INTERVAL :
                                              constants.TYPE_SINGLE;
      const newValue = this.setRequiredTypeForValue(newType, this.settings.value);
      this.sliderPlugin.setSettings({ type: newType, value: newValue });
    }
  }

  private setRequiredTypeForValue(type: string, value: number | number[]): number | number[] {
    if (type === constants.TYPE_INTERVAL && typeof value === 'number') {
      return [value];
    }

    if (type === constants.TYPE_SINGLE && value instanceof Array) {
      return value[constants.VALUE_START];
    }

    return value;
  }

  private bindInputValueEvent(input: JQuery<Element>, valueType?: string): void {
    input.on('input', (): void => {
      const value = input.val();
      const numberValue = typeof value === 'string' && parseInt(value, 10);

      setTimeout((): void => {
        if (numberValue && Number.isNaN(numberValue)) {
          this.sliderPlugin.setSettings({ value: this.settings.minValue });
        } else if (numberValue && valueType) {
          this.onNewIntervalValue(numberValue, valueType);
        } else if (numberValue) {
          this.sliderPlugin.setSettings({ value: numberValue });
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
    if (this.settings.type === constants.TYPE_SINGLE && typeof value === 'number') {
      this.$currentValueInput.val(value.toString());
    } else if (value instanceof Array) {
      this.$currentMinValueInput.val(value[constants.VALUE_START].toString());
      this.$currentMaxValueInput.val(value[constants.VALUE_END].toString());
    }
    this.settings.value = value;
  }

  private onNewSettings = (settings: IModelSettings) => {
    this.settings = settings;
    this.removeConfiguration();
    this.renderConfiguration();
  }

  private removeConfiguration(): void {
    this.$containerElement.html('');
  }
}

export default ConfigurationView;
