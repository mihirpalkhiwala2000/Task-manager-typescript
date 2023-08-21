import * as express from "express";
import User from "./user-models";
const userRouter = express.Router();
export default userRouter;
import auth from "../../middleware/auth";
import constants from "../../constant";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { successfulLogout, created, login } = successMsgs;
const { badRequest, serverError, emailError, emailLoginError, emailusedError } =
  errorMsgs;
const { createdC, badRequestC, serverErrorC } = statusCodes;
import {
  postUser,
  validateUser,
  loginUser,
  updateUser,
  deleteUser,
} from "./user-controller";
import { Request, Response } from "express";

userRouter.post("", async (req: Request, res: Response) => {
  try {
    const { user, token } = await postUser(req.body.userDetails);

    res.status(createdC).send({
      data: user,
      token: token,
      message: created,
    });
  } catch (e: any) {
    res.status(badRequestC).send(e.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.send({ user: user, token, message: login });
  } catch (error: any) {
    res.status(badRequestC).send(error.message);
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    const { user } = req.body;
    const { token } = req.body;
    user.tokens = user.tokens.filter((tokenIn: { token: string }) => {
      return tokenIn.token !== token;
    });
    await User.create(user);

    res.send(successfulLogout);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.get("/me", auth, async (req, res) => {
  const { user } = req.body;

  res.send({ data: user });
});

userRouter.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body.data);

  const isValidOperation = validateUser(updates);

  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const { user } = req.body;

    const retuser = await updateUser(user, req.body.data);

    res.send({ data: retuser });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.delete("/me", auth, async (req, res) => {
  try {
    const { user } = req.body;
    deleteUser(user._id);
    res.send({ data: user });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
