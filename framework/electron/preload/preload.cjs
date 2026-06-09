const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electropython', {
  mode: 'electron',
  version: '0.1.0'
});
