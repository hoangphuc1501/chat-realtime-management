const mongoose = require('mongoose');


module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URL)
        console.log("kết nối database thành công!")
    } catch (error) {
        console.log("Kết nối database thất bại!")
        console.log(error)
    }
}

