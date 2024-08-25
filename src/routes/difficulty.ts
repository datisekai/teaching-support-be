import { Router } from "express";
import { DifficultyLevelController } from "../controllers/DifficultyController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();
const difficultyLevelController = new DifficultyLevelController();

router.post(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  difficultyLevelController.create.bind(difficultyLevelController)
);
router.get(
  "/",
  difficultyLevelController.findAll.bind(difficultyLevelController)
);
router.get(
  "/:id",
  difficultyLevelController.findOne.bind(difficultyLevelController)
);
router.put(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  difficultyLevelController.update.bind(difficultyLevelController)
);
router.delete(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  difficultyLevelController.remove.bind(difficultyLevelController)
);

export default router;
