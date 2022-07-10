const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    profilePicture: {type: String, default: ""},
    coverPicture: {type: String, default: ""},
    about: {type: String, default: ""},
    livesin: {type: String, default: ""},
    worksAt: {type: String, default: ""},
    relationship: {type: String, default: ""},
    country: {type: String, default: ""},
    followers: [],
    followings: [],
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
