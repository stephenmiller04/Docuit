const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const Menu = electron.Menu;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 960, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
ipcMain.on('openFile', (event, path) => {
   const {dialog} = require('electron')
   const fs = require('fs')
   dialog.showOpenDialog(function (fileNames) {

      // fileNames is an array that contains all the selected
      if(fileNames === undefined) {
         console.log("No file selected");

      } else {
         readFile(fileNames[0]);
      }
   });

   function readFile(filepath) {
      fs.readFile(filepath, 'utf-8', (err, data) => {

         if(err){
            alert("An error ocurred reading the file :" + err.message)
            return
         }

         // handle the file content
         event.sender.send('fileData', data)
      })
   }
})
app.on('ready', createWindow)

app.on('ready', function () {
  const menuTemplate = [
      {
          label: 'Docuit',
          submenu: [
              {
                  label: 'About',
                  click: () => {
                      aboutWindow = new BrowserWindow({width: 360, height: 300, frame: false});
                      aboutWindow.setResizable(false);
                      aboutWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'about.html'),
                        protocol: 'file:',
                        slashes: true
                      }))
                  }
              },
              {
                  type: 'separator'
              },
              {
                  label: 'Quit',
                  click: () => {
                      app.quit();
                  }
              }
          ]
      },
      {
      label: 'Edit',
      submenu: [
         {
            role: 'undo'
         },
         {
            role: 'redo'
         },
         {
            type: 'separator'
         },
         {
            role: 'cut'
         },
         {
            role: 'copy'
         },
         {
            role: 'paste'
         }
      ]
   }
  ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
