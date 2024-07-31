import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Chat from "../models/Chat.js";
import {v4 as uuidv4} from "uuid";

dotenv.config();
class AuthService {
    async login(userProfile) {
        try {
            let profile = await User.findOne({googleId: userProfile.id});

            if (!profile) {
                profile = new User({
                    username: userProfile.given_name,
                    email: userProfile.email,
                    googleId: userProfile.id
                });

                await profile.save();
            }
            if(profile.chats.length<3) {
                await this.createChatsForNewUser(profile)
            }

            return this.generateAccessToken(profile.username, profile.googleId, profile._id);
        } catch (e) {
            return {status: 500, data: {message: e}};
        }
    }

    generateAccessToken(username, id, userId) {
        const payload = {
            id,
            username,
            userId
        }

        return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'});
    }

    createChatsForNewUser = async (profile) => {
        if (profile.chats.length < 3) {
            const chatPromises = [];

            for (let i = 0; i < 3; i++) {
                const chat = new Chat({
                    first_name: `FirstName${i}`,
                    last_name: `LastName${i}`,
                    chat_name: uuidv4(),
                    users: [profile._id]
                });

                chatPromises.push(chat.save());
            }

            try {
                const chats = await Promise.all(chatPromises);
                profile.chats.push(...chats.map(chat => chat._id));
                await profile.save();
            } catch (error) {
                console.error('Error creating chats:', error);
                throw error;
            }
        }
    };
}

export default new AuthService();
