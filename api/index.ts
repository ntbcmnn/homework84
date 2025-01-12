import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Listening on port: http://localhost:${port}`);
    });
};

run().catch(err => console.log(err));