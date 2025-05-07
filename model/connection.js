const mongodb = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connected = mongodb.connect(process.env.DATABASE_URL)

connected.then(() => {
    console.log('Mongodb Connected...')
}).catch(() => {
    console.log('Mongodb Not Connected...')
})

const createSchemaUser = new mongodb.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    }
})

const createSchemaRecord = new mongodb.Schema({
    Expense_Name: {
        type: String,
        required: true,
    },

    Amount: {
        type: String,
        required: true,
    },

    Category: {
        type: String,
        required: true,
    },

    Date: {
        type: Date,
        required: true,
    },

    Desccription: {
        type: String,
        required: true,
    },
})

const User = mongodb.model('User', createSchemaUser)
const Record = mongodb.model('Record', createSchemaRecord)

module.exports = {
    User,
    Record
}