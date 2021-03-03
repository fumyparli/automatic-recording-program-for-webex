const {
    app,
    BrowserWindow,
    ipcMain,
    ipcRenderer,
    inAppPurchase,
} = require("electron");
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
    const name = data.name;
    const email = data.email;
    const inputs = data.inputs;
    console.log(inputs, inputs.length);
    for (let i = 0; i < inputs.length; i++) {
        executeBot(inputs[i], name, email);
    }

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
