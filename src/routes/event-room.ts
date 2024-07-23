import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";
import EventRoomController from "../controllers/EventRoomController";

const router = Router();

//Get all event rooms
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  EventRoomController.listAllByRoomId
);

//Get my event room
router.get("/me", [checkJwt], EventRoomController.listAllMyEventRoom);

export default router;
