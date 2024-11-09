const userRouter = require("./user.route");
const homeRouter = require("./home.route");

const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);
    app.use("/", homeRouter)
    app.use("/users", userRouter)
} 