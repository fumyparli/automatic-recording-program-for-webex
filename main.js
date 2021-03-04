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

const dayOfWeekMap = {
    월: "1",
    화: "2",
    수: "3",
    목: "4",
    금: "5",
    토: "6",
    일: "7",
};

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
    for (let i = 0; i < schedules.length; i++) {
        let schedule = schedules[i][0].replace(/ /g, "").split(",");
        let addr = schedules[i][1].replace(/ /g, "");
        console.log("schedule: ", schedule);
        for (let j = 0; j < schedule.length; j++) {
            const timeIv = schedule[j].substr(2).split("-");
            const dayOfWeek = dayOfWeekMap[schedule[j][0]];
            console.log("timeIv: ", timeIv[0], timeIv[1]);
            console.log("addr: ", addr);
            scheduler.scheduleJob(`0 ${timeIv[0]} * * * ${dayOfWeek}`, () => {
                console.log(`실행: ${timeIv[0]}분`);
                executeBot(addr, name, email, timeIv[1] - timeIv[0], event);
            });
            // executeBot(addr, name, email, 1, event);
        }
    }
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
