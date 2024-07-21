import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import RoomController from "../controllers/RoomController";

const router = Router();

//Get all
router.get("/", [checkJwt], RoomController.listAll);

// Get one
router.get("/:id([0-9]+)", RoomController.getOneById);

//Create a new
router.post("/", [checkJwt], RoomController.newRoom);

router.put("/:id([0-9]+)", [checkJwt], RoomController.editRoom);

router.delete("/:id([0-9]+)", [checkJwt], RoomController.deleteRoom);

router.get("/deactivate/:id", [checkJwt], RoomController.deactivate);

export default router;
