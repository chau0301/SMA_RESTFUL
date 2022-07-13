const express = require('express')
const router = express.Router()
const multer = require('multer')
const { uploadToS3 } = require('../../config/s3')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({storage: storage})

router.post('/', upload.single("file"), async (req, res) => {
    try {
        const file = req.file
        const result = await uploadToS3(file)
        return res.json({success: true, message: 'file uploaded successfully', imagePath: `/images/${result.key}`})
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

module.exports = router