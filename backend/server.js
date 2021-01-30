const express = require('express');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv').config();
const cors = require('cors');

// const routeUrls = require('./routes/routes')

const app = express();

// On se connecte au driver neo4j, Nécéssite la clé (.env)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', process.env.DB_UTIL_PASS));
const session = driver.session();

app.use(express.json())
app.use(cors())
// app.use('/app', routeUrls)
app.listen(4000, () => console.log("Server is up and running"))