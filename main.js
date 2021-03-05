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
const { isBuffer } = require("util");

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
        const schedule = schedules[i][0].replace(/ /g, "").split(",");
        const addr = schedules[i][1].replace(/ /g, "");
        console.log("schedule: ", schedule);
        for (let j = 0; j < schedule.length; j++) {
            const dayOfWeek = dayOfWeekMap[schedule[j].split("=")[0]];
            console.log("dayOfWeek:", dayOfWeek);
            const tmp_s = schedule[j].substr(2);
            const timeIv = [tmp_s.split("-")[0], tmp_s.split("-")[1]];
            console.log("timeIv:", timeIv);
            const startHour = timeIv[0].split(":")[0];
            const startMinute = timeIv[0].split(":")[1];
            console.log("startHour:", startHour);
            console.log("startMinute:", startMinute);
            let hourIv = +timeIv[1].split(":")[0] - +startHour;
            if (hourIv < 0) hourIv += 24;
            console.log("hourIv:", hourIv);
            let minuteIv = +timeIv[1].split(":")[1] - +startMinute;
            if (minuteIv < 0) minuteIv += 60;
            console.log("minuteIv:", minuteIv);
            const runningTime = hourIv * 60 * 60 + minuteIv * 60;
            if (runningTime >= 0) {
                scheduler.scheduleJob(
                    `05 ${startMinute} ${startHour} * * ${dayOfWeek}`,
                    () => {
                        console.log(`실행: ${startHour}시 ${startMinute}분`);
                        executeBot(addr, name, email, runningTime, event);
                    }
                );
            }
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
