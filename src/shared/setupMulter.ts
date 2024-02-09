import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';

const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const gigImageStorage: StorageEngine = multer.diskStorage({
    destination: (_req, file, cb) => {
        cb(null, './public/uploads/gigs');
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const getGigImages = multer({
    dest: 'public/uploads/gigs/',
    fileFilter: imageFilter,
    storage: gigImageStorage,
});

export { getGigImages };
