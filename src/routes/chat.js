const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat.js"); // Importing the Chat model
const { userAuth } = require("../middlewares/auth"); // Importing the user authentication middleware
const User = require("../models/user.js"); // Importing the User model

// In your chat.js route file
chatRouter.get("/:targetUserId", userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    
    // console.log("Chat GET request:", {
    //     targetUserId,
    //     userId,
    //     user: req.user,
    //     headers: req.headers
    // });

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        });
        
       // console.log("Found chat:", chat);
        
        if (!chat) {
          //  console.log("Creating new chat for participants:", [userId, targetUserId]);
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
            //console.log("New chat created:", chat);
        }
        
        res.json(chat);
    } catch (err) {
        console.error("Chat route error:", err);
        res.status(400).json({
            message: "Something went wrong",
            error: err.message
        });
    }
});

// POST route to save new messages
chatRouter.post("/:targetUserId/message", userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const { text, senderId } = req.body;
    const userId = req.user._id;

    try {
        // Find the chat between these users
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
            // Create new chat if it doesn't exist
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
        }

        // Add the new message
        chat.messages.push({
            senderId: senderId,
            text: text
        });

        await chat.save();
        res.json({ success: true, message: "Message saved successfully" });

    } catch (err) {
        res.status(400).json({
            message: "Error saving message",
            error: err.message
        });
    }
});

module.exports = chatRouter;
