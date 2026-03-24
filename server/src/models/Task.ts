import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Todo', 'In Progress', 'Done'],
        message: "Status must be 'Todo', 'In Progress', or 'Done'",
      },
      default: 'Todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: "Priority must be 'Low', 'Medium', or 'High'",
      },
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes for Optimized Queries ──────────────────────────────────────────

// Compound indexes for filtered queries (user-scoped)
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 }); // default sort

// Full-text search index
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
