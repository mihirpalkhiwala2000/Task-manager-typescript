const request = require("supertest");
import app from "../app";
beforeEach(async () => {
  console.log("before");
});

describe("POST /users", () => {
  test("response has userId", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "name",
        password: "password",
        email: "email11111112222222@test.com",
        age: 25,
      })
      .expect(201);
  });
  test("login with email and password", async () => {
    await request(app)
      .post("/users/login")
      .send({
        password: "password",
        email: "email11111112@test.com",
      })
      .expect(200);
  });
});
