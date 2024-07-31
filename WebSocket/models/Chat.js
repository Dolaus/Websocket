import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    chat_name: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

const Chat = model('Chat', chatSchema);
export default Chat;
