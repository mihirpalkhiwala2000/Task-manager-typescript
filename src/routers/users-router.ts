import * as express from "express";
const userRouter = express.Router();
export default userRouter;
import auth from "../middleware/auth";
import constants from "../constant";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { successfulLogout, created, login } = successMsgs;
const { badRequest, serverError } = errorMsgs;
const { createdC, badRequestC, serverErrorC } = statusCodes;
import {
  postuser,
  validateUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/user-controller";
import { Request, Response, NextFunction } from "express";

interface ReqBodytype {
  name: string;
  password: string;
  age: number;
}

userRouter.post("", async (req: Request, res: Response) => {
  try {
    const { user, token } = await postuser(req.body);

    res.status(createdC).send({
      data: user,
      token: token,
      message: created,
    });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.send({ user: user, token, message: login });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    const { user } = req.body;
    const { token } = req.body;
    user.tokens = user.tokens.filter((tokenin: { token: string }) => {
      return tokenin.token !== token;
    });
    await user.save();

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

    const retuser = await updateUser(updates, user, req.body.data);

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
