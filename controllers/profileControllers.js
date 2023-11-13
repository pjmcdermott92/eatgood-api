import asyncHandler from '../middleware/asyncHandler.js';
import errorResponse from '../middleware/errorHandler.js';
import Profile, { profileValidator } from '../models/Profile.js';
import Recipe from '../models/Recipe.js';
import uploadImage, { deleteImage } from '../middleware/imageUploader.js';

/**
 * @ROUTE   POST    /api/profiles
 * @DESC    Create or Update a User Profile
 * @ACCESS  Protected
 */
export const createOrUpdateProfile = asyncHandler(async (req, res, next) => {
    await profileValidator.validateAsync(req.body);

    const profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        {
            ...req.body,
            location: { country: req.body.country, state_province: req.body.state_province },
            user: req.user._id,
        },
        { upsert: true, new: true }
    );

    if (!profile) return next(errorResponse('Invalid profile data', 400));

    if (req.body.profile_image) {
        if (req.user.profile_image && req.user.profile_image !== req.body.profile_image) {
            deleteImage(`public${req.user.profile_image}`);
        }

        req.user.profile_image = req.body.profile_image;
        await req.user.save({ new: true });
    }

    await profile.populate('user', 'first_name last_name profile_image');

    res.status(200).json({ success: true, data: profile });
});

/**
 * @ROUTE   GET    /api/profiles
 * @DESC    Get all user Profiles
 * @ACCESS  Protected
 */
export const getAllProfiles = asyncHandler(async (_req, res) => {
    const profiles = await Profile.find()
        .select('user location favorite_cuisines')
        .populate('user', 'first_name last_name profile_image');
    res.status(200).json({ success: true, data: profiles });
});

/**
 * @ROUTE   GET    /api/profiles/:userId
 * @DESC    Get a single profile by User ID
 * @ACCESS  Protected
 */
export const getOneProfileByUserId = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
        'user',
        'first_name last_name profile_image'
    );

    if (!profile) return next(errorResponse('Profile not found', 404));

    res.status(200).json({ success: true, data: profile });
});

/**
 * @ROUTE   GET    /api/profiles/:userId/favorited
 * @DESC    Get all recipes favorited by User
 * @ACCESS  Protected
 */
export const getFavoritedRecipes = asyncHandler(async (req, res) => {
    const favoritedRecipes = await Recipe.find({ favorited_by: req.user._id })
        .select('title created_by image_uri tags serves average_rating favorite_count')
        .populate('created_by', 'first_name last_name');
    res.status(200).json({ success: true, data: favoritedRecipes });
});
