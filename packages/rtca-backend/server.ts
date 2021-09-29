import express from "express";
import { Server, Socket } from "socket.io";
import colors from "colors";
import cors from "cors";
import { users, getCurrentUser, userDisconnect, joinUser, getActiveUsers } from "./userController";

const port = process.env.PORT || 8000;
const app = express();

app.use(cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
}));

const server = app.listen(
    port,
    () => console.log(colors.green(`Server is running on the port ${(port)} `))
);

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Initializing the socket io connection 
io.on("connection", (socket: Socket) => {
    // For a new user joining the room
    socket.on("joinRoom", ({ username, roomname, color }) => {
        // Created user control
        let oldUsername = null;
        let oldRoom = null;
        const index = users.findIndex((user: any) => user.id === socket.id);

        if (index !== -1) {
            oldUsername = users[index].username;
            oldRoom = users[index].room;
        }

        // Create user
        const p_user = joinUser(socket.id, username, roomname, color);

        if (p_user) {
            socket.join(p_user.room);

            // For change name & room
            if (oldRoom !== null) {
                socket.broadcast.to(oldRoom).emit("userList", {
                    activeUsers: getActiveUsers(oldRoom)
                });
                if (p_user.room !== oldRoom) {
                    io.to(oldRoom).emit("message", {
                        userId: -1,
                        username: oldUsername,
                        color: '#2d343e',
                        text: `${oldUsername} has left the room and join to room ${p_user.room} ${oldUsername !== p_user.username ? `as ${p_user.username}` : ''}`,
                    });
                }
            }

            // Display a welcome message to the user who have joined a room
            socket.emit("message", {
                userId: -1,
                username: p_user.username,
                color: '#2d343e',
                text: oldUsername !== null ? `Welcome back ${p_user.username}` : `Welcome ${p_user.username}`,
            });

            // For active user list on room
            socket.emit("userList", {
                activeUsers: getActiveUsers(p_user.room)
            });

            // Displays a joined room message to all other room users except that particular user
            socket.broadcast.to(p_user.room).emit("message", {
                userId: -1,
                username: p_user.username,
                oldUsername: oldUsername,
                color: '#2d343e',
                text: oldUsername !== null ? `${oldUsername} has re-joined the chat ${p_user.room} ${oldUsername !== p_user.username ? `as ${p_user.username}` : ''}` : `${p_user?.username} has joined the chat`,
            });

            // For active user list on room
            socket.broadcast.to(p_user.room).emit("userList", {
                activeUsers: getActiveUsers(p_user.room)
            });
        }
    });

    // User sending message
    socket.on("chat", (text) => {
        // Gets the room user and the message sent
        const p_user: any = getCurrentUser(socket.id);

        if (p_user) {
            io.to(p_user.room).emit("message", {
                userId: p_user.id,
                username: p_user.username,
                color: p_user.color,
                text: text,
            });
        }
    });

    // When the user exits the room
    socket.on("disconnect", () => {
        // The user is deleted from array of users and a left room message displayed
        const p_user: any = userDisconnect(socket.id);

        if (p_user) {
            // Gets the room user and the message sent
            io.to(p_user.room).emit("message", {
                userId: -1,
                username: p_user.username,
                color: '#2d343e',
                text: `${p_user.username} has left the chat`,
            });

            // For active user list on room
            socket.broadcast.to(p_user.room).emit("userList", {
                activeUsers: getActiveUsers(p_user.room)
            });
        }
    });
});