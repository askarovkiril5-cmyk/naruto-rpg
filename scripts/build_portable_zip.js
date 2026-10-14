import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectRoot = 'C:\\Users\\Acer\\Desktop\\Наруто';
const clientDir = path.join(projectRoot, 'client');
const distDir = path.join(clientDir, 'dist');
const electronDist = path.join(clientDir, 'node_modules', 'electron', 'dist');
const releaseDir = path.join(projectRoot, 'release');
const portableDir = path.join(releaseDir, 'Naruto_RPG_Windows');
const zipPath = path.join(releaseDir, 'Naruto_RPG_Windows.zip');

console.log('1. Checking pre-conditions...');
if (!fs.existsSync(distDir)) {
  console.log('Building client dist first...');
  execSync('npm.cmd run build', { cwd: clientDir, stdio: 'inherit' });
}

if (!fs.existsSync(electronDist)) {
  console.error('Electron dist not found at:', electronDist);
  process.exit(1);
}

if (fs.existsSync(portableDir)) {
  fs.rmSync(portableDir, { recursive: true, force: true });
}
fs.mkdirSync(portableDir, { recursive: true });

console.log('2. Copying Electron runtime binaries...');
// Copy all files from electronDist except resources/default_app.asar
fs.cpSync(electronDist, portableDir, { recursive: true });

// Remove default_app.asar to prevent default electron splash
const defaultAsar = path.join(portableDir, 'resources', 'default_app.asar');
if (fs.existsSync(defaultAsar)) {
  fs.unlinkSync(defaultAsar);
}

console.log('3. Preparing standalone app bundle...');
const appDir = path.join(portableDir, 'resources', 'app');
fs.mkdirSync(appDir, { recursive: true });

// Copy dist into app/dist
fs.cpSync(distDir, path.join(appDir, 'dist'), { recursive: true });

// Copy icons
const iconIco = path.join(clientDir, 'electron', 'naruto_app.ico');
if (fs.existsSync(iconIco)) {
  fs.copyFileSync(iconIco, path.join(appDir, 'icon.ico'));
  fs.copyFileSync(iconIco, path.join(portableDir, 'icon.ico'));
}

// Standalone package.json
const pkgJson = {
  name: "naruto-rpg-standalone",
  version: "1.0.0",
  main: "main.js"
};
fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf8');

// Standalone main.js
const standaloneMain = `
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: '#0a0c10',
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    title: 'Наруто: Боевая Арена Шиноби (Воля Огня)',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
fs.writeFileSync(path.join(appDir, 'main.js'), standaloneMain, 'utf8');

// Rename electron.exe to NarutoRPG.exe
const oldExe = path.join(portableDir, 'electron.exe');
const newExe = path.join(portableDir, 'NarutoRPG.exe');
if (fs.existsSync(oldExe)) {
  fs.renameSync(oldExe, newExe);
}

// Create quick launcher script
const launcherBat = `@echo off
chcp 65001 >nul
start "" "%~dp0NarutoRPG.exe"
`;
fs.writeFileSync(path.join(portableDir, 'Запуск_Игры.cmd'), launcherBat, 'utf8');

// Add instructions for friends
const readmeText = `=======================================================
   NARUTO RPG: WILL OF FIRE (ЭПОХА ШИППУДЕНА)
=======================================================

КАК ИГРАТЬ С ДРУЗЬЯМИ:

1. Запустите файл "NarutoRPG.exe" (или "Запуск_Игры.cmd").
2. Игра откроется в отдельном фирменном окне с черным фоном и музыкой.
3. В игре:
   - Введите ваш ник (например: Кирилл, Саске, Наруто).
   - Введите код комнаты, который создал ваш друг (например: KONOHA-777).
   - Выберите техники для боя (30 техник шиноби).
4. Если сервер находится в сети (на Render / облаке):
   - В игре нажмите иконку ⚙️ Настройки в меню слева.
   - В разделе "🌐 Сетевой сервер" вставьте ссылку вашего сервера и нажмите "Применить адрес".

ПРИЯТНОЙ ИГРЫ И ЭПИЧНЫХ СРАЖЕНИЙ!
`;
fs.writeFileSync(path.join(portableDir, 'Инструкция_для_друзей.txt'), readmeText, 'utf8');

console.log('4. Creating ZIP archive for friends to download...');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const psZipCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${portableDir}\\*' -DestinationPath '${zipPath}' -Force"`;
execSync(psZipCommand, { stdio: 'inherit' });

// Copy directly to Desktop
const desktopZip = 'C:\\Users\\Acer\\Desktop\\Naruto_RPG_Игра_для_Друзей.zip';
fs.copyFileSync(zipPath, desktopZip);

const stats = fs.statSync(desktopZip);
console.log('SUCCESS! Portable package created for friends on Desktop:');
console.log('Desktop Archive path:', desktopZip);
console.log('Size:', (stats.size / (1024 * 1024)).toFixed(2), 'MB');
