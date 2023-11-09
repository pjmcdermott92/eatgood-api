import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        location: {
            country: {
                type: String,
            },
            state_province: {
                type: String,
            },
        },
        bio: {
            type: String,
            required: true,
        },
        hobbies: [
            {
                type: String,
            },
        ],
        favorite_cuisines: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export const profileValidator = Joi.object({
    location: Joi.object({
        country: Joi.string(),
        state_province: Joi.string(),
    }),
    bio: Joi.string().required(),
    hobbies: Joi.array().items(Joi.string()),
    favorite_cuisines: Joi.array().items(Joi.string()),
});

export default Profile;
