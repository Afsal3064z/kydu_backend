import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PostLoginRequest } from '../schemas/users/postLoginSchemas.js';
import { PostSignupRequest } from '../schemas/users/postSignupSchemas.js';

export async function PostLoginUser(req: PostLoginRequest, res: Response) {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            res.status(401).json({ error: "Email/password is invalid." });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            res.status(401).json({ error: "Email/password is invalid." });
            return;
        }

        const token = jwt.sign({ userId: existingUser._id }, 'theKyduKey', { expiresIn: '30d' });

        console.log(`[${new Date().toLocaleTimeString().toUpperCase()}] ✨ [/login] '${email}' has been granted a login token.`)

        res.status(200).json({ token, userId: existingUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export async function PostSignupUser(req: PostSignupRequest, res: Response) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ error: "Email is already in use." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        console.log(`[${new Date().toLocaleTimeString().toUpperCase()}] ✨ [/signup] ${name} has registered an account under the address '${email}'.`)

        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export async function GetUserProfile(req: Request, res: Response) {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: "User not found."});
        }

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An unknown error has occured." });
    }
}