import path from "path";
import { Mode, PathsConfig } from './config/types';
import { webpackCreateConf } from './config/webpackCreateConf';


interface EnvVariables {
  mode?: Mode;
  port?: number;
}

export default (env: EnvVariables) => {
  const paths: PathsConfig = {
    output: path.resolve(__dirname, "build"),
    entry: path.resolve(__dirname, "src", "index.tsx"),
    html: path.resolve(__dirname, "public", "index.html"),
    public: path.resolve(__dirname, "public"),
    src: path.resolve(__dirname, "src"),
    components: path.resolve(__dirname, "src", "components"),
  };

  return webpackCreateConf({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
  });
};
