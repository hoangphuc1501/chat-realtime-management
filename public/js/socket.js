var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat) {
    formChat.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = formChat.content.value;
        if(content){
            const data = {
                content: content
            }
            socket.emit("CLIENT_SEND_MESSAGE", (data))

            formChat.content.value = "";
        }
    })
}
// HẾT CLIENT_SEND_MESSAGE