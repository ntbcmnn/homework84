import express from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateToken();

        await user.save();
        res.send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const ValidationErrors = Object.keys(error.errors).map((key: string) => (
                    {
                        field: key,
                        message: error.errors[key].message,
                    }
                )
            );
            res.status(400).send({errors: ValidationErrors});
            return;
        }
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            res.status(401).send({error: "Username not found"});
            return;
        }

        const isMatch = await user.comparePassword(req.body.password);

        if (!isMatch) {
            res.status(400).send({error: "Password is wrong"});
            return;
        }

        user.generateToken();
        await user.save();

        res.send({message: "Username and password are correct", user});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const ValidationErrors = Object.keys(error.errors).map((key: string) => (
                    {
                        field: key,
                        message: error.errors[key].message,
                    }
                )
            );
            res.status(400).send({errors: ValidationErrors});
            return;
        }
        next(error);
    }
});

export default usersRouter;