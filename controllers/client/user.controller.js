const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
module.exports.register = async (req, res) => {

    res.render("client/pages/users/register.pug",{
        pageTitle: "Đăng Ký"
    });
}

module.exports.registerPost = async (req, res) => {
    const user = req.body;

    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    })
    if(existUser){
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

    res.render("client/pages/users/login.pug",{
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
    if(!existUser){
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    if(md5(password) != existUser.password){
        req.flash("error", "Mật khẩu không chính xác!");
        res.redirect("back");
        return;
    }
    if(existUser.status != "active"){
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