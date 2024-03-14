import { StatusType } from "../../constants/enums";
import {
  insert,
  getAllTasks,
  findOne,
  deleteOne,
  findOneAndUpdate,
} from "../../database/task";

export const createTask = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<Interface.ApiResponse<{}>> => {
  const insertDict: {
    title?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    status: StatusType;
  } = {
    title,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: StatusType.Open,
  };
  const createdTask = await insert(insertDict);
  if (createdTask && createdTask._id) {
    return {
      ok: true,
      data: {
        id: createdTask._id.toString(),
        title: createdTask?.title,
        description: createdTask?.description,
        status: createdTask?.status,
        createdAt: createdTask?.createdAt,
        updatedAt: createdTask?.updatedAt,
      },
    };
  }
  return {
    ok: false,
    err: "Failed to create task",
  };
};

export const getTaskList = async ({
  pageNumber,
  pageLength,
}: {
  pageNumber: number;
  pageLength: number;
}): Promise<Interface.ApiResponse<{}>> => {
  const { tasks, count } = await getAllTasks(pageNumber, pageLength);
  return {
    ok: true,
    data: {
      taskList: tasks,
      total: count,
      pageNumber,
    },
  };
};

export const getTaskDetail = async ({
  id,
}: {
  id: string;
}): Promise<Interface.ApiResponse<{}>> => {
  const foundTask = await findOne({ _id: id });
  if (foundTask && Object.keys(foundTask).length) {
    return {
      ok: true,
      data: foundTask,
    };
  }
  return {
    ok: false,
    err: "Task not found",
  };
};

export const updateTask = async ({
  description,
  title,
  status,
  id,
}: {
  description: string;
  title: string;
  status: number;
  id: string;
}): Promise<Interface.ApiResponse<{}>> => {
  const updateDict: {
    title?: string;
    description?: string;
    updatedAt: Date;
    status?: number;
  } = {
    updatedAt: new Date(),
  };
  if (description) {
    updateDict.description = description;
  }
  if (title) {
    updateDict.title = title;
  }
  if (status) {
    updateDict.status = status;
  }
  const updatedTask = await findOneAndUpdate({ _id: id }, updateDict, {
    new: true,
  });
  if (updatedTask) {
    return {
      ok: true,
      data: updatedTask,
    };
  }
  return {
    ok: false,
    err: "Failed to update task",
  };
};

export const deleteTask = async ({
  id,
}: {
  id: string;
}): Promise<Interface.ApiResponse<{}>> => {
  const deletedTask = await deleteOne({ _id: id });
  if (deletedTask && deletedTask.deletedCount) {
    return {
      ok: true,
      data: {
        message: "Task deleted successfully",
        id: id.toString(),
      },
    };
  }
  return {
    ok: false,
    err: "Failed to delete task/ Task not found",
  };
};
