import Gig from '../models/Gig.js';
import { GetGigRequest } from '../schemas/gigs/getGigSchemas.js';
import { GetGigsRequest } from '../schemas/gigs/getGigsSchemas.js';
import { PostGigBodyType, PostGigRequest } from '../schemas/gigs/postGigSchemas.js';
import { Request, Response } from 'express';

export async function ListGigs(req: GetGigsRequest, res: Response) {
    const { latitude, longitude, self } = req.query;

    if (latitude && longitude) {
        console.log(`[${new Date().toLocaleTimeString().toUpperCase()}] ✨ [/gigs] Gigs were requested for ${latitude}, ${longitude}.`);
    }

    if (self) {
        const gigs = await Gig.find({ createdBy: req.user.userId });
        return res.status(200).json(gigs);
    } else {
        const gigs = await Gig.find();
        return res.status(200).json(gigs);
    }

    // if (isNaN(latitude) && isNaN(longitude)) {
    //     res.status(400).json({ error: "invalid coordinates provided" });
    // }

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

    try {
        const newGig = new Gig({
            title,
            description,
            category,
            offer,
            location,
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
