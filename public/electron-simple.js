const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false
  });

  // 加载应用
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
    
  mainWindow.loadURL(startUrl);

  // 显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 当窗口关闭时发出
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在macOS上，当点击dock图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});