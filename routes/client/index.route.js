const userRouter = require("./user.route");
const homeRouter = require("./home.route");
const chatRouter = require("./chat.route");
const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);
    app.use("/", homeRouter);
    app.use("/users", userRouter);
    app.use("/chat", chatRouter);
} 