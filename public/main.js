var { app, BrowserWindow } = require("electron");
var isDev = require("electron-is-dev");
var path = require("path");

var mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    center: true,
    kiosk: !isDev,
    resizable: true,
    webPreferences: {
        nodeIntegration: true
    }
  });
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  }
  else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
  mainWindow.on('closed', function () {
    mainWindow = undefined;
  });
}

app.on('ready', createWindow);

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
