function requireAll(r: any): void {
  return r.keys().map(r);
}

requireAll(require.context('./', true, /\.js|scss$/));
