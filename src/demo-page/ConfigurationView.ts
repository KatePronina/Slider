import '../js/plugin';
import { DIRECTION_VERTICAL, TYPE_SINGLE, TYPE_INTERVAL,
        VALUE_START, VALUE_END, DIRECTION_HORIZONTAL } from '../js/constants';
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
        onNewValue: this.updateValueInInputs,
        onNewSettings: this.updateSettings,
      }});
    } else {
      this.sliderPlugin = $(`.${sliderClass}`).slider({events: {
        onNewValue: this.updateValueInInputs,
        onNewSettings: this.updateSettings,
      }});
    }
  }

  private template = require('./templates/template.hbs');

  private renderConfiguration(): void {
    this.appendConfigurationToDOM();

    if (this.settings.type === TYPE_SINGLE) {
      this.$currentValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-value');
    } else {
      this.$currentMinValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-min-value');
      this.$currentMaxValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-max-value');
    }
    this.$stepSizeInput = this.$containerElement.find('.js-configuration__value-input_type_step');
    this.$minValueInput = this.$containerElement.find('.js-configuration__value-input_type_min-value');
    this.$maxValueInput = this.$containerElement.find('.js-configuration__value-input_type_max-value');
    this.$hintToggle = this.$containerElement.find('.js-configuration__value-input_type_hint');
    this.$scaleToggle = this.$containerElement.find('.js-configuration__value-input_type_scale');
    this.$typeToggle = this.$containerElement.find('.js-configuration__value-input_type_toggle-interval');
    this.$verticalToggle = this.$containerElement.find('.js-configuration__value-input_type_vertical');

    if (this.settings.direction === DIRECTION_VERTICAL) {
      this.$sliderParentElement.addClass('slider-section__slider_direction_vertical');
    }

    this.bindEventsToInputs();
    this.updateInputs();
  }

  private appendConfigurationToDOM(): void {
    const context = {
      isSingle: this.settings.type === TYPE_SINGLE,
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

  private updateInputs(): void {
    if (this.settings.type === TYPE_SINGLE && typeof this.settings.value === 'number') {
      this.$currentValueInput.val(this.settings.value.toString());
    } else if (this.settings.value instanceof Array) {
      this.$currentMinValueInput.val(this.settings.value[VALUE_START].toString());
      this.$currentMaxValueInput.val(this.settings.value[VALUE_END].toString());
    }

    this.$stepSizeInput.val(this.settings.step.toString());
    this.$minValueInput.val(this.settings.minValue.toString());
    this.$maxValueInput.val(this.settings.maxValue.toString());
    this.$hintToggle.prop('checked', this.settings.hint);
    this.$scaleToggle.prop('checked', this.settings.scale);
    this.$typeToggle.prop('checked', this.settings.type === TYPE_INTERVAL);
    this.$verticalToggle.prop('checked', this.settings.direction === DIRECTION_VERTICAL);
  }

  private bindEventsToInputs(): void {
    if (this.settings.type === TYPE_SINGLE) {
      this.$currentValueInput.on('blur', this.handleCurrentValueBlur);
    } else {
      this.$currentMinValueInput.on('blur', this.handleCurrentMinValueBlur);
      this.$currentMaxValueInput.on('blur', this.handleCurrentMaxValueBlur);
    }

    this.$stepSizeInput.on('blur', this.handleStepInput);
    this.$minValueInput.on('blur', this.handleMinValueInput);
    this.$maxValueInput.on('blur', this.handleMaxValueInput);
    this.$hintToggle.on('change', this.handleHintChange);
    this.$scaleToggle.on('change', this.handleScaleChange);
    this.$verticalToggle.on('change', this.handleDirectionChange);
    this.$typeToggle.on('change', this.handleTypeChange);
  }

  private handleCurrentValueBlur = ({ target }: Event) => {
    const value = parseInt((<HTMLInputElement>target).value, 10);
    this.sliderPlugin.setSettings({ value });
  }

  private handleCurrentMinValueBlur = ({ target }: Event) => {
    const value = parseInt((<HTMLInputElement>target).value, 10);

    if (this.settings.value instanceof Array) {
      this.sliderPlugin.setSettings({ value: [value, this.settings.value[VALUE_END]] });
    }
  }

  private handleCurrentMaxValueBlur = ({ target }: Event) => {
    const value = parseInt((<HTMLInputElement>target).value, 10);

    if (this.settings.value instanceof Array) {
      this.sliderPlugin.setSettings({ value: [this.settings.value[VALUE_START], value] });
    }
  }

  private handleStepInput = ({ target }: Event): void => {
    if ((<HTMLInputElement>target).value.length > 0) {
      this.sliderPlugin.setSettings({ step: parseInt((<HTMLInputElement>target).value, 10) });
    }
  }

  private handleMinValueInput = ({ target }: Event): void => {
    if ((<HTMLInputElement>target).value.length > 0) {
      this.sliderPlugin.setSettings({ minValue: parseInt((<HTMLInputElement>target).value, 10) });
    }
  }

  private handleMaxValueInput = ({ target }: Event): void => {
    if ((<HTMLInputElement>target).value.length > 0) {
      this.sliderPlugin.setSettings({ maxValue: parseInt((<HTMLInputElement>target).value, 10) });
    }
  }

  private handleHintChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ hint: !this.settings.hint });
    }
  }

  private handleScaleChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      this.sliderPlugin.setSettings({ scale: !this.settings.scale });
    }
  }

  private handleDirectionChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newDirection = this.settings.direction === DIRECTION_HORIZONTAL ?
                                                        DIRECTION_VERTICAL :
                                                        DIRECTION_HORIZONTAL;

      newDirection === DIRECTION_VERTICAL ?
                        this.$sliderParentElement.addClass('slider-section__slider_direction_vertical')
                      : this.$sliderParentElement.removeClass('slider-section__slider_direction_vertical');

      this.sliderPlugin.setSettings({ direction: newDirection });
    }
  }

  private handleTypeChange = ({ target }: Event): void => {
    if (target instanceof HTMLInputElement) {
      const newType = this.settings.type === TYPE_SINGLE ?
                                              TYPE_INTERVAL :
                                              TYPE_SINGLE;
      const newValue = this.setRequiredTypeForValue(newType, this.settings.value);
      this.sliderPlugin.setSettings({ type: newType, value: newValue });
    }
  }

  private setRequiredTypeForValue(type: string, value: number | number[]): number | number[] {
    if (type === TYPE_INTERVAL && typeof value === 'number') {
      return [value];
    }

    if (type === TYPE_SINGLE && value instanceof Array) {
      return value[VALUE_START];
    }

    return value;
  }

  private updateValueInInputs = (value: number | number[]) => {
    if (this.settings.type === TYPE_SINGLE && typeof value === 'number') {
      this.$currentValueInput.val(value.toString());
    } else if (value instanceof Array) {
      this.$currentMinValueInput.val(value[VALUE_START].toString());
      this.$currentMaxValueInput.val(value[VALUE_END].toString());
    }
    this.settings.value = value;
  }

  private updateSettings = (settings: IModelSettings) => {
    this.settings = settings;
    this.removeConfiguration();
    this.renderConfiguration();
  }

  private removeConfiguration(): void {
    this.$containerElement.html('');
  }
}

export default ConfigurationView;
