import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profile_image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export const userValidator = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(8).max(20).required(),
});

export default User;
