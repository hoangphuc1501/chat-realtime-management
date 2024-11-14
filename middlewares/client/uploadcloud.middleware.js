const streamUploadHelper = require("../../helpers/streamUpload.helper");

module.exports.uploadSingle = (req, res, next) => {
    if(req.file){
        async function upload(req) {
            let result = await streamUpload(req.file.buffer);
            req.body[req.file.fieldname] = result.url;
            next();
        }
        upload(req);
    }else{
        next();
    }
}