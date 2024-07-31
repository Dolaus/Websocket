import User from '../models/User.js';
import Message from '../models/Message.js';
import Chat from "../models/Chat.js";

class MessageService {
    async handleMessage(room, message, userId) {
        const user = await User.findOne({googleId: userId});
        const chat = await Chat.findOne({chat_name: room});

        if (!chat) return null;

        const messageM = new Message({
            message: message,
            chat: chat._id,
            user: user ? user._id : null
        });

        await messageM.save();

        chat.messages.push(messageM._id);
        await chat.save();

        return {
            message,
            room,
            user: user ? user._id : null,
            chatName: (chat.first_name + chat.last_name),
            date_create: messageM.date_create
        };
    }
}

export default new MessageService()