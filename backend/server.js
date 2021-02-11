const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const routeAuth = require('./routes/Auth');
const routeProfil = require('./routes/Profil');
const routeAmis = require('./routes/Amis');
const routeMongo = require('./routes/Mongo');
const routeChat = require('./routes/Chat');
const routePub = require('./routes/Publication');
const index = require('./routes/Index');

const app = express();

app.use(express.json());
app.use(cors());
app.use(index);
app.use('/app/auth', routeAuth);
app.use('/app/profil', routeProfil);
app.use('/app/amis', routeAmis);
app.use('/app/mongo', routeMongo);
app.use('/app/chat', routeChat);
app.use('/app/pub', routePub);
app.listen(4000, () => console.log("Le serveur est ok"));

const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

server.listen(5000, () => console.log(`Listening on port 5000`));