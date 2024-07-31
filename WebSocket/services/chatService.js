import User from '../models/User.js';
import Message from '../models/Message.js';
import Chat from "../models/Chat.js";
import {v4 as uuidv4} from "uuid";

class ChatService {
    async getAllChats(userId) {
        try {
            const user = await User.findOne({googleId: userId})
                .populate('chats')
                .exec();

            if (!user || !user.chats) {
                return {status: 404, data: {message: 'User or chats not found'}};
            }

            const chatsWithLastMessages = await Promise.all(user.chats.map(async (chat) => {
                const lastMessage = await Message.findOne({_id: {$in: chat.messages}})
                    .sort({date_create: -1})
                    .exec();

                return {
                    ...chat.toObject(),
                    lastMessage: lastMessage ? lastMessage.toObject() : null
                };
            }));

            return {status: 200, data: chatsWithLastMessages};
        } catch (error) {
            console.error('Error getting chats:', error);
            return {status: 500, data: {message: 'Internal server error'}};
        }
    }

    async getChat(chatId) {
        try {
            const chat = await Chat.findOne({chat_name: chatId}).populate('messages').exec();

            if (!chat) {
                return {status: 404, data: {message: 'Chat not found'}};
            }

            return {status: 200, data: chat};
        } catch (error) {
            console.error(error);
            return {status: 500, data: {message: 'Internal server error'}};
        }
    }

    async createChat(first_name, last_name, userId) {
        const user = await User.findOne({googleId: userId});

        if (!user) {
            return res.status(403).json({message: "No authorization"});
        }

        const chat = new Chat({
            first_name: first_name,
            last_name: last_name,
            chat_name: uuidv4(),
            users: [user._id]
        });

        await chat.save();
        user.chats.push(chat._id);
        user.save();

        return {status: 200, data: chat};
    }
    async updateChat(chatId, firstName, lastName, userId) {
        const user = await User.findOne({googleId: userId});

        if (!user) {
            return {status: 403, error: true, message: "No authorization"};
        }

        const chat = await Chat.findOne({chat_name: chatId});

        if (!chat) {
            return {status: 404, error: true, message: "Chat not found"};
        }

        chat.first_name = firstName;
        chat.last_name = lastName;

        await chat.save();

        return {status: 200, data: chat};
    }

    async deleteChat(chatId, userId) {
        const user = await User.findOne({googleId: userId});

        if (!user) {
            return {status: 403, error: true, message: "No authorization"};
        }

        const chat = await Chat.findOne({chat_name: chatId});

        if (!chat) {
            return {status: 404, error: true, message: "Chat not found"};
        }

        if (!chat.users.includes(user._id)) {
            return {status: 403, error: true, message: "User is not a participant of this chat"};
        }

        await User.updateMany({_id: {$in: chat.users}}, {$pull: {chats: chat._id}});

        await Chat.findByIdAndDelete(chat._id);

        return {status: 200, data: {message: "Chat deleted successfully"}};
    }
}

export default new ChatService();
