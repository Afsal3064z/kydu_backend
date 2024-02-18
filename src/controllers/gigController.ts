import Gig from '../models/Gig.js';
import User from '../models/User.js';
import { GetGigRequest } from '../schemas/gigs/getGigSchemas.js';
import { GetGigsRequest } from '../schemas/gigs/getGigsSchemas.js';
import { PostGigBodyType, PostGigRequest } from '../schemas/gigs/postGigSchemas.js';
import { Request, Response } from 'express';
import { sendNotificationToDevice } from '../shared/notification.js';
import { PostGigConnectionRequest } from '../schemas/gigs/postGigConnectionSchemas.js';

export async function ListGigs(req: GetGigsRequest, res: Response) {
    const { latitude, longitude, self } = req.query;

    if (latitude && longitude) {
        console.log(`[${new Date().toLocaleTimeString().toUpperCase()}] ✨ [/gigs] Gigs were requested for ${latitude}, ${longitude}.`);
    }

    if (self) {
        // `self` means the request is for gigs that are posted by the `req.user`
        const gigs = await Gig.find({ createdBy: req.user.userId }).populate({path: "createdBy", select: "name" });
        return res.status(200).json(gigs);
    } else {
        // if (isNaN(latitude) && isNaN(longitude)) {
        //     return res.status(400).json({ error: "invalid coordinates provided" });
        // }
        // todo: We need to run a geospatial query to only list gigs that are within a 10km radius of the given user.
        const gigs = await Gig.find({ createdBy: { $ne: req.user.userId }}).populate({path: "createdBy", select: "name" });
        return res.status(200).json(gigs);
    }
}

interface PostGigRequestType extends PostGigBodyType, Request {
    files: Express.Multer.File[];
}

export async function PostGig(req: PostGigRequest, res: Response) {
    const { category, title, description, offer, location } = req.body;
    const createdBy = req.user.userId;

    const photos: string[] = [];
    const files = (req as PostGigRequestType).files;
    if (req.files) {
        for (const imageFile of files) {
            photos.push(imageFile.filename);
        }
    }

    const gigLocation = {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
        name: location.name
    }

    try {
        const newGig = new Gig({
            title,
            description,
            category,
            offer,
            location: gigLocation,
            photos,
            createdBy
        });

        await newGig.save();
        console.log(`[${new Date().toLocaleTimeString().toUpperCase()}] ✨ [/gigs] A new gig has been posted: ${title} at ${location}.`);

        res.status(201).json({ message: "Gig created successfully.", gig: newGig });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export async function GetGig(req: GetGigRequest, res: Response) {
    const { gigId } = req.params;

    try {
        const gig = await Gig.findById(gigId);

        if (!gig) {
            res.status(404).json({ error: "Gig not found." });
            return;
        }

        res.status(200).json(gig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export async function DeleteGig(req: GetGigRequest, res: Response) {
    const { gigId } = req.params;

    try {
        const gig = await Gig.findById(gigId);

        if (!gig) {
            res.status(404).json({ error: "Gig not found." });
            return;
        }

        if (!gig.createdBy.equals(req.user.userId)) {
            res.status(401).json({ error: "You are not the creator of this gig." });
            return;
        }

        await gig.deleteOne();

        console.log(`[${new Date().toLocaleTimeString().toUpperCase()}] ✨ [/gigs] A gig was deleted: ${gig.title}.`);

        res.status(200).json({ message: "Gig deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export async function ConnectWithGig(req: PostGigConnectionRequest, res: Response) {
    const { userId } = req.user;
    const { gigId } = req.params;

    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).send({ error: "Gig not found." });
        }

        if (userId === gig.createdBy.toString()) {
            return res.status(400).send({ error: "Creator cannot run the same gig. " });
        }

        const gigAppliedBy = await User.findById(userId);
        if (!gigAppliedBy) {
            return res.status(404).send({ error: "Runner not found. " });
        }

        const gigCreatedBy = await User.findById(gig.createdBy);
        if (!gigCreatedBy) {
            return res.status(404).send({ error: "Gig owner not found. " });
        }

        if (gigCreatedBy.fcmToken.length > 1) {
            // A valid FCM token indicates that we can send a notification to the owner of the gig.
            await sendNotificationToDevice(gigCreatedBy.fcmToken, "Connection Request", "Your gig has a new connection request.");
            console.log(`[notification] 📲 FCM Notification sent to '${gigCreatedBy.fcmToken.slice(6)}'`)
        }

        gigCreatedBy.alerts.push({
            content: `Your gig has a new connection request from ${gigAppliedBy.name}`,
            type: "CONNECTION",
            data: `${gigAppliedBy._id}`,
            createdAt: new Date()
        });

        await gigCreatedBy.save();

        // todo: cleanup gigCreatedBy.alerts that has exceeded 16 days.

        res.status(200).send({ message: "Connected successfully." })

    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
        console.error(err);
    }
}