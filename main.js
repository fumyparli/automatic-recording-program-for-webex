const {
    app,
    BrowserWindow,
    ipcMain,
    ipcRenderer,
    inAppPurchase,
} = require("electron");
const { allowedNodeEnvironmentFlags } = require("process");
const executeBot = require("./bot");
const scheduler = require("node-schedule");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });
    win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("data", (event, arg) => {
    const data = JSON.parse(arg);
    const name = data.name;
    const email = data.email;
    const schedules = data.schedules;
    console.log(schedules);
    // for (let i = 0; i < schedules.length; i++) {
    //     let schedule = schedules[i].split(",");
    //     console.log("schedule: ", schedule);
    //     for (let j = 0; j < schedule.length; j++) {
    //         const timeIv = schedule[j].split("-");
    //         console.log("timeIv: ", timeIv);
    //     }
    // }
    for (let i = 0; i < schedules.length; i++) {
        let schedule = schedules[i][0].replace(/ /g, "").split(",");
        let addr = schedules[i][1].replace(/ /g, "");
        console.log("schedule: ", schedule);
        for (let j = 0; j < schedule.length; j++) {
            const timeIv = schedule[j].substr(2).split("-");
            const dayOfWeek = schedule[j][0];
            console.log("timeIv: ", timeIv[0], timeIv[1]);
            console.log("addr: ", addr);
            scheduler.scheduleJob(`${timeIv[0]} * * * * 4`, () => {
                console.log(`실행: ${timeIv[0]}초`);
                executeBot(addr, name, email, timeIv[1] - timeIv[0]);
            });
        }
    }
    // for (let i = 0; i < 60; i++) {
    //     scheduler.scheduleJob(`${i} 25 16 * * 4`, () => {
    //         console.log(`실행${i}`);
    //     });
    // }
    // for (let i = 0; i < inputs.length; i++) {
    //     executeBot(inputs[i], name, email);
    // }

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
