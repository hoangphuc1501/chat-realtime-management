const userRouter = require("./user.route");
const homeRouter = require("./home.route");

module.exports = (app) => {
    app.use("/", homeRouter)
    app.use("/users", userRouter)
} 