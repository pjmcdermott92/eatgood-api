import asyncHandler from '../../middleware/asyncHandler.js';
import errorResponse from '../../middleware/errorHandler.js';
import Recipe from '../../models/Recipe.js';

export const setRecipeToReq = asyncHandler(async (req, res, next) => {
    req.recipe = await Recipe.findById(req.params.recipeId);
    if (!req.recipe) return next(errorResponse('Recipe not found', 404));
    next();
});

export const formatRecipeData = (recipeData) => {
    const totalPrepTime = recipeData.prep_time + recipeData.cook_time;

    let prepSteps = {};
    recipeData.preparation_instructions.forEach((step, idx) => {
        prepSteps = { ...prepSteps, [idx + 1]: step };
    });

    return {
        _id: recipeData._id,
        title: recipeData.title,
        created_by: recipeData.created_by,
        image_url: recipeData.image_url,
        description: recipeData.description,
        tags: recipeData.tags,
        serves: recipeData.serves,
        time: {
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time,
            total_time: totalPrepTime,
        },
        ingredients: recipeData.ingredients,
        preparation_instructions: prepSteps,
        average_rating: recipeData.average_rating,
        total_ratings: recipeData.ratings.length,
        favorite_count: recipeData.favorite_count || 0,
    };
};

export const userIsCreator = (recipe, user) => {
    return recipe.created_by.toString() == user._id.toString();
};
