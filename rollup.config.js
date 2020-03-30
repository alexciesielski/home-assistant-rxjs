import pkg from './package.json';
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
  },
  external: [...Object.keys(pkg.dependencies || {})],
  // plugins: [typescript(), terser()],
};
