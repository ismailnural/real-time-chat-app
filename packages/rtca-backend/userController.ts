export const users: any = [];

// joins the user to the specific chatroom
export const joinUser = (id: string, username: string, room: string, color: string) => {
    const currentUser = { id, username, room, color };
    const index = users.findIndex((user: any) => user.id === id);

    if (index !== -1) {
        users[index] = currentUser;
    } else {
        users.push(currentUser);
    }

    console.log('users: ', users);

    return currentUser;
};

// Gets a particular user id to return the current user
export const getCurrentUser = (id: string) => {
    return users.find((currentUser: any) => currentUser.id === id);
};

// called when the user leaves the chat and its user object deleted from array
export const userDisconnect = (id: string) => {
    const index = users.findIndex((currentUser: any) => currentUser.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Gets active users
export const getActiveUsers = (roomName: string) => {
    const userList = users.filter((currentUser: any) => currentUser.room === roomName);

    return userList.sort((a: any, b: any) => a.username > b.username && 1 || -1);
};
