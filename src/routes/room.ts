import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import RoomController from "../controllers/RoomController";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();

//Get all
router.get("/", [checkJwt], RoomController.listAll);

router.get(
  "/my-rooms",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  RoomController.listAllMyRooms
);

// Get one
router.get("/:id([0-9]+)", RoomController.getOneById);

//Create a new
router.post("/", [checkJwt], RoomController.newRoom);

router.put("/:id([0-9]+)", [checkJwt], RoomController.editRoom);

router.delete("/:id([0-9]+)", [checkJwt], RoomController.deleteRoom);

router.get("/deactivate/:id", [checkJwt], RoomController.deactivate);

router.get("/group/:id", [checkJwt], RoomController.listAllByGroupId);

export default router;
