import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const FILE_FIELD_NAME = 'image';
const ALLOWED_FILE_TYPES = /jpeg|jpg|png|gif/;
const MB = 5;
const FILE_SIZE_LIMIT = MB * 1000 * 1000; // 5MB

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => createFileName(req, file, cb),
});

function createFileName(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    let hash = crypto.createHash('md5');
    hash = hash.update(Date.now() + req.user._id).digest('hex');
    const fileName = `${req.user._id}-${hash}${extension}`;

    cb(null, fileName);
}

function checkFileType(file, cb) {
    const validExt = ALLOWED_FILE_TYPES.test(path.extname(file.originalname).toLowerCase());
    const validMime = ALLOWED_FILE_TYPES.test(file.mimetype);

    if (validExt && validMime) return cb(null, true);
    else return cb('Error: Invalid file type');
}

const imageUploader = multer({
    storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    filterFile: (_req, file, cb) => checkFileType(file, cb),
}).single(FILE_FIELD_NAME);

export const deleteImage = imagePath => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

export default imageUploader;
