const { ipcRenderer } = require("electron");

const button = document.querySelector(".button-in-regform");
const plusBtn = document.querySelector("#plusButton");
const minusBtn = document.querySelector("#minusButton");
const form = document.querySelector("form");
const btnParent = button.parentNode;

function plusHandler() {
    btnParent.insertAdjacentHTML(
        "beforebegin",
        `<section class="components-wrapper"><h3 class="text-in-component">webex주소</h3><input id="address0" class="input00" type="text" placeholder="https://abc.com/qwe" required></section>`
    );
}

function minusHandler() {
    if (form.children.length > 4) {
        const nodeToRemove = form.children[form.children.length - 2];
        console.log("delete: ", nodeToRemove);
        form.removeChild(nodeToRemove);
    }
}

plusBtn.addEventListener("click", plusHandler);
minusBtn.addEventListener("click", minusHandler);

button.addEventListener("click", () => {
    let name = document.querySelector("#inputName").value;
    let email = document.querySelector("#inputEmail").value;
    let inputs = [];
    for (let i = 2; i < form.children.length; i++) {
        inputs.push(form.children[i]);
    }
    let flag = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs.value === "") {
            flag = 1;
            break;
        }
    }
    if (flag === 0) {
        ipcRenderer.on("done", (arg) => {
            console.log(arg);
        });
        ipcRenderer.send(
            "executeBot",
            `{"name":"${name}","email":"${email}","addr0":"${inputs}"}`
        );
    }
});
