export interface ISettings {
  parentElement: JQuery;
  type?: string;
  minValue?: number;
  maxValue?: number;
  value?: number | number[];
  step?: number;
  direction?: string;
  hint?: boolean;
  scale?: boolean;
  configuration?: boolean;
}

export interface IFullSettings {
  parentElement: JQuery;
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: string;
  hint: boolean;
  scale: boolean;
  configuration: boolean;
}
