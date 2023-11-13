import jwt from 'jsonwebtoken';
import config from '../config.js';
import asyncHandler from './asyncHandler.js';
import errorResponse from './errorHandler.js';
import User from '../models/User.js';

const COOKIE_NAME = 'ge_auth_token';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const JWT_EXP = '7d'; // Seven Days
const NOT_AUTHORIZED = errorResponse('Not Authorized', 403);

export const authenticate = asyncHandler(async (req, res, next) => {
    req.token = req.cookies[COOKIE_NAME];

    if (!req.token) return next(NOT_AUTHORIZED);

    try {
        const decoded = jwt.verify(req.token, config.jwtSecret);
        const currentUser = await User.findById(decoded.userId);

        if (!currentUser) return next(NOT_AUTHORIZED);

        req.user = currentUser;
        next();
    } catch (err) {
        return next(NOT_AUTHORIZED);
    }
});

export const generateAuthToken = (req, res, next) => {
    req.token = jwt.sign({ userId: req.user._id }, config.jwtSecret, { expiresIn: JWT_EXP });
    next();
};

export const sendAuthResponse = (req, res) => {
    const cookieOptions = {
        maxAge: SEVEN_DAYS,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict', // Prevent CSRF attacks
    };

    res.status(200)
        .cookie(COOKIE_NAME, req.token, cookieOptions)
        .json({
            success: true,
            data: {
                token: req.token,
                user: {
                    _id: req.user._id,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    profile_image: req.user.profile_image,
                },
            },
        });
};

export const logoutUser = (req, res) => {
    res.stauts(200)
        .cookie(COOKIE_NAME, 'none', {
            httpOnly: true,
            expires: new Date(0),
        })
        .json({ success: true });
};
