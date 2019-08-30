const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('Please upload a valid avatar'));
        }
        cb(undefined, true);
    }
});

const errorMiddleware = (req, res, next) => {

};

module.exports = {
    upload,
    errorMiddleware
};