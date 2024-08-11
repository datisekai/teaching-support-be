import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/user.entity";
import { passwordHash } from "../utils";
import { myDataSource } from "../app-data-source";
import { UserDto, UserRole } from "../dto/UserDto";

class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = myDataSource.getRepository(User);
    const users = await userRepository.find({
      where: {
        is_deleted: false,
      },
      select: [
        "id",
        "code",
        "email",
        "phone",
        "active",
        "role",
        "name",
        "avatar",
        "device_uid",
      ], //We dont want to send the passwords on response
    });

    //Send the users object
    res.send({
      message: "success",
      data: {
        users,
      },
    });
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = +req.params.id;

    //Get the user from database
    const userRepository = myDataSource.getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
        select: [
          "id",
          "code",
          "email",
          "phone",
          "active",
          "role",
          "name",
          "avatar",
          "device_uid",
        ], //We dont want to send the password on response
      });
      res.send({
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(404).send({ message: "User not found", success: false });
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let {
      email,
      password,
      active,
      phone,
      role,
      name,
      avatar,
      device_uid,
      code,
    } = req.body;
    let user = new UserDto();
    user.email = email;
    user.password = password;
    user.active = active;
    user.phone = phone;
    user.role = role;
    user.name = name;
    user.avatar = avatar;
    user.device_uid = device_uid;
    user.code = code;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    const { hash, salt } = passwordHash(password);

    user.password = hash;
    user.salt = salt;

    //Try to save. If fails, the email is already in use
    const userRepository = myDataSource.getRepository(User);
    try {
      const userSaved = await userRepository.save(user);

      //If all ok, send 201 response
      res.status(201).send({
        success: true,
        message: "User created",
        data: userSaved,
      });
    } catch (e) {
      res
        .status(409)
        .send({ success: false, message: "code or email already in use" });
      return;
    }
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    //Get values from the body
    const { password, active, phone, role, name, avatar } = req.body;

    //Try to find user on database
    const userRepository = myDataSource.getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
        select: ["id", "email", "password", "salt", "active"],
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({ success: false, message: "User not found" });
      return;
    }

    //Validate the new values on model
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    if (password) {
      const { hash, salt } = passwordHash(password);
      user.password = hash;
      user.salt = salt;
    }

    if (active != null) {
      user.active = Boolean(active);
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({ success: false, message: "existed error" });
      return;
    }
    res.status(200).send({ success: true, message: "User edited" });
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    const userRepository = myDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "User not found" });
      return;
    }
    user.is_deleted = true;
    await userRepository.save(user);

    res.status(200).send({ success: true, message: "User deleted" });
  };

  static resetDeviceUid = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const userRepository = myDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "User not found" });
      return;
    }
    user.device_uid = null;
    await userRepository.save(user);

    res.status(200).send({ success: true, message: "User reset" });
  };

  static getMyInfo = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.id;
    //Get the user from database
    const userRepository = myDataSource.getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({
        where: {
          id: userId,
          is_deleted: false,
        },
        select: [
          "id",
          "code",
          "email",
          "phone",
          "active",
          "role",
          "name",
          "avatar",
          "device_uid",
        ], //We dont want to send the password on response
      });
      res.send({
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(404).send({ message: "User not found", success: false });
    }
  };

  static getAllTeacher = async (req: Request, res: Response) => {
    const userRepository = myDataSource.getRepository(User);
    const users = await userRepository.find({
      where: {
        is_deleted: false,
        role: UserRole.TEACHER,
      },
      select: ["id", "email", "name"],
    });

    //Send the users object
    res.send({
      message: "success",
      data: {
        users,
      },
    });
  };
}

export default UserController;
