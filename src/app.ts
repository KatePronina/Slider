function requireAll(r: any): void {
  return r.keys().map(r);
}

import './demo-page/demo';
requireAll(require.context('./', true, /\.scss$/));
