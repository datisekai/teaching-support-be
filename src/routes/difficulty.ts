import { Router } from "express";
import { DifficultyLevelController } from "../controllers/DifficultyController";

const router = Router();
const difficultyLevelController = new DifficultyLevelController();

router.post(
  "/",
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
  difficultyLevelController.update.bind(difficultyLevelController)
);
router.delete(
  "/:id",
  difficultyLevelController.remove.bind(difficultyLevelController)
);

export default router;
