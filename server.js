const { static } = require('express')
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require("express-session")
const { removeAllListeners } = require('./config/db')

//Templates engine
app.set('view engine', 'ejs')

//Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'fjsdlkfhsdlkfsd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(require('./middlewares/flash'))

//Routes 
app.get('/', (request, response) => {
    let Message = require('./models/message')

    Message.all(function (messages) {

        response.render('pages/index', { messages: messages })
    })
})

app.post('/', (request, response) => {
    console.log(request.body);
    if (request.body.message === undefined || request.body.message === '') {
        request.flash('error', "Vous n'avez pas écrit de message")
        request.session.error = "Il y a une erreur"
        response.redirect('/')
    } else {
        let Message = require('./models/message')
        Message.create(request.body.message, function () {
            request.flash('success', "Votre message a été envoyé")
            response.redirect('/')
        })
    }
})

app.get('/message/:id', (req, res) => {
    let Message = require('./models/message')
    Message.find(req.params.id, function (message) {
        res.render('messages/show', { message: message })
    })
})

app.listen(8080)