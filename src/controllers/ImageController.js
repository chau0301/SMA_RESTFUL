const express = require('express')
const { getFileStream } = require('../../config/s3')

class ImageController {
    async getImage(req, res) {
        const key = req.params.key
        const readStream = await getFileStream(key)
        readStream.pipe(res)
    }
}

module.exports = new ImageController
