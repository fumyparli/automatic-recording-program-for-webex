const excuteBot = require("./bot");
const schedule = require("node-schedule");

const webUrl =
    "https://hongik.webex.com/webappng/sites/hongik/meeting/download/2a4207383ca39b17bf95bce4e71fdf2f?launchApp=true";
let myName = "이승범";
const myEmail = "qkskskm7@g.hongik.ac.kr";

// let job = schedule.scheduleJob("0 10 18 2 3 *", () => {
//     let now = new Date();
//     console.log("current time: ", now);
//     excuteBot(webUrl, myName, myEmail);
// });
excuteBot(webUrl, myName, myEmail);
