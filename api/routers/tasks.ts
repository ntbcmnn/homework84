import mongoose from 'mongoose';
import express from 'express';
import auth, {RequestWithUser} from '../middleware/auth';
import Task from '../models/Task';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    const {title, description, status} = req.body;

    if (!user) {
        res.status(401).send({error: 'User not found'});
        return;
    }

    try {
        const task = new Task({
            user: user._id,
            title,
            description,
            status
        });

        await task.save();
        res.send(task);
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

tasksRouter.get('/', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;

    if (!user) {
        res.status(401).send({error: 'User not found'});
        return;
    }

    try {
        const tasks = await Task.find({user: user._id}).populate('user', 'username');
        res.send(tasks);
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

tasksRouter.put('/:id', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    const taskId = req.params.id;
    const {title, description, status} = req.body;

    if (!user) {
        res.status(401).send({error: 'User not found'});
        return;
    }

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404).send({error: 'Task not found'});
            return;
        }

        if (task.user.toString() !== user._id.toString()) {
            res.status(403).send({error: `You aren't allowed to edit this task`});
            return;
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    title,
                    description,
                    status,
                },
            },
            {new: true, runValidators: true}
        );

        res.send(updatedTask);
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

tasksRouter.delete('/:id', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    const taskId = req.params.id;

    if (!user) {
        res.status(401).send({error: 'User not found'});
        return;
    }

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            res.status(404).send({error: 'Task not found'});
            return;
        }

        if (task.user.toString() !== user._id.toString()) {
            res.status(403).send({error: `You aren't allowed to delete this task`});
            return;
        }

        await Task.findByIdAndDelete(taskId);
        res.send({message: 'Task deleted successfully'});
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

export default tasksRouter;