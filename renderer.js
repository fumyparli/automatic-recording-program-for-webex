const { ipcRenderer, desktopCapturer, remote } = require("electron");
const { writeFile } = require("fs");
const { dialog, Menu } = remote;

const button = document.querySelector(".button-in-regform");
const plusBtn = document.querySelector("#plusButton");
const minusBtn = document.querySelector("#minusButton");
const wrapper = document.querySelector("#inputWrapper");

// --------------- recording code -----------------

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector("video");

const startBtn = document.getElementById("startBtn");
startBtn.onclick = (e) => {
    mediaRecorder.start();
    startBtn.classList.add("is-danger");
    startBtn.innerText = "Recording";
};

const stopBtn = document.getElementById("stopBtn");

stopBtn.onclick = (e) => {
    mediaRecorder.stop();
    startBtn.classList.remove("is-danger");
    startBtn.innerText = "Start";
};

const videoSelectBtn = document.getElementById("videoSelectBtn");
videoSelectBtn.onclick = getVideoSources;

// Get the available video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ["window", "screen"],
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map((source) => {
            return {
                label: source.name,
                click: () => selectSource(source),
            };
        })
    );

    videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {
    videoSelectBtn.innerText = source.name;

    const constraints = {
        audio: false,
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

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: "Save video",
        defaultPath: `vid-${Date.now()}.webm`,
    });

    if (filePath) {
        writeFile(filePath, buffer, () =>
            console.log("video saved successfully!")
        );
    }
}

// --------------- front logic code -----------------

function plusHandler() {
    wrapper.insertAdjacentHTML(
        "beforeend",
        `<section class="components-wrapper">
            <h3 class="text-in-component">webex주소</h3>
            <input id="address0" class="input00" type="text" tabindex="0" placeholder="https://abc.com/qwe" required>
            <h3 class="text-in-component">수업시간</h3>
            <input class="input00 schedule" type="text" tabindex="0" placeholder="ex) 월:9-10,화:13-15,수:17-18">
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
    let name = document.querySelector("#inputName").value;
    let email = document.querySelector("#inputEmail").value;
    let schedules = [];
    console.log(schedules);
    for (let i = 3; i < wrapper.children.length; i++) {
        if (i === 3) {
            schedules.push([
                wrapper.children[i].children[5].value,
                wrapper.children[i].children[1].value,
            ]);
        } else {
            schedules.push([
                wrapper.children[i].children[3].value,
                wrapper.children[i].children[1].value,
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
        let data = { name, email, schedules };
        console.log(data);
        ipcRenderer.on("done", (arg) => {
            console.log(arg);
        });
        ipcRenderer.send("data", JSON.stringify(data));
    }
});
