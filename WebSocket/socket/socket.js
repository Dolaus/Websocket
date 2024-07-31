import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import MessageService from "../services/messageService.js";
import dotenv from 'dotenv';

dotenv.config();
let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.user.username}`);

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User ${socket.user.username} joined room: ${room}`);
        });

        socket.on('sendMessage', async ({ room, message }) => {
            try {
                const result = await MessageService.handleMessage(room, message, socket.user.id);
                if (result) {
                    io.to(room).emit('message', result);
                    console.log(result);
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }

            setTimeout(async () => {
                try {
                    // const response = await fetch('https://api.quotable.io/random')
                    // const quote = await response.json()
                     const response = await fetch('http://localhost:5000/random')
                     const quote = await response.json()
                    const result = await MessageService.handleMessage(room, quote.content, null);
                    if (result) {
                        console.log(result);
                        console.log(room);
                        io.to(room).emit('message', result);
                    }
                } catch (error) {
                    console.error('Error sending random number message:', error);
                }
            }, 3000);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.user.username}`);
        });
    });

    return io;
};

export default initializeSocket;
