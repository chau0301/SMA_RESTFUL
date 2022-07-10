const mongoose = require('mongoose')
require('dotenv').config()

async function connect() {
    try {
        const mongoDBlink = process.env.MONGO_LINK
        await mongoose.connect(mongoDBlink)
        console.log('MongoDB Connected !!!')
    } catch (error) {
        console.log(error)
        console.log('Connect to database fail !!!')
    }
}

module.exports = {connect}
