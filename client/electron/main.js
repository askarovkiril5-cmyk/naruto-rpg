import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.setName('NarutoRPG');
app.setPath('userData', path.join(app.getPath('appData'), 'NarutoRPG_Data'));

let mainWindow;

import http from 'http';
import { spawn } from 'child_process';

function ensureServerRunning() {
  const req = http.get('http://localhost:4000/api/rules/versions', (res) => {
    // Сервер уже активен
  });
  req.on('error', () => {
    try {
      const serverScript = path.join(__dirname, '../../server/index.js');
      const serverCwd = path.join(__dirname, '../../server');
      const child = spawn('node', [serverScript], {
        detached: true,
        stdio: 'ignore',
        cwd: serverCwd
      });
      child.unref();
    } catch (e) {
      console.warn('Не удалось автоматически запустить локальный сервер:', e.message);
    }
  });
}

function createWindow() {
  ensureServerRunning();

  const iconPath = path.join(__dirname, 'icon.ico');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: '#0a0c10',
    show: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Наруто: Боевая Арена Шиноби (Воля Огня)',
  });

  // Открываем окно только когда готово к показу для отсутствия белых вспышек
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const serverUrl = process.env.SERVER_URL || 'http://localhost:4000';
  const isViteDev = process.env.VITE_DEV === 'true';

  if (isViteDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // Загружаем сервер, либо пробуем fallback на dist
    const tryLoad = (retries = 3) => {
      mainWindow.loadURL(serverUrl).catch(() => {
        if (retries > 0) {
          setTimeout(() => tryLoad(retries - 1), 700);
        } else {
          mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
        }
      });
    };
    tryLoad();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
