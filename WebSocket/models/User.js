import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
});

const User = model('User', userSchema);
export default User;