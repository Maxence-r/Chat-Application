// Import librairies
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Import routes
const loginRouter = require("./router/loginManager");
const signupRouter = require("./router/signupManager");
const checkLogin = require("./middlewares/checkLogin");
const cookieParser = require('cookie-parser');
const getInfos = require("./router/InfosManager");
const ConvManager = require("./router/ConversationsManager");
const MessagesManager = require("./router/MessagesManager");

// Definition des outils
app.use(cookieParser());
app.use(express.json());
app.use(express.static('./views'));

// Connexion à la base de données
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://admin:Admin01@cluster0.8nwvcol.mongodb.net/?retryWrites=true&w=majority', 
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(checkLogin);
app.use(loginRouter);
app.get('/', (req, res) => {
    if(req.logged) return res.redirect('/chat');
    res.sendFile('index.html', {root: './views/login-signup'});
});
app.use('/conv', ConvManager);
app.use('/messages', MessagesManager);
app.use('/infos', getInfos);
app.use('/signup', signupRouter);
app.get('/chat', (req, res) => {
    if(!req.logged) return res.redirect('/');
    res.sendFile('chat.html', {root: './views/dashboard'});
});  

module.exports = app;