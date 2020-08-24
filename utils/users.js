const users = [];

//Entrada do usuário no Chat
function userJoin(id, username, room){
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Pegar usuário atual
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//Usuario saindo do Chat
function userLeaveChat(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
} 

//Pega a sala do Usuário
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaveChat,
    getRoomUsers
};