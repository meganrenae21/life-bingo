const electron = require("electron");
const { app, BrowserWindow, Menu } = require("electron");
const openAboutWindow = require("about-window").default;
const join = require("path").join;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "build/icon.ico"
  });

  var createModal = (htmlFile, parentWindow, width, height) => {
    let modal = new BrowserWindow({
      width: width,
      height: height,
      modal: true,
      parent: parentWindow,
      webPreferences: {
        nodeIntegration: true
      }
    });

    modal.loadFile(htmlFile);

    return modal;
  };

  const menu = Menu.buildFromTemplate([
    {
      label: "Help",
      submenu: [
        {
          label: "README",
          click() {
            createModal("README.html", win, 400, 400);
          }
        },
        {
          label: "Your Best Self Website",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("http://meganrenae21.github.io");
          }
        }
      ]
    },
    {
      label: "About",
      submenu: [
        {
          label: "About This App",
          click: () =>
            openAboutWindow({
              icon_path: join(__dirname, "build/icon.ico"),
              package_json_dir: join(__dirname, "package-lock.json"),
              copyright:
                "Copyright (c) 2020 Megan Renae the 21st, distributed under MIT license",
              product_name: "Your Best Self Bingo version",
              use_version_info: true
            })
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadFile("index.html");
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
