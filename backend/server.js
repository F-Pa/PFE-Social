const express = require('express');
const cors = require('cors');

const routeAuth = require('./routes/Auth');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/app/auth', routeAuth);
app.listen(4000, () => console.log("Le serveur est ok"));