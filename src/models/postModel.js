const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = Schema({
    userId: {type: String, require: true},
    desc: {type: String},
    likes: [],
    image: {type: String},
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)
