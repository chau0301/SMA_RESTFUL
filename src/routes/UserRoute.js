const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', UserController.getAllUser)
router.get('/:id', UserController.getUser)
router.put('/:id', authMiddleware, UserController.updateUser)
router.delete('/:id', authMiddleware, UserController.deleteUser)
router.put('/:id/follow', authMiddleware, UserController.followUser)
router.put('/:id/unfollow', authMiddleware, UserController.unFollowUser)



module.exports = router
