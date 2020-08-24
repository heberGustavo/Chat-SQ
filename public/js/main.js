const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users'); 

//Pega o usuario e a sala da URl
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true  
})

const socket = io();

//Entrar no Chat
socket.emit('joinRoom', { username, room });

//Pegar sala e usuários
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

//Ouve em qual estado está. Baseado no server.js
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
});

//Ao clicar no botão de enviar mensagem
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Pega o conteudo no Chat.html, pegando pelo ID='msg'
    const msg = e.target.elements.msg.value;

    //Emite a mensagem para o servidor
    socket.emit('chatMessage', msg);

    //Sroll quando chegar mensagem
    chatMessage.scrollTop = chatMessage.scrollHeight;

    //Limpa o Input de mensagens
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Mensagem de saido para o DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =
    `
        <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
            ${message.textMessage}
        </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

//Adiciona nome da sala no DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Adiciona usuários no DOM
function outputUsers(users){
    userList.innerHTML = 
    `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}