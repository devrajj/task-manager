import mongoose from "mongoose";
export namespace Task {
  export type ITask = {
    _id?: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
