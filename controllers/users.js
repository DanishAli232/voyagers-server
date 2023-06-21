import User from "../models/User.js";
import userService from "../services/userService.js";

class UserController {
  async login(req, res) {
    let { values, isValid, errors } = userService.validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    let { status, token, error } = await userService.loginUser(values);

    if (status === "OK") {
      return res.send({ token });
    } else {
      return res.status(401).json(error || { error: "email/password is wrong" });
    }
  }

  async addUser(req, res) {
    let { values, errors, isValid } = userService.validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { status, error, token } = await userService.addUser(values);

    if (status === "OK") {
      return res.status(201).send({ token });
    } else {
      return res.status(400).send(error);
    }
  }

  async getUser(req, res) {
    const user = await User.findById(req.user.id);
    if (user) {
      return res.send({ user });
    } else {
      return res.status(400).send({ error: "Something went wrong" });
    }
  }

  verifyToken(req, res) {
    return res.status(200).json({ message: "Token verified" });
  }
}

export default new UserController();
