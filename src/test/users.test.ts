const request = require("supertest");
import { faker } from "@faker-js/faker";
import app from "../app";
import User from "../modules/user/user-models";
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

    test("New entry with incorrect email id", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          ...userDetails,
          email: 1234,
        });

      expect(response.statusCode).toBe(400);
    });
    test("New entry with incorrect age ", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          ...userDetails,
          age: -10,
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

    test("login with wrong email", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          password: userDetails.password,
          email: "wrongpass@123.com",
        })
        .expect(400);
    });

    test("login with wrong password", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          password: "abcd12334",
          email: userDetails.email,
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

  describe("update", () => {
    test("update profile information", async () => {
      const user = await User.findOne({ email: userDetails.email });
      if (user) {
        const { tokens } = user;

        const response = await request(app)
          .patch("/users/me")
          .send({ data: { name: "Mihir", password: userDetails.password } })
          .set("Authorization", `Bearer ${tokens[0].token}`)
          .expect(200);
      }
    });
    test("update profile information with wrong fields", async () => {
      const user = await User.findOne({ email: userDetails.email });
      if (user) {
        const { tokens } = user;

        const response = await request(app)
          .patch("/users/me")
          .send({ data: { name: "Mihir", gender: "Male" } })
          .set("Authorization", `Bearer ${tokens[0].token}`)
          .expect(400);
      }
    });
    test("update profile information with no data", async () => {
      const user = await User.findOne({ email: userDetails.email });
      if (user) {
        const { tokens } = user;

        const response = await request(app)
          .patch("/users/me")
          .send({ name: "132" })
          .set("Authorization", `Bearer ${tokens[0].token}`)
          .expect(400);
      }
    });

    test("update profile information but wrong token", async () => {
      const response = await request(app)
        .patch("/users/me")
        .send({ data: { name: "Mihir", password: "Mihir123" } })
        .set("Authorization", `Bearer wrongtoken`)
        .expect(401);
    });
  });
  describe("logout", () => {
    test("logout profile ", async () => {
      const user = await User.findOne({ email: userDetails.email });
      if (user) {
        const { tokens } = user;

        const response = await request(app)
          .post("/users/logout")
          .send({ data: { name: "Mihir" } })
          .set("Authorization", `Bearer ${tokens[0].token}`)
          .expect(200);
      }
    });

    test("logout profile information but wrong token", async () => {
      const response = await request(app)
        .get("/users/me")
        .send({ data: { name: "Mihir" } })
        .set("Authorization", `Bearer wrongtoken`)
        .expect(401);
    });
    test("check profile information but no such user found", async () => {
      const response = await request(app)
        .get("/users/me")
        .send()
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0NTEwNTQ1YTBjY2I4ODNjYjNmMWUiLCJpYXQiOjE2OTI2ODQ1NDl9.fV10rTS0b-KZ6dkdYCVtJJL79vCp27NnyTR_Q1-MvTU`
        )
        .expect(401);
    });
  });

  describe("login and delete", () => {
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

    test("Delete user", async () => {
      const user = await User.findOne({ email: userDetails.email });
      if (user) {
        const { tokens } = user;

        const response = await request(app)
          .delete("/users/me")
          .send()
          .set("Authorization", `Bearer ${tokens[0].token}`)
          .expect(200);
      }
    });
  });
});
