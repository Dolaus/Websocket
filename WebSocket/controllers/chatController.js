import chatService from "../services/chatService.js";

class ChatController {
    async allChat(req, res) {
        const userId = req.user.id;
        const result = await chatService.getAllChats(userId);

        return res.status(result.status).json(result.data);
    }

    async getChat(req, res) {
        const chatID = req.params.id;
        if (!chatID) {
            return res.status(404).json({ message: 'Chat ID is required' });
        }
        const result = await chatService.getChat(chatID);

        return res.status(result.status).json(result.data);
    }

    async createChat(req, res) {
        const userId = req.user.id;
        const chat = await chatService.createChat(req.body.firstName, req.body.lastName, userId);

        return res.status(chat.status).json(chat.data);
    }

    async updateChat(req, res) {
        const userId = req.user.id;
        const chatId = req.params.chatId;
        const { first_name, last_name } = req.body;

        try {
            const chat = await chatService.updateChat(chatId, first_name, last_name, userId);

            if (chat.error) {
                return res.status(chat.status).json({ message: chat.message });
            }

            return res.status(chat.status).json(chat.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async deleteChat(req, res) {
        const userId = req.user.id;
        const chatId = req.params.chatId;

        try {
            const result = await chatService.deleteChat(chatId, userId);

            if (result.error) {
                return res.status(result.status).json({ message: result.message });
            }

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}

export default new ChatController();
