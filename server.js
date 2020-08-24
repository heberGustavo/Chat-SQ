const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaveChat, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Pasta estatica
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Service Quality';

//Rodar quando cliente conectar
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Mostra uma mensagem e é chamada no main.js
        socket.emit('message', formatMessage(botName, 'Bem vindo ao Chat SQ!'));

        //Transmitir quando o usuario conectar
        socket.broadcast.to(user.room)
            .emit('message', formatMessage(botName, `${user.username} entrou no chat`));

        //Envia informações do usuário e da sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    /**
     * Ouve o Chat de mensagens 
     * Mensagens enviadas pelos usuarios
    */
    socket.on('chatMessage', (msg) => {
        //Pega o usuario
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    //Rodar quando o cliente desconectar
    socket.on('disconnect', () => {
        const user = userLeaveChat(socket.id);

        if(user){
            io.to(user.room)
            .emit('message', 
            formatMessage(botName, `${user.username} saiu do Chat`));

            //Envia informações do usuário e da sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        };
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

