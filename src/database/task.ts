import {
  Schema,
  model,
  FilterQuery,
  ProjectionType,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import { DeleteResult } from "mongodb";

import { Task } from "../types/taskManager/task";
import { StatusType } from "../constants/enums";

const TaskSchema = new Schema<Task.ITask>({
  title: { type: String },
  description: { type: String },
  status: { type: Number, enum: StatusType },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TaskModel = model<Task.ITask>("task", TaskSchema, "task");

export const find = async (
  query: FilterQuery<Task.ITask>,
  projection?: ProjectionType<Task.ITask>
): Promise<Task.ITask[]> => TaskModel.find(query, projection).lean();

export const findOne = async (
  query: FilterQuery<Task.ITask>,
  projection?: ProjectionType<Task.ITask>
): Promise<Task.ITask | null> => TaskModel.findOne(query, projection);

export const findOneAndUpdate = async (
  query: FilterQuery<Task.ITask>,
  update: UpdateQuery<Task.ITask>,
  option?: QueryOptions
): Promise<Task.ITask | null> =>
  TaskModel.findOneAndUpdate(query, update, option);

export const insert = async (
  insertDict: Task.ITask
): Promise<Task.ITask | null> => new TaskModel(insertDict).save();

export const deleteOne = async (
  query: FilterQuery<Task.ITask>
): Promise<DeleteResult> => {
  const result = await TaskModel.deleteOne(query);
  return result;
};

export const getAllTasks = async (pageNumber: number, pageLength: number) => {
  const [tasks, count] = await Promise.all([
    TaskModel.aggregate([
      {
        $sort: { createdAt: 1 },
      },
      {
        $skip: (pageNumber - 1) * pageLength,
      },
      {
        $limit: pageLength,
      },
    ]),
    TaskModel.countDocuments(),
  ]);

  return { tasks, count };
};
