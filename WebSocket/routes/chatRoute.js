import Router from 'express'
const chatRoute = new Router();
import authMiddleware from "../middleware/authMiddleware.js";
import chatController from "../controllers/chatController.js";

chatRoute.get('/all-user-chats', authMiddleware, chatController.allChat)
chatRoute.get('/get-chat/:id', authMiddleware, chatController.getChat)
chatRoute.post('/create-chat', authMiddleware, chatController.createChat)
chatRoute.put('/update-chat/:chatId', authMiddleware, chatController.updateChat);
chatRoute.delete('/delete-chat/:chatId', authMiddleware, chatController.deleteChat);

export default chatRoute;