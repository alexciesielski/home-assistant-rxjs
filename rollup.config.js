export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/ha-rxjs.umd.js',
    format: 'umd',
  },
  // external: [...Object.keys(pkg.dependencies || {})],
  // plugins: [typescript(), terser()],
};
