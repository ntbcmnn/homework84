import config from './config';
import mongoose from 'mongoose';
import User from './models/User';
import {randomUUID} from 'node:crypto';
import Task from './models/Task';

const run = async () => {
    await mongoose.connect(config.db);

    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('tasks');
    } catch (e) {
        console.log(`Collections weren't present, skipping the drop`);
    }

    const [userJane, userJohn, userAnne] = await User.create(
        {
            username: 'Jane',
            password: '123456',
            token: randomUUID(),
        },
        {
            username: 'John',
            password: '321',
            token: randomUUID(),
        },
        {
            username: 'Anne',
            password: '3233',
            token: randomUUID(),
        },
    );
    await Task.create(
        {
            user: userJane._id,
            title: 'Do the chores',
            description: '',
            status: 'new'
        },
        {
            user: userJohn._id,
            title: 'Wash the dishes',
            description: '',
            status: 'in_progress'
        },
        {
            user: userAnne._id,
            title: 'Cook food for a week',
            description: '',
            status: 'complete'
        },
        {
            user: userAnne._id,
            title: 'Wash the cat',
            description: '',
            status: undefined
        },
        {
            user: userJohn._id,
            title: 'Go to gym',
            description: '',
            status: 'in_progress'
        },
        {
            user: userJane._id,
            title: 'Meet with friends',
            description: '',
            status: 'new'
        },
    );
    await db.close();
};

run().catch(console.error);