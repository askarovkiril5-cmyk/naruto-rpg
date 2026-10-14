const { contextBridge } = require('electron');

// Безопасный мост IPC между Electron и React
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
