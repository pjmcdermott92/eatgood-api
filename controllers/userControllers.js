import asyncHandler from '../middleware/asyncHandler.js';
import errorResponse from '../middleware/errorHandler.js';
import User from '../models/User.js';

/**
 * @ROUTE   POST    /api/users/register
 * @DESC    Register a new User
 * @ACCESS  Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return next(errorResponse('Email is already reigstered', 400));

    const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password,
    });

    if (!user) return next(errorResponse('Invalid user data', 400));

    req.user = user;
    next();
});

/**
 * @ROUTE   POST    /api/users/auth
 * @DESC    Login a User
 * @ACCESS  Public
 */
export const authUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(errorResponse('Email Address and Password are required', 400));

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.checkPassword(password))) {
        req.user = user;
        next();
    } else {
        next(errorResponse('Invalid Credentials', 401));
    }
});

/**
 * @ROUTE   PUT    /api/users/password
 * @DESC    Change Password
 * @ACCESS  Protected
 */
export const changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!(await req.user.checkPassword(currentPassword))) {
        return next(errorResponse('Current Password is invalid', 403));
    }

    req.user.password = newPassword;
    await req.user.save();

    res.josn({ success: true });
});
