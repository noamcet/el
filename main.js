const electron = require('electron')
const app = electron.app
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow
var client = require('electron-connect').client;
var path = require('path')
const { autoUpdater } = require('electron-updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create a BrowserWindow object.
  mainWindow = new BrowserWindow({
    width: 100,
    height: 100,
    frame:false , transparent:false, fullscreen:true, alwaysOnTop:true
  });

  // Load index.html file in the new window
  mainWindow.loadURL(`file://${__dirname}/index.htm`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Start our electron-connect client
 // client.create(mainWindow, {sendBounds: true});
}
//
app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});