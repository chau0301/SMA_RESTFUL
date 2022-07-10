const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({storage: storage})

router.post('/', upload.single("file"), (req, res) => {
    try {
        return res.json({success: true, message: 'file uploaded successfully'})
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

module.exports = router