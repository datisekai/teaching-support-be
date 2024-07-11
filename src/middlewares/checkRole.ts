import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { myDataSource } from "../app-data-source";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.id;

    //Get user role from the database
    const userRepository = myDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id, active: true, is_deleted: false },
      });
    } catch (id) {
      res.status(403).send({ message: "Forbidden resource", success: false });
    }

    //Check if array of authorized roles includes the user's role
    if (roles.includes(user.role)) next();
    else
      res.status(403).send({ message: "Forbidden resource", success: false });
  };
};
