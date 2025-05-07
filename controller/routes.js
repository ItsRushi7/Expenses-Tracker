const { json } = require('express')
const { User, Record } = require('../model/connection')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

dotenv.config()

async function login(req, res) {
    const data = req.body

    const userName = data.username
    const passWord = data.password

    const findUser = await User.findOne({
        username: userName,
        password: passWord,
    })

    if (findUser == null) {
        res.status(404).render('login', {
            message: 'no'
        });
    }
    else {
        jwt.sign({ findUser }, process.env.SECRET_KEY, (error, token) => {

            if (error) {
                console.log(error)
            }
            res.cookie('uid', token,)
            res.status(200).redirect('/home')
        })

    }
}

async function signup(req, res) {

    const data = req.body

    try {
        const createUser = await User.create({
            username: data.username,
            email: data.email,
            password: data.password
        })

        return res.status(201).render('signup', {
            message: 'yes'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(404).render('signup', {
                message: 'Duplicate'
            });
        }
        else {
            return res.status(500).render('signup', {
                message: 'error'
            });
        }
    }
}

async function sendData(req, res) {

    const Data = req.body

    try {

        const addRecord = await Record.create({
            Expense_Name: Data.Expense_Name,
            Amount: Data.Amount,
            Category: Data.Category,
            Date: Data.Date,
            Desccription: Data.Desccription,
        })

        return res.status(201).redirect('home')


    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate value: This email or username already exists' });
        }
        else {
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }


}

async function getData(req, res) {

    try {

        const data = await Record.find()

        return res.status(200).render('home', {
            data: data
        })
    }

    catch (error) {
        console.error('Error fetching Recored:', error);

        return res.status(500).json({ error: 'Failed to retrieve Recored' });
    }
}

async function deleteRecord(req, res) {

    try {

        const id = String(req.params.id)

        const deleteById = await Record.findByIdAndDelete(id)

        return res.status(200).json('ok')
    }

    catch (error) {

        return res.status(500).json({ error: 'Failed to retrieve Recored' });
    }

}

async function findRecord(req, res) {

    try {

        const id = String(req.params.id)
  
        const updatByID = await Record.findById(id)

        return res.status(200).json(updatByID)
 
    }

    catch (error) {

        return res.status(500).json({ error: 'Failed to find record' });
    }

}

async function updateRecord(req, res) {

    try {

        const data = req.body;
        const id = data.id
  
        const updatByID = await Record.findByIdAndUpdate(id,data)

        if (updatByID == null) {
            return res.status(404).json({ error: 'User not found' });
        }
        else {
            return res.status(200).json('ok')
        }
    }

    catch (error) {

        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Failed to update user' });
    }

}

function jwtVerification(req, res, next) {

    const token = req.cookies.uid

    jwt.verify(token, process.env.SECRET_KEY, (error, verifyData) => {
        if (error) {
            res.send({ message: 'Invalid Token' })
        }
        else {
            next()
        }
    })

}

module.exports = {
    login,
    signup,
    jwtVerification,
    sendData,
    getData,
    deleteRecord,
    findRecord,
    updateRecord,
}