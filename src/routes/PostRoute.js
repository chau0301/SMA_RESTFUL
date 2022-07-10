const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')

router.post('/create', PostController.create)
router.get('/show', PostController.show)
router.get('/:id', PostController.getPost)
router.put('/:id', PostController.updatePost)
router.delete('/:id', PostController.deletePost)
router.put('/:id/like', PostController.likePost)
router.get('/:id/timeline', PostController.getTimelinePost)

module.exports = router
