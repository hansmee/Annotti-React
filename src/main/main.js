const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const menu = require('./menu.js');
const selectDir = require('./select-dirs.js');
const setProjectManager = require('./set-project-manager.js');

global.projectManager = null;
var mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    center: true,
    kiosk: !isDev,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
  mainWindow.on('closed', function () {
    mainWindow = undefined;
  });
}

ipcMain.on('selectDir', selectDir);
ipcMain.on('setProjectManager', setProjectManager);

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(menu);
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
