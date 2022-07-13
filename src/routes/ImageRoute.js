const express = require('express')
const router = express.Router()
const ImageController = require('../controllers/ImageController')

router.get('/:key', ImageController.getImage)


module.exports = router
