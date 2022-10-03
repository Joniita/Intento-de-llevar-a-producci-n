import express from "express";
import { PORT } from "./config.js";
import { createServer } from "http";
import { Server } from "socket.io";

let app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

app.use(express.static('client'));

app.get('/hi', function(req, res){
    res.status(200).send("Hola mundo desde una ruta");
});

let messages = [{
    id:1,
    text: 'Bienvenido al chat',
    nickname: 'Bot'
}];

io.on('connection', function(socket) {
    console.log('el cliente con IP: '+socket.handshake.address+' se ha conectado...');

    socket.emit('messages', messages);

    socket.on('add-message', function(data){
        messages.push(data);

        io.sockets.emit('messages', messages);
    });
});


httpServer.listen(PORT, function(){
    console.log('Servidor está funcionando en el puerto', PORT);
});
