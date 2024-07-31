import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    message: { type: String, required: true },
    date_create: { type: Date, default: Date.now, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true }
});

const Message = model('Message', messageSchema);
export default Message;
