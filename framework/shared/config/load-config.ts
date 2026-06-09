import config from '../../../electropython.config';

export type ElectroPythonConfig = typeof config;

export function loadConfig(): ElectroPythonConfig {
  return config;
}
