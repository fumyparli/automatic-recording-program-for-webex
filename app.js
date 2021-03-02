const puppeteer = require("puppeteer");

const webUrl =
    "https://hongik.webex.com/webappng/sites/hongik/meeting/download/2a4207383ca39b17bf95bce4e71fdf2f?launchApp=true";
let myName = "이승범";
const myEmail = "qkskskm7@g.hongik.ac.kr";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
    });
    const page = await browser.newPage();
    await page.goto(webUrl);
    await page.waitForSelector("#pbui_iframe");
    const frame = await page
        .frames()
        .find((frame) => frame.name() === "pbui_iframe");
    await frame.waitForSelector(".style-box-2gTpv");
    await page.keyboard.press(" ");
    await page.keyboard.press("Tab");
    for (let i = 0; i < myEmail.length; i++) {
        await page.keyboard.press(myEmail[i]);
    }
    await page.evaluate((myName) => {
        let iframe = document.querySelector("#pbui_iframe");
        let newHtml = iframe.contentWindow.document.querySelector(
            ".style-box-2gTpv"
        );
        let input = newHtml.childNodes[1].childNodes[0];
        input.value = myName;
        let btn = newHtml.childNodes[3].childNodes[0];
        btn.click();
    }, myName);
    await frame.waitForSelector(
        ".style-rest-1IrDU.style-theme-dark-iYE87.style-fte-btn-346LP.style-size-default-1y4cK.style-botton-outline-none-1M0ur"
    );
    await page.evaluate(() => {
        let iframe = document.querySelector("#pbui_iframe");
        let btn = iframe.contentWindow.document.querySelector(
            ".style-rest-1IrDU.style-theme-dark-iYE87.style-fte-btn-346LP.style-size-default-1y4cK.style-botton-outline-none-1M0ur"
        );
        btn.click();
    });
    await frame.waitForSelector("#interstitial_join_btn");
    await page.evaluate(() => {
        let iframe = document.querySelector("#pbui_iframe");
        let btn = iframe.contentWindow.document.querySelector(
            "#interstitial_join_btn"
        );
        btn.click();
    });
})();
