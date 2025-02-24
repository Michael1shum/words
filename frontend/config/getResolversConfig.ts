import { Configuration } from 'webpack';
import { ConfigOptions } from './types';

export function getResolversConfig(options: ConfigOptions): Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': options.paths.src,
      '@components': options.paths.components,
    },
  };
}
