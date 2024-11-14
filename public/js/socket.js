import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
    // upload image
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
        multiple: true,
        maxFileCount: 6
    });

    // hết upload image
    formChat.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = formChat.content.value;
        const images = upload.cachedFileArray || [];
        console.log(upload.cachedFileArray)
        if (content || images.length > 0) {
            const data = {
                content: content,
                images: images
            }
            socket.emit("CLIENT_SEND_MESSAGE", data)

            formChat.content.value = "";
            upload.resetPreviewPanel(); // clear all selected images
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

    let htmlContent = "";
    if (data.content) {
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `
    }
    let htmlImage = "";
    if (data.images.length > 0) {
        htmlImage += `<div class="inner-images">`
        for (const image of data.images) {
            htmlImage += `<img src="${image}" />`
        }

        htmlImage += `</div>`
    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImage}
    `;
    const elementListTyping = document.querySelector(".chat .inner-list-typing")
    body.insertBefore(div, elementListTyping);
    socket.emit("CLIENT_SEND_TYPING", false);
    body.scrollTop = body.scrollHeight;
    new Viewer(div)
})
// hết SERVER_RETURN_MESSAGE

// scroll chat to bottom
const bodyChat = document.querySelector(".inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
    // viewerjs
    new Viewer(bodyChat)
    // hết viewsjs
}
// scroll chat to bottom

// show icon
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const buttonIcon = document.querySelector(".chat .inner-form .button-icon");
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle('show');
    })
    const inputChat = document.querySelector(".chat .inner-form input[name = 'content']");
    emojiPicker.addEventListener('emoji-click', event => {
        inputChat.value = inputChat.value + event.detail.unicode;
        console.log(event.detail.unicode)
    });
    var timeOutTyping;
    inputChat.addEventListener("keyup", () => {
        socket.emit("CLIENT_SEND_TYPING", true);

        clearTimeout(timeOutTyping);

        timeOutTyping = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", false);
        }, 3000)
    })
}
// hết show icon

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type) {
            const existTyping = elementListTyping.querySelector(`.box-typing[user-id = "${data.userId}"]`)
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `
                elementListTyping.appendChild(boxTyping)
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
            if (existBoxTyping) {
                elementListTyping.removeChild(existBoxTyping);
            }
        }
    })
}

// hết SERVER_RETURN_TYPING

// kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-add-friend");
            button.closest(".box-user").classList.add("add");
            socket.emit("CLIENT_ADD_FRIEND", userIdB);
        })
    })
}
// hết kết bạn

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-cancel-friend");
            button.closest(".box-user").classList.remove("add");
            socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
        })
    })
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-refuse-friend");
            button.closest(".box-user").classList.add("refuse");
            socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
        })
    })
}
// Hết Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-accept-friend");
            button.closest(".box-user").classList.add("accepted");
            socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
        })
    })
}
// Hết Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    const badgeUserAccept = document.querySelector(`[badge-user-accept="${data.userIdB}"]`);
    if (badgeUserAccept) {
        badgeUserAccept.innerHTML = data.length;
    }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIENDS