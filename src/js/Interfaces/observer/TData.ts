import IFullSettings from '../IFullSettings';
import IModelSettings from '../model/IModelSettings';
import INewParams from '../controller/INewParams';

type TData = [
  (IFullSettings | IModelSettings | 'stateUpdated' | INewParams),
  ('stateUpdated' | 'positionPercentUpdated')?,
];

export default TData;
