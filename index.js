const { login, signup, jwtVerification, getData, sendData, deleteRecord, updateRecord, findRecord, googleAuthentication } = require('./controller/routes')
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv')
const session = require('express-session');
dotenv.config()

const app = express()
const port = process.env.PORT || 8000


// All middelware 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json()); // For parsing application/json
app.use(session({
    secret: process.env.SECRET_KEY, // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production over HTTPS
}));


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.get('/', (req, res) => {
    return res.status(200).render('login', {
        message: null
    })
})

app.post('/auth/google/callback', googleAuthentication);

// Example route to check if the user is logged in
app.get('/profile', getData)

app.post('/', login)

app.get('/signup', (req, res) => {
    return res.status(200).render('signup', {
        message: 'no'
    })
})

app.post('/signup', signup)

app.use('/home', jwtVerification)

app.get('/home', getData)

app.post('/home', sendData)

app.delete('/delete/:id', deleteRecord)

app.get('/update/:id', findRecord)

app.patch('/updateRecord', updateRecord)

app.listen(port, () => {
    console.log(`http://localhost:3000/`)
})

