const express = require('express')
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const Post = require('../models/postModel')
const User = require('../models/userModel')

class PostController {
    //[POST] /api/post/create
    // create new post
    //private
    async create(req, res) {
        const {userId, desc, likes, image} = req.body
        try {
            const newPost = Post({userId, desc, likes, image})
            //simple validation
            if (!userId || !desc) {
                res.status(400).json({success: false, message: 'Missing userId or description'})
            }
            else {
                await newPost.save()
                res.json({success: true, message: 'Created new Post successfully', newPost})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }

    //[get] /api/post/:id
    // get one post with id
    //private
    async getPost(req, res) {
        try {
            const id = req.params.id
            const post = await Post.find({'_id': id})
            res.json({success: true, message: 'get post with Id', post})
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
    //[get] /api/post/show
    //get all posts
    //private
    async show(req, res) {
        try {
            const posts = await Post.find({})
            res.json({success: true, message: 'get all post', count: posts.length, posts})
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
    //[put] /api/post/:id
    //get all posts
    //private
    async updatePost(req, res) {
        const postId = req.params.id
        const {userId, desc, image} = req.body
        try {
            const updatePost = await Post.findById(postId)
            if (userId === updatePost.userId) {
                await Post.findOneAndUpdate({'_id':postId}, {desc, image})
                res.json({success: true, message: "post updated"})
            } else {
                res.status(400).json({success: false, message: "have no permission"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }

    //[DELETE] /api/post/:id
    //delete post with id
    //private
    async deletePost(req, res) {
        const postId = req.params.id
        const {userId, desc, image} = req.body
        try {
            const deletePost = await Post.findById(postId)
            if (!deletePost) {
                res.status(404).json({success: false, message: "No post found"})
            } 
            else if (userId === deletePost.userId) {
                await Post.findOneAndRemove({'_id':postId})
                res.json({success: true, message: "post deleted"})
            } else {
                res.status(400).json({success: false, message: "have no permission"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
    //[PUT] /api/post/:id/like
    //like/dislike a post
    //private
    async likePost(req, res) {
        const id = req.params.id
        const {userId} = req.body
        if (!userId || !id) {
            return res.status(400).json({success: false, message: 'undefined userId or postId'})
        }
        try {
            const post = await Post.findById(id)
            if(post.likes.includes(userId)) {
                await post.updateOne({$pull: {likes: userId}})
                console.log(`${userId} dislike ${id}`);
                res.json({success: true, message: 'Post disliked'})
            } else {
                await post.updateOne({$push: {likes: userId}})
                console.log(`${userId} like ${id}`);
                res.json({success: true, message: 'Post liked'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
    //get
    async getTimelinePost(req,res) {
        const userId = req.params.id
        try {
            const currentUserPosts = await Post.find({userId: userId})
            const followingPosts = await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId),
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "followings",
                        foreignField: "userId",
                        as: "followingPosts"
                    } 
                },
                {
                    $project: {
                        followingPosts: 1,
                        _id: 0
                    }
                }
            ])
            res.json({
                success: true, 
                message: 'getTimelinePost successfully', 
                posts: currentUserPosts.concat(...followingPosts[0]
                    .followingPosts)
                    .sort((a,b) => b.createdAt - a.createdAt)
                })
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
}

module.exports = new PostController
