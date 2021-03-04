const { ipcRenderer, desktopCapturer, remote } = require("electron");
const { dialog, Menu } = remote;
const fs = require("fs");
const os = require("os");
const { allowedNodeEnvironmentFlags } = require("process");

const button = document.querySelector(".button-in-regform");
const plusBtn = document.querySelector("#plusButton");
const minusBtn = document.querySelector("#minusButton");
const wrapper = document.querySelector("#inputWrapper");

const getNowDate = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    yyyy = yyyy.toString();
    mm = mm.toString();
    dd = dd.toString();
    let m = date.getHours();
    let s = date.getMinutes();

    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;

    m = m.toString();
    s = s.toString();

    let s1 = yyyy + mm + dd + m + s;
    return s1;
};

// --------------- recording code -----------------

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector("video");

// Get the available video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ["window", "screen"],
    });
    let source = null;
    for (let i = 0; i < inputSources.length; i++) {
        if (inputSources[i].name.includes("Cisco Webex")) {
            console.log("find Webex source:", inputSources[i].name);
            source = inputSources[i];
        }
    }
    if (source !== null) selectSource(source);
}

// Change the videoSource window to record
async function selectSource(source) {
    const constraints = {
        audio: true,
        video: {
            mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: source.id,
            },
        },
    };

    // Create a Stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Preview the source in a video element
    videoElement.srcObject = stream;
    videoElement.play();

    // Create the Media Recorder
    const options = { mimeType: "video/webm; codecs=vp9" };
    mediaRecorder = new MediaRecorder(stream, options);

    // Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

    // Updates the UI
}

// Captures all recorded chunks
function handleDataAvailable(e) {
    console.log("video data available");
    recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
        type: "video/webm; codecs=vp9",
    });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // const { filePath } = await dialog.showSaveDialog({
    //     buttonLabel: "Save video",
    //     defaultPath: `vid-${Date.now()}.webm`,
    // });
    const dirPath = `/Users/${os.userInfo().username}/recordedFile`;
    const filePath = dirPath + `/fumy-${getNowDate(new Date())}.webm`;
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
    fs.writeFile(filePath, buffer, () =>
        console.log("video saved successfully!")
    );
}

// --------------- front logic code -----------------

function plusHandler() {
    wrapper.insertAdjacentHTML(
        "beforeend",
        `<section class="components-wrapper">
            <h3 class="text-in-component">webex주소</h3>
            <input id="address0" class="input00" type="text" tabindex="0" placeholder="https://abc.com/qwe" required>
            <h3 class="text-in-component">수업시간</h3>
            <input class="input00 schedule" type="text" tabindex="0" placeholder="ex) 월:9-10,화:13-15,수:17-18" required>
            <br>
        </section>`
    );
    wrapper.children[wrapper.children.length - 1].children[1].focus();
}

function minusHandler() {
    if (wrapper.children.length > 4) {
        const nodeToRemove = wrapper.children[wrapper.children.length - 1];
        console.log("delete: ", nodeToRemove);
        wrapper.removeChild(nodeToRemove);
    }
}

plusBtn.addEventListener("click", plusHandler);
minusBtn.addEventListener("click", minusHandler);

button.addEventListener("click", () => {
    if (button.className === "button-in-regform") {
        let name = document.querySelector("#inputName").value;
        let email = document.querySelector("#inputEmail").value;
        let schedules = [];
        console.log(schedules);
        for (let i = 3; i < wrapper.children.length; i++) {
            if (i === 3) {
                schedules.push([
                    wrapper.children[i].children[5].value,
                    wrapper.children[i].children[1].value + "?launchApp=true",
                ]);
            } else {
                schedules.push([
                    wrapper.children[i].children[3].value,
                    wrapper.children[i].children[1].value + "?launchApp=true",
                ]);
            }
        }
        let flag = 0;
        if (name == "" || email == "") flag = 1;
        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i][0] === "" || schedules[i][1] === "") {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            button.className = "clicked-button-in-regform";
            button.textContent = "중지";
            let data = { name, email, schedules };
            console.log(data);
            ipcRenderer.on("startVideo", (arg) => {
                console.log("start받음", arg);
                getVideoSources();
                setTimeout(() => {
                    mediaRecorder.start();
                }, 3000);
            });
            ipcRenderer.on("stopVideo", (arg) => {
                console.log("stop받음", arg);
                mediaRecorder.stop();
                button.className = "button-in-regform";
                button.textContent = "실행";
                ipcRenderer.send("stopped");
            });
            ipcRenderer.send("data", JSON.stringify(data));
        }
    } else {
        console.log("중지버튼 누름");
        mediaRecorder.stop();
        ipcRenderer.on("closed", () => {
            button.className = "button-in-regform";
            button.textContent = "실행";
        });
        ipcRenderer.send("closeBrowser");
    }
});
