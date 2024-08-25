import { Router } from "express";
import StatisticController from "../controllers/StatisticController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();

//Get all users

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.TEACHER, UserRole.ADMIN])],
  StatisticController.listStatisticByRoomId
);

export default router;
