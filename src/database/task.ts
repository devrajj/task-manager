import {
  Schema,
  model,
  FilterQuery,
  ProjectionType,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import { Task } from "../types/task";
import { StatusType } from "../constants/enums";

const TaskSchema = new Schema<Task.ITask>({
  title: { type: String },
  description: { type: String },
  status: { type: String, enum: StatusType },
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
