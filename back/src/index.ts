import "dotenv/config";
import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

let lastSocketId: string = '';

// TP - GUESS THE NUMBER
let randomNumber: number = Math.floor(Math.random() * 100) + 1;
let players = [];
let gameBeginningTime: number | null = null;


io.on('connection', (socket) => {

  console.log("L'utilisateur suivant est connecté : " + socket.id);

  lastSocketId = socket.id;

  socket.on('chat message', (msg) => {
    console.log('every body message: ' + msg);
    io.emit('chat message', msg);
    // Envoie du message à tous les utilisateurs connectés.
  });

  socket.on('send-others-a-message', (msg) => {
    console.log('others - message: ' + msg);
    socket.broadcast.emit('chat message', msg);
    // Envoie du message à tous les utilisateurs connectés sauf au client qui a émit le message.
  })

  socket.on('send-to-last-socket', (msg) => {
    if(lastSocketId !== ''){
      console.log('last socket - message: ' + msg);
      io.to(lastSocketId).emit('chat message', msg);
      // Envoie du message à un seul utilisateur connecté.
    }
  })


  // Réception du message 'patate' d'un client connecté
  socket.on('patate', () => {
    console.log("Message 'patate' bien reçu !");
    socket.broadcast.emit('chouchou');
  });

  // Réception du message 'BIM !' d'un client connecté
  socket.on('BIM !', () => {
    console.log("Message 'BIM !' bien reçu !");
    io.emit('BOUM !!');
  });


  // TP - GUESS THE NUMBER

  players.push(socket.id);
  console.log(players.length)

  if(players.length === 3){
    console.log('start game')
    io.emit('start-game');
    gameBeginningTime = Date.now();
  }

  socket.on('proposal-number', (num: number) => {
    if(num < randomNumber){
      socket.emit('hint', "C'est plus.");
    }
    else if(num > randomNumber){
      socket.emit('hint', "C'est moins.");
    }
    else {
      const deltaTime = Date.now() - (gameBeginningTime as number);
      io.emit('end-game', "La partie est terminée. Le socket id gagnant est : " + socket.id + " ! Il a gagné en " + deltaTime + " ms");
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});