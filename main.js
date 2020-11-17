const { app, BrowserWindow, Menu, ipcMain, Tray } = require("electron");
//const log = require("electron-log");
const Store = require("./Store");
const path = require("path");
const MainWindow = require("./MainWindow");
const AppTray = require("./AppTray");

// Set env
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let tray;

const store = new Store({
  configName: "user-settings",
  defaults: {
    settings: {
      cpuOverload: 60,
      alertFrequency: 5,
    },
  },
});

function createMainWindow() {
  mainWindow = new MainWindow("./app/index.html", isDev);

  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  //mainWindow.loadFile("./app/index.html");
}

app.on("ready", () => {
  createMainWindow();

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("settings:get", store.get("settings"));
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      // MainWindowではクローズしないで画面を隠すだけ。
      e.preventDefault();
      mainWindow.hide();
    }
    return true;
  });

  const icon = path.join(__dirname, "assets", "icons", "tray_icon.png");
  tray = new AppTray(icon, mainWindow);

  mainWindow.on("ready", () => (mainWindow = null));
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },

  {
    label: "View",
    submenu: [
      {
        label: "Toggle Navigation",
        click: () => {
          mainWindow.webContents.send("nav:toggle");
        },
      },
    ],
  },

  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

ipcMain.on("settings:set", (e, value) => {
  store.set("settings", value);
  mainWindow.webContents.send("settings:get", store.get("settings"));
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.allowRendererProcessReuse = true;
