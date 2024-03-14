import logger from "../../../lib/logger";
import { Types } from "mongoose";

const { ObjectId } = Types;
import { Request, Response } from "express";
import * as taskService from "../../../services/taskManager/task";
import {
  DEFAULTPAGENUMBER,
  DEFAULTPAGLENGTH,
  STATUSARRAY,
} from "../../../constants/constants";

const isValidObjectId = (id: string) =>
  ObjectId.isValid(id) ? String(new ObjectId(id)) === id : false;

export const createTask = async (
  req: Request,
  res: Response
): Promise<Express.Response> => {
  const { description, title }: { description: string; title: string } =
    req.body;
  if (!title) {
    return res.invalid({ msg: "Title is required" });
  }
  if (!description) {
    return res.invalid({ msg: "Description is required" });
  }
  try {
    const response: Interface.ApiResponse<{}> = await taskService.createTask({
      description,
      title,
    });
    if (!response.ok) {
      return res.failure({ msg: response.err });
    }
    return res.success({ data: response.data });
  } catch (_) {
    logger.error(`Error in createTask API: ${_}`);
    return res.failure({});
  }
};

export const getTaskList = async (
  req: Request,
  res: Response
): Promise<Express.Response> => {
  const {
    pageNumber = DEFAULTPAGENUMBER,
    pageLength = DEFAULTPAGLENGTH,
  }: { pageNumber?: string | number; pageLength?: string | number } = req.query;
  const parsedPageNumber: number =
    typeof pageNumber === "string" ? parseInt(pageNumber, 10) : pageNumber;
  const parsedPageLength: number =
    typeof pageLength === "string" ? parseInt(pageLength, 10) : pageLength;
  if (isNaN(parsedPageNumber) || parsedPageNumber <= 0) {
    return res.invalid({ msg: "Invalid page number" });
  }
  if (isNaN(parsedPageLength) || parsedPageLength <= 0) {
    return res.invalid({ msg: "Invalid page length" });
  }
  try {
    const response: Interface.ApiResponse<{}> = await taskService.getTaskList({
      pageNumber: parsedPageNumber,
      pageLength: parsedPageLength,
    });
    if (!response.ok) {
      return res.failure({ msg: response.err });
    }
    return res.success({ data: response.data });
  } catch (_) {
    logger.error(`Error in getTaskList API: ${_}`);
    return res.failure({});
  }
};

export const getTaskDetail = async (
  req: Request,
  res: Response
): Promise<Express.Response> => {
  const { id }: { id?: string } = req.params;
  if (!id) {
    return res.invalid({ msg: "Task not found" });
  }
  if (!isValidObjectId(id)) {
    return res.invalid({
      msg: "Task id is not correct. Please pass correct task id",
    });
  }
  try {
    const response: Interface.ApiResponse<{}> = await taskService.getTaskDetail(
      { id }
    );
    if (!response.ok) {
      return res.failure({ msg: response.err });
    }
    return res.success({ data: response.data });
  } catch (_) {
    logger.error(`Error in getTaskDetail API: ${_}`);
    return res.failure({});
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<Express.Response> => {
  const {
    description,
    title,
    status,
  }: { description: string; title: string; status: number } = req.body;
  const { id }: { id?: string } = req.params;
  if (!id) {
    return res.invalid({ msg: "TaskId is required" });
  }
  if (!isValidObjectId(id)) {
    return res.invalid({
      msg: "Task id is not correct. Please pass correct task id",
    });
  }
  if (status && !STATUSARRAY.includes(status)) {
    return res.invalid({
      msg: "Status is not correct. Please pass correct status",
    });
  }
  try {
    const response: Interface.ApiResponse<{}> = await taskService.updateTask({
      description,
      title,
      status,
      id,
    });
    if (!response.ok) {
      return res.failure({ msg: response.err });
    }
    return res.success({ data: response.data });
  } catch (_) {
    logger.error(`Error in updateTask API: ${_}`);
    return res.failure({});
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<Express.Response> => {
  const { id }: { id?: string } = req.params;
  if (!id) {
    return res.invalid({ msg: "Task not found" });
  }
  if (!isValidObjectId(id)) {
    return res.invalid({
      msg: "Task id is not correct. Please pass correct task id",
    });
  }
  try {
    const response: Interface.ApiResponse<{}> = await taskService.deleteTask({
      id,
    });
    if (!response.ok) {
      return res.failure({ msg: response.err });
    }
    return res.success({ data: response.data });
  } catch (_) {
    logger.error(`Error in deleteTask API: ${_}`);
    return res.failure({});
  }
};
