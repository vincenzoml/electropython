import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { log } from '../../shared/logging/logger';

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    title: 'ElectroPython',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const devUrl = process.env.ELECTROPYTHON_DEV_URL ?? 'http://127.0.0.1:5173';
  if (process.env.NODE_ENV === 'production') {
    await win.loadFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    await win.loadURL(devUrl);
  }
}

app.whenReady().then(createWindow).catch(error => {
  log('error', 'electron', 'failed to create window', error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
