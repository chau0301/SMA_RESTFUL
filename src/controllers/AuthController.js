const express = require('express')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
require('dotenv').config()
const User = require('../models/userModel')

const isValidUsername = (username) => {
    const minLength = 8
    const maxLength = 16
    const pattern = /^[a-z0-9]{3,15}$/
    return username.match(pattern) !== null
}
const isValidPassword = (password) => {
    const minLength = 8
    const maxLength = 16
    if (password.indexOf(' ') !== -1) return false
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    return password.match(pattern) !== null
}

class AuthController {
    // [POST]
    // register new account
    // public
    async register(req, res) {
        let {username, password, firstname, lastname} = req.body
        username = username.toLowerCase()
        username = username.trim()
        password = password.trim()
        firstname = firstname.trim()
        lastname = lastname.trim()
        if (!isValidUsername(username)) {
            res.status(400).json({success: false, message: 'Username is not valid'})
        }
        if (!isValidPassword(password)) {
            res.status(400).json({success: false, message: 'Password is not valid'})
        }
        //simple validation
        if (!username || !password || !firstname || !lastname) {
            res.status(400).json({success: false, message: 'Missing information'})
        }
        try {
            const existing = await User.findOne({username})
            if (existing) {
                res.status(400).json({success: false, message: "username already taken"})
            }
            
            else {
                const hashedPassword = await argon2.hash(password)
                const newUser = new User({ username, password: hashedPassword, firstname, lastname })
                await newUser.save()
                const accessToken = jwt.sign({userId : newUser._id}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRES_TIME})
                res.status(201).json({success: true, message: 'Register successfully!!', user: newUser, token: accessToken})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }

    }
    async login(req, res) {
        let {username, password} = req.body
        username = username.toLowerCase()
        //simple validation
        if (!username || !password) {
            res.status(400).json({success: false, message: 'Missing information'})
        }
        try {
            const account = await User.findOne({username: username})
            if (!account) {
                return res.status(400).json({success: false, message: 'Username does not exist'})
            } else {
                const verify = await argon2.verify(account.password, password)
                if (verify) {
                    const accessToken = jwt.sign({userId : account._id}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRES_TIME})
                    console.log(`${username} Login successfully!!`)
                    res.json({success: true, message: 'Login successfully!!', user:account, token: accessToken})
                    //res.set({'accessToken': accessToken})
                } else {
                    console.log('Login unsuccessfully!!')
                    res.status(400).json({success: false, message:'The Username or Password is incorrect'})}
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
}

module.exports = new AuthController
