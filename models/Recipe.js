import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

const recipeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        image_uri: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
            },
        ],
        serves: {
            type: Number,
            required: true,
        },
        prep_time: {
            type: Number,
            required: true,
        },
        cook_time: {
            type: Number,
            required: true,
        },
        ingredients: [
            {
                type: String,
            },
        ],
        preparation_instructions: [
            {
                type: String,
            },
        ],
        ratings: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                value: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
            },
        ],
        avarage_rating: {
            type: Number,
            default: 0,
        },
        favorited_by: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        favorite_count: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

recipeSchema.pre('save', function (next) {
    const ratingsCount = this.ratings.length;
    if (ratingsCount == 0) next();

    const totalRatingsValue = this.ratings.reduce((value, rating) => {
        value += rating.value;
        return value;
    }, 0);

    this.avarage_rating = Math.round((totalRatingsValue / ratingsCount) * 2) / 2 || 0;
    next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export const recipeValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(50).required(),
    tags: Joi.array().items(Joi.string()),
    serves: Joi.number().min(1).required(),
    prep_time: Joi.number(),
    cook_time: Joi.number(),
    ingredients: Joi.array().items(Joi.string()),
    preparation_instructions: Joi.array().items(Joi.string()),
});

export default Recipe;
