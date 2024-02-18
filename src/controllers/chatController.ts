import { Request, Response } from "express";
import Chat, { Message } from "../models/Chat.js";
import mongoose from "mongoose";
import { users } from "../shared/socket.js";
import { PostChatRequest } from "../schemas/chat/postChatSchemas.js";
import { GetChatRequest } from "../schemas/chat/getChatSchemas.js";
import asyncHandler from 'express-async-handler';

// GET /chats
export const ListChats = asyncHandler(_ListChats);
async function _ListChats(req: Request, res: Response) {
    const { userId } = req.user;

    const chats = await Chat.find({ 
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    }).select('-messages').lean();

    res.status(200).send(chats);
}

// GET /chats/:senderId/:receiverId
export const GetChat = asyncHandler(_GetChat);
async function _GetChat(req: GetChatRequest, res: Response) {
    const { senderId, receiverId } = req.params;

    // todo: turn this into a middleware
    if (senderId !== req.user.userId && receiverId !== req.user.userId) {
        res.status(401).send({ error: "Unauthorized chat" });
        return;
    }

    const chat = await Chat.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    }).lean();

    if (!chat) {
        res.status(404).send({ error: "Chat not found." });
        return;
    }

    res.status(200).send(chat);
}

// POST /chats/:senderId/:receiverId
export const SendMessageToChat = asyncHandler(_SendMessageToChat);
async function _SendMessageToChat(req: PostChatRequest, res: Response) {
    const { senderId, receiverId } = req.params;
    const { content } = req.body;

    if (senderId !== req.user.userId && receiverId !== req.user.userId) {
        res.status(401).send({ error: "Unauthorized chat" });
        return;
    }

    let chat = await Chat.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    });

    if (!chat) {
        // If a chat is not already made, we wish to initiate one between the sender and the receiver.
        chat = await Chat.create({
            sender: senderId,
            receiver: receiverId,
            messages: []
        })
    }

    const message: Message = {
        content,
        createdAt: new Date(),
        createdBy: new mongoose.Types.ObjectId(senderId),
        contentType: "TEXT"
    }

    chat.messages.push(message);
    await chat.save();

    // If the recipient has an active socket connection.
    if (users.has(req.user.userId)) {
        users.get(req.user.userId)!.emit("message", { senderId, receiverId, content, createdAt: new Date(), createdBy: senderId });
    }

    res.status(200).send({ message: "Message successfully sent." });
}
