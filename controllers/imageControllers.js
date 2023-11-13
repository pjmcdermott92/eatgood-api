import asyncHandler from '../middleware/asyncHandler.js';
import errorResponse from '../middleware/errorHandler.js';
import imageUploader from '../middleware/imageUploader.js';

/**
 * @ROUTE   POST    /api/upload
 * @DESC    Add an image asset
 * @ACCESS  Protected
 */
export const uploadImage = asyncHandler(async (req, res, next) => {
    imageUploader(req, res, async err => {
        if (err) return next(errorResponse(err.message, 400));

        if (req.file == undefined) {
            return next(errorResponse('No file selected'));
        } else {
            res.status(201).json({ success: true, data: `/uploads/${req.file.filename}` });
        }
    });
});
