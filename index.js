const express = require('express');
const app = express();
const User = require('./src/models/user.model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('./src/database/mongoose')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/PassportDemo', collectionName: 'sessions'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
const PORT = 3000

require('./config/passport')

app.use(passport.initialize())
app.use(passport.session())

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/login', passport.authenticate('local', { successRedirect: 'protected' }))

app.post('/register', (req, res) => {
    let user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    user.save().then(() => console.log(user))
    res.send({ success: true })
})

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('login')
})

app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send("Protected")
    }
    else {
        res.status(401).send({ msg: "Unauthorized" })
    }
    console.log(req.session)
    console.log(req.user)
})

app.listen(PORT, () => {
    console.log("Server is up and listening on port " + PORT)
})