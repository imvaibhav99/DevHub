const mongoose=require('mongoose');

const messagesSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const chatSchema= new mongoose.Schema({

    participants:[{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}], // Array of user IDs participating in the chat
    messages:[messagesSchema], // Array of messages in the chat, from messagesSchema
   
      });
      
const Chat=mongoose.model('Chat', chatSchema);
module.exports=Chat;