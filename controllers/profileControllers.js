import asyncHandler from '../middleware/asyncHandler.js';
import errorResponse from '../middleware/errorHandler.js';
import Profile, { profileValidator } from '../models/Profile.js';
import Recipe from '../models/Recipe.js';

/**
 * @ROUTE   POST    /api/profiles
 * @DESC    Create or Update a User Profile
 * @ACCESS  Protected
 */
export const createOrUpdateProfile = asyncHandler(async (req, res, next) => {
    await profileValidator.validateAsync(req.body);

    const profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { ...req.body, user: req.user._id },
        { upsert: true, new: true }
    );

    if (!profile) return next(errorResponse('Invalide profile data', 400));
    await profile.populate('user', 'first_name last_name');

    res.status(200).json({ success: true, data: profile });
});

/**
 * @ROUTE   GET    /api/profiles
 * @DESC    Get all user Profiles
 * @ACCESS  Protected
 */
export const getAllProfiles = asyncHandler(async (_req, res) => {
    const profiles = await Profile.find().select('user location favorite_cuisines').populate('user', 'first_name last_name');
    res.status(200).json({ success: true, data: profiles });
});

/**
 * @ROUTE   GET    /api/profiles/:userId
 * @DESC    Get a single profile by User ID
 * @ACCESS  Protected
 */
export const getOneProfileByUserId = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'first_name last_name');

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
        .select('title created_by image_uri tags serves avarage_rating favorite_count')
        .populate('created_by', 'first_name last_name');
    res.status(200).json({ success: true, data: favoritedRecipes });
});
