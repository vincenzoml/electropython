export default {
  python: {
    version: '3.14',
    requirements: 'requirements.txt',
    autoRepair: true
  },
  node: {
    packageManager: 'npm',
    autoRepair: true,
    exposeApi: true
  },
  bridge: {
    allowPythonToNode: true,
    allowNodeToPython: true,
    traceInDev: true
  },
  runtime: {
    directory: '.electropython',
    useOsAppDataInProduction: true
  },
  app: {
    defaultMode: 'electron',
    allowWebMode: true,
    allowCliMode: true,
    allowMcpServer: true,
    allowRuntimeAgentApi: true
  },
  dev: {
    enableDevApi: true,
    enablePythonConsole: true,
    enableDesignMode: true
  },
  production: {
    enableDevApi: false,
    enablePythonConsole: false,
    bindRuntimeApisToLocalhostOnly: true
  }
} as const;
