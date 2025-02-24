export interface PathsConfig {
  entry: string;
  html: string;
  output: string;
  src: string;
  public: string;
  components: string;
}

export type Mode = 'development' | 'production';

export interface ConfigOptions {
  port: number;
  paths: PathsConfig;
  mode: Mode;
}
