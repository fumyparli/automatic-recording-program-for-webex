const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const { allowedNodeEnvironmentFlags } = require("process");
const executeBot = require("./bot");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("executeBot", (event, arg) => {
    const data = JSON.parse(arg);
    executeBot(data.addr0, data.name, data.email);
    event.sender.send("done", "task-is-done");
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
