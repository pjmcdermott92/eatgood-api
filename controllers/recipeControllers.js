import asyncHandler from '../middleware/asyncHandler.js';
import errorResponse from '../middleware/errorHandler.js';
import Recipe, { recipeValidator } from '../models/Recipe.js';
import { formatRecipeData, userIsCreator } from './extensions/recipeExt.js';

/**
 * @ROUTE   POST    /api/recipes
 * @DESC    Add a recipe
 * @ACCESS  Protected
 */
export const addNewRecipe = asyncHandler(async (req, res, next) => {
    await recipeValidator.validateAsync(req.body);

    const newRecipe = await Recipe.create({
        ...req.body,
        created_by: req.user._id,
    });

    if (!newRecipe) return next(errorResponse('Invalid data', 400));

    await newRecipe.populate('created_by', 'first_name last_name');

    res.status(201).json({ success: true, data: formatRecipeData(newRecipe._doc) });
});

/**
 * @ROUTE   GET    /api/recipes
 * @DESC    List all Recipes
 * @ACCESS  Protected
 */
export const getAllRecipes = asyncHandler(async (_req, res) => {
    const recipes = await Recipe.find()
        .select('title created_by image_uri tags serves avarage_rating favorite_count')
        .populate('created_by', 'first_name last_name');

    res.status(200).json({ success: true, data: recipes });
});

/**
 * @ROUTE   GET    /api/recipes/:recipeId
 * @DESC    Get one recipe
 * @ACCESS  Protected
 */
export const getOneRecipe = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: formatRecipeData(req.recipe) });
});

/**
 * @ROUTE   PUT    /api/recipes/:recipeId
 * @DESC    Edit a recipe
 * @ACCESS  Protected
 */
export const editRecipe = asyncHandler(async (req, res, next) => {
    if (!userIsCreator(req.recipe, req.user)) {
        return next(errorResponse('Not Authorized', 403));
    }

    await recipeValidator.validateAsync(req.body);

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.recipeId, req.body, { new: true }).populate(
        'created_by',
        'first_name last_name'
    );
    res.status(200).json({ success: true, data: formatRecipeData(updatedRecipe._doc) });
});

/**
 * @ROUTE   PUT    /api/recipes/:recipeId/favorite
 * @DESC    Favorite/Unfavorite a recipe
 * @ACCESS  Protected
 */
export const toggleFavoriteRecipe = asyncHandler(async (req, res, next) => {
    if (userIsCreator(req.recipe, req.user)) return next(errorResponse('Users cannot favorite their own recipes', 403));

    const isFavorited = req.recipe.favorited_by.some((user) => user.toString() === req.user._id.toString());

    if (isFavorited) {
        req.recipe.favorited_by = req.recipe.favorited_by.filter((user) => user.toString() !== req.user._id.toString());
        req.recipe.favorite_count--;
    } else {
        req.recipe.favorited_by.unshift(req.user._id);
        req.recipe.favorite_count++;
    }

    await req.recipe.save();

    res.status(200).json({
        success: true,
        data: {
            recipe: req.recipe._id,
            favorited: !isFavorited,
        },
    });
});

/**
 * @ROUTE   PUT    /api/recipes/:recipeId/rate
 * @DESC    Rate a recipe
 * @ACCESS  Protected
 */
export const rateRecipe = asyncHandler(async (req, res, next) => {
    if (userIsCreator(req.recipe, req.user)) return next(errorResponse('Users cannot rate their own recipes', 403));

    if (req.recipe.ratings.some((rating) => rating.user.toString() == req.user._id.toString())) {
        return next(errorResponse('User has already rated this recipe', 400));
    }

    if (!req.body.rating) return next(errorResponse('Please provide a rating between 1 and 5', 400));

    req.recipe.ratings.unshift({ user: req.user._id, value: req.body.rating });
    await req.recipe.save();

    res.status(200).json({
        success: true,
        data: {
            recipe: req.recipe._id,
            rating: req.body.rating,
        },
    });
});

/**
 * @ROUTE   DELETE    /api/recipes/:recipeId
 * @DESC    Delete a recipe
 * @ACCESS  Protected
 */
export const deleteRecipe = asyncHandler(async (req, res, next) => {
    if (!userIsCreator(req.recipe, req.user)) return next(errorResponse('Not Authorized', 403));

    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.status(200).json({ success: true, data: req.recipe._id });
});
