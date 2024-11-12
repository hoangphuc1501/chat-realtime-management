var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
    formChat.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = formChat.content.value;
        if (content) {
            const data = {
                content: content
            }
            socket.emit("CLIENT_SEND_MESSAGE", data)

            formChat.content.value = "";
        }
    })
}
// HẾT CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector(".chat").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    let htmlFullName = "";
    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
})
// hết SERVER_RETURN_MESSAGE

// scroll chat to bottom
const bodyChat = document.querySelector(".inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// scroll chat to bottom