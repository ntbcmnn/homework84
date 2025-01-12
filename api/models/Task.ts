import mongoose, {Schema} from "mongoose";

const TaskSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required.'],
    },
    title: {
        type: String,
        required: [true, 'Title is required.'],
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        default: 'new',
    },
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
