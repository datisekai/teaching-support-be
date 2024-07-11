import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { myDataSource } from "../app-data-source";
import config from "../config/config";
import { User } from "../entity/user.entity";
import { passwordCompare } from "../utils";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { code, password } = req.body;
    if (!(code && password)) {
      res
        .status(400)
        .send({ message: "code & password is required", success: false });
    }

    //Get user from database
    const userRepository = myDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { code, is_deleted: false },
        select: ["id", "active", "code", "email", "password", "salt"],
      });
    } catch (error) {
      res
        .status(401)
        .send({ message: "code or password is wrong", success: false });
    }
    console.log(user);

    if (user && !user.active) {
      res.status(400).send({ message: "user is not active", success: false });
    }

    //Check if encrypted password match
    if (!passwordCompare(password, user.salt, user.password)) {
      res.status(401).send({
        message: "Unauthorized",
        success: false,
      });
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { id: user.id, code: user.code, email: user.email },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    //Send the jwt in the response
    res.send({
      success: true,
      data: {
        token,
      },
    });
  };

  // static changePassword = async (req: Request, res: Response) => {
  //   //Get ID from JWT
  //   const id = res.locals.jwtPayload.userId;

  //   //Get parameters from the body
  //   const { oldPassword, newPassword } = req.body;
  //   if (!(oldPassword && newPassword)) {
  //     res.status(400).send();
  //   }

  //   //Get user from the database
  //   const userRepository = getRepository(User);
  //   let user: User;
  //   try {
  //     user = await userRepository.findOneOrFail(id);
  //   } catch (id) {
  //     res.status(401).send();
  //   }

  //   //Check if old password matchs
  //   if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
  //     res.status(401).send();
  //     return;
  //   }

  //   //Validate de model (password lenght)
  //   user.password = newPassword;
  //   const errors = await validate(user);
  //   if (errors.length > 0) {
  //     res.status(400).send(errors);
  //     return;
  //   }
  //   //Hash the new password and save
  //   user.hashPassword();
  //   userRepository.save(user);

  //   res.status(204).send();
  // };
}
export default AuthController;
