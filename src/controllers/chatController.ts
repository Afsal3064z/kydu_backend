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
    })
    .populate({
        path: 'receiver',
        select: 'name _id'
    })
    .populate({
        path: 'sender',
        select: 'name _id'
    })
    .select('-messages')
    .lean();
    
    res.status(200).send(chats);
}

// GET /chats/:receiverId
export const GetChat = asyncHandler(_GetChat);
async function _GetChat(req: GetChatRequest, res: Response) {
    const { userId } = req.user;
    const { receiverId } = req.params;

    // todo: turn this into a middleware
    if (receiverId === userId) {
        res.status(400).send({ error: "Cannot chat with yourself." });
        return;
    }

    const chat = await Chat.findOne({
        $or: [
            { sender: userId, receiver: receiverId },
            { sender: receiverId, receiver: userId }
        ]
    })
    .populate({
        path: 'receiver',
        select: 'name _id'
    })
    .populate({
        path: 'sender',
        select: 'name _id'
    })
    .lean();

    if (!chat) {
        res.status(404).send({ error: "Chat not found." });
        return;
    }

    res.status(200).send(chat);
}

// POST /chats/:receiverId
export const SendMessageToChat = asyncHandler(_SendMessageToChat);
async function _SendMessageToChat(req: PostChatRequest, res: Response) {
    const { userId } = req.user;
    const { receiverId } = req.params;
    const { content } = req.body;

    if (receiverId === userId) {
        res.status(400).send({ error: "Cannot chat with yourself." });
        return;
    }

    let chat = await Chat.findOne({
        $or: [
            { sender: userId, receiver: receiverId },
            { sender: receiverId, receiver: userId }
        ]
    });

    if (!chat) {
        // If a chat is not already made, we need to initiate one between the sender and the receiver.
        chat = await Chat.create({
            sender: userId,
            receiver: receiverId,
            messages: []
        })
    }

    const message: Message = {
        content,
        createdAt: new Date(),
        createdBy: new mongoose.Types.ObjectId(userId),
        contentType: "TEXT"
    }

    chat.messages.push(message);
    await chat.save();

    // If the recipient has an active socket connection.
    if (users.has(receiverId)) {
        users.get(receiverId)!.emit("message", { receiverId, content, createdAt: new Date(), createdBy: userId });
    }

    res.status(200).send({ message: "Message successfully sent." });
}
