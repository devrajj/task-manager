import request from "supertest";
import express from "express";
import routes from "../src/routes/routes";
import mongoDBService from "../src/connections/mongodb";
import responseHandler from "../src/routes/middleware/responseHandler";
import * as taskService from "../src/services/taskManager/task";
import { findOne } from "../src/database/task";

const app = express();
app.use(express.json());
app.use(responseHandler);
app.use(routes);

(async () => {
  try {
    await mongoDBService.connectWithRetry();
  } catch (error) {
    process.exit(1);
  }
})();
import { StatusType } from "../src/constants/enums";
import { DEFAULTPAGENUMBER } from "../src/constants/constants";

describe("Create Task API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return unauthorized if apikey is wrong", async () => {
    const taskData = {
      title: "Test Task 1",
      description: "Test Description 1",
    };
    const apikey = "1234";
    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("authorization", apikey);
    expect(response.status).toBe(401);
    expect(response.ok).toBe(false);
    expect(response.body).toEqual({
      ok: false,
      err: "Authentication Failed",
      data: null,
    });
  });

  it("should create a new task", async () => {
    const taskData = {
      title: "Test Task 2",
      description: "Test Description 2",
    };
    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("authorization", `${process.env.apiAccess}`);
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    expect(response.body).toEqual({
      ok: true,
      err: null,
      data: {
        id: expect.any(String),
        title: "Test Task 2",
        description: "Test Description 2",
        status: StatusType.Open,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it("should return an error if title is missing", async () => {
    const taskData = {
      description: "Test Description 3",
    };
    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: false,
      err: "Title is required",
      data: null,
    });
  });

  it("should return an error if description is missing", async () => {
    const taskData = {
      title: "Test Task 4",
    };
    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: false,
      err: "Description is required",
      data: null,
    });
  });

  it("should return an error if task creation fails", async () => {
    const taskData = {
      title: "Test Task 5",
      description: "Test Description 5",
    };

    jest
      .spyOn(taskService, "createTask")
      .mockRejectedValueOnce(new Error("Failed to create task"));

    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: null,
      err: expect.any(String),
      ok: false,
    });
  });
});

describe("Get Task List", () => {
  it("should return a list of tasks with default pagination values if no query parameters provided", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("authorization", `${process.env.apiAccess}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.taskList).toEqual(expect.any(Array));
    expect(response.body.data.total).toEqual(expect.any(Number));
    expect(response.body.data.pageNumber).toEqual(DEFAULTPAGENUMBER);
    expect(response.body.data.taskList.length).toBeGreaterThanOrEqual(0);
  });

  it("should return a list of tasks with custom pagination values", async () => {
    const pageNumber = 2;
    const pageLength = 5;
    const response = await request(app)
      .get(`/tasks?pageNumber=${pageNumber}&pageLength=${pageLength}`)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.taskList).toEqual(expect.any(Array));
    expect(response.body.data.total).toEqual(expect.any(Number));
    expect(response.body.data.pageNumber).toEqual(pageNumber);
    expect(response.body.data.taskList.length).toBeLessThanOrEqual(pageLength);
  });

  it("should return an error if pageNumber is invalid", async () => {
    const invalidPageNumber = "invalid_page_number";
    const response = await request(app)
      .get(`/tasks?pageNumber=${invalidPageNumber}`)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.err).toBe("Invalid page number");
  });

  it("should return an error if pageLength is invalid", async () => {
    const invalidPageLength = "invalid_page_length";
    const response = await request(app)
      .get(`/tasks?pageLength=${invalidPageLength}`)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.err).toBe("Invalid page length");
  });
});

describe("Get Task Detail", () => {
  it("should return a task detail", async () => {
    const foundTask = await findOne({});
    const taskId = foundTask?._id;

    const response = await request(app)
      .get(`/tasks/${taskId}`)
      .set("authorization", `${process.env.apiAccess}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data).toEqual(expect.any(Object));
    expect(response.body.data._id.toString()).toBe(taskId?.toString());
  });

  it("should return an error if task detail not found", async () => {
    const nonExistentTaskId = "65f265f307a979093e8ceb64";
    const response = await request(app)
      .get(`/tasks/${nonExistentTaskId}`)
      .set("authorization", `${process.env.apiAccess}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.err).toBe("Task not found");
  });

  it("should return an error if invalid task ID is provided", async () => {
    const invalidTaskId = "invalid_task_id";
    const response = await request(app)
      .get(`/tasks/${invalidTaskId}`)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.err).toBe(
      "Task id is not correct. Please pass correct task id"
    );
  });
});

describe("Update Task", () => {
  it("should update a task successfully", async () => {
    const foundTask = await findOne({});
    const taskId = foundTask?._id;

    const updatedTaskData = {
      title: "Updated Task Title 7",
      description: "Updated Task Description 7",
      status: StatusType.InProgress,
    };

    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send(updatedTaskData)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data).toEqual(expect.any(Object));
    expect(response.body.data.title).toBe(updatedTaskData.title);
    expect(response.body.data.description).toBe(updatedTaskData.description);
    expect(response.body.data.status).toBe(updatedTaskData.status);
  });

  it("should return an error if task ID is invalid", async () => {
    const invalidTaskId = "invalid_task_id";
    const updatedTaskData = {
      title: "Updated Task Title 9",
      description: "Updated Task Description 9",
      status: 2,
    };

    const response = await request(app)
      .put(`/tasks/${invalidTaskId}`)
      .send(updatedTaskData)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.err).toBe(
      "Task id is not correct. Please pass correct task id"
    );
  });
});

describe("Delete Task", () => {
  it("should delete a task successfully", async () => {
    const foundTask = await findOne({});
    const taskId = foundTask?._id;

    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("authorization", `${process.env.apiAccess}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data).toEqual(expect.any(Object));
    expect(response.body.data.message).toBe("Task deleted successfully");
    expect(response.body.data.id.toString()).toBe(taskId?.toString());
  });

  it("should return an error if task ID is invalid", async () => {
    const invalidTaskId = "invalid_task_id";

    const response = await request(app)
      .delete(`/tasks/${invalidTaskId}`)
      .set("authorization", `${process.env.apiAccess}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.err).toBe(
      "Task id is not correct. Please pass correct task id"
    );
  });
});
