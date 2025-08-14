const socket = require("socket.io");
const Chat = require("../models/chat.js"); // Importing the Chat model

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Updated to match your current port
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    let currentRoomId = null;

    // When user joins a chat->event handler  
    socket.on("joinChat", ({firstName, userId, targetUserId} ) => {
      const roomId = [userId, targetUserId].sort().join("_");
      currentRoomId = roomId;
      console.log(firstName + " joined room: " + roomId);
      
      socket.join(roomId); // Join the room based on user IDs
    });

    // When user sends a message
  
// When user sends a message
socket.on("sendMessage", async (messageData) => {
  if (currentRoomId) {
    console.log("Sending message to room:", currentRoomId, "Message:", messageData);

    try {
      // Extract user IDs from room ID
      const [userId, targetUserId] = currentRoomId.split("_");
      
      // Find or create chat
      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] }
      });
      
      if (!chat) {
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: []
        });
      }
      
      // Add message to chat with the actual sender ID
      chat.messages.push({
        senderId: messageData.senderId, // Use the actual sender ID from frontend
        text: messageData.text
      });
      
      await chat.save();
      
      // Send the full message data to other users in the room
      socket.to(currentRoomId).emit("messageReceived", {
        text: messageData.text,
        senderId: messageData.senderId
      });
      
    } catch (err) {
      console.error("Error saving message to database:", err);
      // Still send the message even if DB save fails
      socket.to(currentRoomId).emit("messageReceived", {
        text: messageData.text,
        senderId: messageData.senderId
      });
    }
  }
}); 

    // When user disconnects
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      currentRoomId = null;
    });
  });
};

module.exports = initialiseSocket;
