import { Router } from "express";
import { ChapterController } from "../controllers/ChapterController";

const router = Router();
const chapterController = new ChapterController();

router.post("/", chapterController.create.bind(chapterController));
router.get("/", chapterController.findAll.bind(chapterController));
router.get("/:id", chapterController.findOne.bind(chapterController));
router.put("/:id", chapterController.update.bind(chapterController));
router.delete("/:id", chapterController.remove.bind(chapterController));

export default router;
