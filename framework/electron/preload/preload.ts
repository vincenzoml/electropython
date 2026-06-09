import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electropython', {
  mode: 'electron',
  version: '0.1.0'
});
