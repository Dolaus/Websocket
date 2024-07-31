import express from 'express';
import session from 'express-session';
import http from 'http';
import cors from 'cors';
import passport from 'passport';
import './auth.js';
import mongoose from 'mongoose';
import chatRoute from './routes/chatRoute.js';
import authRoute from './routes/authRoute.js';
import initializeSocket from './socket/socket.js';
import dotenv from 'dotenv';
dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(session({secret: SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());

app.use('/', authRoute);
app.use('/chat', chatRoute);

const server = http.createServer(app);
initializeSocket(server);

const start = () => {
    try {
        mongoose.connect(MONGO_URI)

        server.listen(PORT, () => console.log('Server Start' + process.env.PORT));
    } catch (e) {
        console.log(e);
    }
}

start();
