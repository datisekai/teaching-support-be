import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { myDataSource } from "../app-data-source";
import config from "../config/config";
import { User } from "../entity/user.entity";
import { encodeBase64, passwordCompare } from "../utils";
import { UserRole } from "../dto/UserDto";
import { AuthService } from "../services/AuthService";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { code, password } = req.body;
    if (!(code && password)) {
      return res
        .status(400)
        .send({ message: "code & password is required", success: false });
    }

    //Get user from database
    const userRepository = myDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOne({
        where: { code, is_deleted: false },
        select: ["id", "active", "code", "email", "password", "role", "name"],
      });

      if (!user) {
        const info = await AuthService.getInformation(code, password);
        console.log("info", info);

        if (!info) {
          return res
            .status(400)
            .send({ message: "code or password is wrong", success: false });
        }

        user = new User();
        user.code = code;
        user.email = info.email;
        user.name = info.ten_day_du;
        user.role = info.roles;
        user.phone = info.dien_thoai;
        user.password = encodeBase64(password);
        user.active = true;
        await userRepository.save(user);
      }
    } catch (error) {
      return res
        .status(400)
        .send({ message: "code or password is wrong", success: false });
    }

    console.log("user", user);
    if (user && !user.active) {
      return res
        .status(400)
        .send({ message: "user is not active", success: false });
    }

    if (user && user.role != UserRole.STUDENT) {
      return res.status(403).send({ message: "Forbidden", success: false });
    }

    //Check if encrypted password match
    if (encodeBase64(password) !== user.password) {
      res.status(400).send({
        message: "code or password is wrong",
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

    delete user["password"];
    //Send the jwt in the response
    return res.send({
      success: true,
      data: {
        token,
        user,
      },
    });
  };

  static loginPortal = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { code, password } = req.body;
    if (!(code && password)) {
      return res
        .status(400)
        .send({ message: "code & password is required", success: false });
    }

    //Get user from database
    const userRepository = myDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOne({
        where: { code, is_deleted: false },
        select: ["id", "active", "code", "email", "password", "role", "name"],
      });

      if (!user) {
        const info = await AuthService.getInformation(code, password);
        console.log("info", info);

        if (!info) {
          return res
            .status(400)
            .send({ message: "code or password is wrong", success: false });
        }

        user = new User();
        user.code = code;
        user.email = info.email;
        user.name = info.ten_day_du;
        user.role = info.roles;
        user.phone = info.dien_thoai;
        user.password = encodeBase64(password);
        user.active = true;
        await userRepository.save(user);
      }
    } catch (error) {
      return res
        .status(400)
        .send({ message: "code or password is wrong", success: false });
    }

    if (user && !user.active) {
      res.status(400).send({ message: "user is not active", success: false });
      return;
    }

    //Check if encrypted password match
    if (encodeBase64(password) !== user.password) {
      res.status(400).send({
        message: "code or password is wrong",
        success: false,
      });
      return;
    }

    if (user && user.role == UserRole.STUDENT) {
      res.status(403).json({ message: "Forbidden", success: false });
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { id: user.id, code: user.code, email: user.email },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    delete user["password"];
    //Send the jwt in the response
    return res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  };

  static checkToken = async (req: Request, res: Response) => {
    return res.send({ success: true });
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
