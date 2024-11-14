const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
module.exports.register = async (req, res) => {

    res.render("client/pages/users/register.pug", {
        pageTitle: "Đăng Ký"
    });
}

module.exports.registerPost = async (req, res) => {
    const user = req.body;

    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    })
    if (existUser) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }
    const dataUser = {
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        password: md5(user.password),
        token: generateHelper.generateRandomString(30),
        status: "active"
    }
    const newUser = new User(dataUser);
    await newUser.save();

    res.cookie("tokenUser", newUser.token);
    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/");
}

module.exports.login = async (req, res) => {

    res.render("client/pages/users/login.pug", {
        pageTitle: "Đăng nhập"
    });
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const existUser = await User.findOne({
        email: email,
        deleted: false
    })
    if (!existUser) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    if (md5(password) != existUser.password) {
        req.flash("error", "Mật khẩu không chính xác!");
        res.redirect("back");
        return;
    }
    if (existUser.status != "active") {
        req.flash("error", "Tài khoản đã bị khóa!")
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", existUser.token);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/");
}

module.exports.notFriend = async (req, res) => {
    const userIdA = res.locals.user.id

    _io.once('connection', (socket) => {
        // ckhi A gửi yêu cầu cho B
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            // Thêm id của A vào acceptFriends của B
            const existAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            })
            if (!existAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $push: { acceptFriends: userIdA }
                }
                )
            }
            // Thêm id của B vào requestFriends của A
            const existBInA = await User.findOne({
                _id: userIdA,
                acceptFriends: userIdB
            })
            if (!existBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $push: { acceptFriends: userIdB }
                }
                )
            }

        })
    })

    const users = await User
        .find({
            $and: [
                { _id: { $ne: userIdA } }, // $ne: not equal
                { _id: { $nin: res.locals.user.requestFriends } }, // $nin: not in
                { _id: { $nin: res.locals.user.acceptFriends } }, // $nin: not in
            ],
            deleted: false,
            status: "active"
        })
        .select("id fullName avatar")
    res.render("client/pages/users/not-friend.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
}