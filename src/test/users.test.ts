const request = require("supertest");
import { faker } from "@faker-js/faker";
import app from "../app";
import User, { UserSchemaType } from "../modules/user/user-models";
function randomUser() {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ max: 90 }),
  };
}
describe("users", () => {
  const [userDetails] = faker.helpers.multiple(randomUser, {
    count: 1,
  });
  describe("POST /users", () => {
    test("User created", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          ...userDetails,
        });

      expect(response.body).not.toBeNull;
      expect(response.statusCode).toBe(201);
    });

    test("New entry with same email id", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          ...userDetails,
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("login with correct credentials", () => {
    test("login with email and password", async () => {
      const { password, email } = userDetails;
      const response = await request(app)
        .post("/users/login")
        .send({
          password,
          email,
        })
        .expect(200);
    });

    test("login with wrong email or password", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          password: "wrongPassword",
          email: "wrongpass@123.com",
        })
        .expect(400);
    });
  });

  describe("view profile", () => {
    test("check profile information", async () => {
      const user = await User.findOne({ email: userDetails.email });
      if (user) {
        const { tokens } = user;

        const response = await request(app)
          .get("/users/me")
          .send()
          .set("Authorization", `Bearer ${tokens[0].token}`)
          .expect(200);
      }
    });

    test("check profile information but incorrect token", async () => {
      const response = await request(app)
        .get("/users/me")
        .send()
        .set("Authorization", "Bearer wrongtoken")
        .expect(401);
    });
  });
});
