const express = require('express');
const cors = require('cors');

const routeAuth = require('./routes/Auth');
const routeProfil = require('./routes/Profil');
const routeAmis = require('./routes/Amis');
const routeMongo = require('./routes/Mongo');
const routeChat = require('./routes/Chat');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/app/auth', routeAuth);
app.use('/app/profil', routeProfil);
app.use('/app/amis', routeAmis);
app.use('/app/mongo', routeMongo);
app.use('/app/chat', routeChat);
app.listen(4000, () => console.log("Le serveur est ok"));