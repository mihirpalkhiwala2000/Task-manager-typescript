const request = require("supertest");
import { faker } from "@faker-js/faker";
import app from "../app";
import Task from "../modules/tasks/task-models";
import generate from "utils/generateTokensUtils";
function randomTask() {
  return {
    description: faker.internet.userName(),
    completed: faker.datatype.boolean(),
  };
}
describe("tasks", () => {
  const [taskDetails] = faker.helpers.multiple(randomTask, {
    count: 1,
  });

  describe("POST /tasks", () => {
    test("Task created", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          ...taskDetails,
        })
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.body).not.toBeNull;
      expect(response.statusCode).toBe(201);
    });
    test("Description not provided while Task creation", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ completed: true })
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.body).not.toBeNull;
      expect(response.statusCode).toBe(400);
    });
  });
  describe("GET /tasks", () => {
    test("Display Task ", async () => {
      const response = await request(app)
        .get("/tasks?sortBy=createdAt:desc&completed=true")
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(200);
    });

    test("Display Task but wrong query", async () => {
      const response = await request(app)
        .get("/tasks?sortBy=createdAt:desc&completed=abc")
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /tasks by id", () => {
    test("Display Task by id", async () => {
      const task = await Task.findOne({ description: taskDetails.description });
      if (task) {
        const response = await request(app)
          .get(`/tasks/${task._id}`)
          .send()
          .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
          );

        expect(response.statusCode).toBe(200);
      }
    });
    test("Display Task but with wrong id", async () => {
      const response = await request(app)
        .get("/tasks/64e443720f1cafdb77fe66a2")
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(404);
    });
    test("Display Task but with incorrect id format", async () => {
      const response = await request(app)
        .get("/tasks/Notanobjectid")
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Patch /tasks", () => {
    test("Update Task ", async () => {
      const task = await Task.findOne({ description: taskDetails.description });
      if (task) {
        const response = await request(app)
          .patch(`/tasks/${task._id}`)
          .send({ data: { completed: false } })
          .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
          );

        expect(response.statusCode).toBe(200);
      }
    });

    test("Update Task but with invalid fields", async () => {
      const task = await Task.findOne({ description: taskDetails.description });
      if (task) {
        const response = await request(app)
          .patch(`/tasks/${task._id}`)
          .send({ data: { completed: false, age: 25 } })
          .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
          );

        expect(response.statusCode).toBe(400);
      }
    });
    test("Update Task but with no such task found", async () => {
      const response = await request(app)
        .patch(`/tasks/64e443720f1cafdb77fe66a2`)
        .send({ data: { completed: false } })
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(404);
    });
    test("Update Task but with incorrect id format", async () => {
      const response = await request(app)
        .patch(`/tasks/incorrectIDformat`)
        .send({ data: { completed: false } })
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(400);
    });
  });
  describe("Delete /tasks", () => {
    test("Delete Task ", async () => {
      const task = await Task.findOne({ description: taskDetails.description });
      if (task) {
        const response = await request(app)
          .delete(`/tasks/${task._id}`)
          .send()
          .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
          );

        expect(response.statusCode).toBe(200);
      }
    });
    test("Delete Task but no such task found", async () => {
      const response = await request(app)
        .delete(`/tasks/64e443720f1cafdb77fe66a2`)
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(404);
    });
    test("Delete Task but with incorrect id format", async () => {
      const response = await request(app)
        .delete(`/tasks/incorrectIDformat`)
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0M2RhZjVmMzdjNWZkYjI0ODg0ZjQiLCJpYXQiOjE2OTI2Nzk1OTl9.S9mfR9sr2DjLa1dhVQiefUiCEGWYlsy2rRB5bpN-hdY`
        );

      expect(response.statusCode).toBe(500);
    });
  });
});
