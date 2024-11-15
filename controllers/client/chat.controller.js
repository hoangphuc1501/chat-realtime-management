const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const streamUploadHelper = require("../../helpers/streamUpload.helper");

module.exports.index = async (req, res) => {
    _io.once('connection', (socket) => {
        // người dùng gửi tin nhắn lên server
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = [];
            for (const item of data.images) {
                const result = await streamUploadHelper.streamUpload(item);
                images.push(result.url)
                console.log(result.url)
            }
            const dataChat = {
                userId:  res.locals.user.id,
                // roomChatId: String,
                content: data.content,
                images: images
            }
            // lưu tin nhắn vào database
            const chat = new Chat(dataChat);
            await chat.save();

            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId:  res.locals.user.id,
                fullName: res.locals.user.fullName,
                content: data.content,
                images: images
            })
        })
        // CLIENT_SEND_TYPING
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId:  res.locals.user.id,
                fullName: res.locals.user.fullName,
                type: type
            });
        })
    });
    // lấy tin nhắn mặc định
    const chats = await Chat.find({
        deleted: false
    })
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.userId
        })
        chat.fullName = infoUser.fullName;
    }
    res.render("client/pages/chats/index.pug", {
        pageTitle: "chat",
        chats: chats
    });
}

