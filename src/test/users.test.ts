const request = require("supertest");
import { faker } from "@faker-js/faker";
import app from "../app";
import { UserSchemaType } from "modules/user/user-models";
import { response } from "express";
function randomUser() {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ max: 90 }),
  };
}

describe("POST /users", () => {
  test("response has userId", async () => {
    const [userDetails] = faker.helpers.multiple(randomUser, {
      count: 1,
    });

    const response = await request(app).post("/users").send({
      userDetails,
    });

    expect(response.body).not.toBeNull;
    expect(response.statusCode).toBe(201);
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
