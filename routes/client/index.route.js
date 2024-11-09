const userRouter = require("./user.route");


module.exports = (app) => {
    // app.use("/", userRouter)
    app.use("/users", userRouter)
} 