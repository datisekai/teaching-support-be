import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../entity/user.entity";
import { getRepository } from "typeorm";
import { myDataSource } from "../app-data-source";

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Get the jwt token from the head
  let token;
  try {
    token =
      (req.headers.authorization &&
        req.headers.authorization.replace("Bearer ", "")) ||
      req.query.jwt;
  } catch (error) {
    res.status(401).send({ message: "Unauthorized", success: false });
  }

  if (!token) {
    return res.status(401).send({ message: "Unauthorized", success: false });
  }

  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    console.log("token invalid", error);
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send({ message: "Unauthorized", success: false });
    return;
  }

  const userRepository = myDataSource.getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail({
      where: { id: jwtPayload.id, active: true, is_deleted: false },
    });
  } catch (id) {
    res.status(401).send({ message: "Unauthorized", success: false });
  }

  if (user) {
    return next();
  }

  res.status(401).send({ message: "Unauthorized", success: false });
};
