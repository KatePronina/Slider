function requireAll(r: any): void {
  return r.keys().map(r);
}

import './js/demo';
requireAll(require.context('./', true, /\.scss$/));
