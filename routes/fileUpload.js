const express = require('express'),
    router = new express.Router(),
    multer = require('multer'),
    path = require('path');

const uploads = multer({ dest: 'uploads/' }),
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    });

router.post("/resume", (req, res) => {
    const upload = multer({ storage }).single('file');
    upload(req, res, (error) => {
        if (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error"
            });
        } else {
            if (req.file) {
                res.status(200).json({
                    code: 200,
                    data: req.file.filename,
                    message: "File upload successfully"
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: "Something went wrong"
                });
            }
        }
    });
});

module.exports = router;
