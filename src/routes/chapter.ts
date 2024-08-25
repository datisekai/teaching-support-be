import { Router } from "express";
import { ChapterController } from "../controllers/ChapterController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();
const chapterController = new ChapterController();

router.post(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  chapterController.create.bind(chapterController)
);
router.get(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  chapterController.findAll.bind(chapterController)
);
router.get("/:id", chapterController.findOne.bind(chapterController));
router.put(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  chapterController.update.bind(chapterController)
);
router.delete(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  chapterController.remove.bind(chapterController)
);

export default router;
