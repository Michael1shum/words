import { ConfigOptions } from './types';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

export function getDevServerConfig(options: ConfigOptions): DevServerConfiguration {
  return {
    client: {
      webSocketURL: 'ws://127.0.0.1:3000/ws',
    },
    static: {
      directory: options.paths.public,
    },
    compress: true,
    port: options.port ?? 3000,
    allowedHosts: 'all',
  };
}
