import INewParams from './INewParams';

export default interface IController {
  getSettings(): void;
  onChangedSettings(params: INewParams): void;
}
