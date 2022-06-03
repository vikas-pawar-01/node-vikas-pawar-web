const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not retrive users.',
            500
        );

        return next(error);
    }


    if (!users || users.length === 0) {
        const error = new HttpError(
            'No users.',
            404
        );
        return next(error);
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser
    try {
        existingUser = await User.findOne({ email: email });
    } catch {
        const error = new HttpError(
            'Something went wrong, could not login you in.',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not login you in.',
            403
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );

        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not login you in.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};

const signupUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check input data.', 422));
    }

    const { name, email, phone, password } = req.body;

    let existingUser
    try {
        existingUser = await User.findOne({ email: email });
    } catch {
        const error = new HttpError(
            'Something wenr wrong, could not signup.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'Could not create user, email already exists.',
            422
        );

        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
    });

    try {
        await createdUser.save();
    } catch {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
    });
};

exports.getUsers = getUsers;
exports.loginUser = loginUser;
exports.signupUser = signupUser;