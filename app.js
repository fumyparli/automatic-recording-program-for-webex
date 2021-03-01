const puppeteer = require("puppeteer");

const webUrl =
    "https://hongik.webex.com/webappng/sites/hongik/meeting/download/2a4207383ca39b17bf95bce4e71fdf2f?launchApp=true";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
    });
    const page = await browser.newPage();
    await page.goto(webUrl);

    const myName = "hong";
    const myEmail = "a@g.hongik.ac.kr";
    await page.waitFor(3000);
    await page.evaluate((myName, myEmail) => {
        let iframe = document.querySelector("#pbui_iframe");
        console.log(iframe);
        let newHtml = iframe.contentWindow.document.querySelector(
            ".style-box-2gTpv"
        );
        let input1 = newHtml.childNodes[1].childNodes[0];
        let input2 = newHtml.childNodes[2].childNodes[0];
        let btn = newHtml.childNodes[3].childNodes[0];
        input1.focus();
        input1.value = "이승범";

        input2.focus();
        input2.value = "qkskskm7@g.hongik.ac.kr";
        btn.ariaDisabled = "true";
        btn.click();
    });
    // await page.click(
    //     ".style-rest-1IrDU.style-theme-green-22KBC.style-join-button-yqbh_.style-size-huge-3dFcq.style-botton-outline-none-1M0ur"
    // );
    //await browser.close();
})();
