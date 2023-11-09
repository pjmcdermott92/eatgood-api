import express from 'express';
import {
    addNewRecipe,
    deleteRecipe,
    editRecipe,
    getAllRecipes,
    getOneRecipe,
    rateRecipe,
    toggleFavoriteRecipe,
} from '../controllers/recipeControllers.js';
import { setRecipeToReq } from '../controllers/extensions/recipeExt.js';

const router = express.Router();

router.route('/').post(addNewRecipe).get(getAllRecipes);
router.put('/:recipeId/rate', setRecipeToReq, rateRecipe);
router.put('/:recipeId/favorite', setRecipeToReq, toggleFavoriteRecipe);
router.route('/:recipeId').put(setRecipeToReq, editRecipe).get(setRecipeToReq, getOneRecipe).delete(setRecipeToReq, deleteRecipe);

export default router;
