import { IModelSettings } from '../model/IModel';

export interface IView {
  updateViews(value: number | number[], newPositionLength: number | number[]): void;
  redrawSlider(newSettings: IModelSettings): void;
}

export interface IViewSettings {
  $parentElement: JQuery;
  type: 'single' | 'interval';
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: 'horizontal' | 'vertical';
  hint: boolean;
  scale: boolean;
  positionLength: number[];
  positionPercent?: number | number[];
  valueType?: string;
}

export interface ISliderSettings {
  minValue: number;
  maxValue: number;
  positionLength: number[];
  $parentElement: JQuery<HTMLElement>;
  direction: 'horizontal' | 'vertical';
}

export interface ISingleSliderView {
  update(newPositionLength: number[]): void;
  dispatchPositionPercent(positionPercent: number): void;
}

export interface IScaleView {
  dispatchValue(value: number): void;
}

export interface IScaleSettings {
  minValue: number;
  maxValue: number;
  step: number;
  direction: 'horizontal' | 'vertical';
  $parentElement: JQuery<HTMLElement>;
}

export interface IIntervalSliderView {
  update(value: number[], newPositionLength: number[]): void;
  dispatchPositionPercent(positionPercent: number[], valueType: string): void;
}

export interface IHintView {
  update(value: number | number[], percent: number): void;
}

export interface IHintSettings {
  value: number | number[];
  type: 'single' | 'interval';
  direction: 'horizontal' | 'vertical';
  isMaxValue?: boolean;
  $parentElement: JQuery<HTMLElement>;
}

export interface ISingleSliderView {
  element: HTMLElement;
  getElement(): HTMLElement;
}
