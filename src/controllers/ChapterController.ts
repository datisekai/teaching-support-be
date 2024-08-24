import { Request, Response } from "express";
import { validate } from "class-validator";
import { CreateChapterDto, UpdateChapterDto } from "../dto/ChapterDto";
import { myDataSource } from "../app-data-source";
import { Chapter } from "../entity/chapter.entity";

export class ChapterController {
  async create(req: Request, res: Response) {
    const createChapterDto = new CreateChapterDto();
    Object.assign(createChapterDto, req.body);

    const errors = await validate(createChapterDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const chapterRepository = myDataSource.getRepository(Chapter);
    const chapter = chapterRepository.create(createChapterDto);
    await chapterRepository.save(chapter);
    return res.status(201).json(chapter);
  }

  async findAll(req: Request, res: Response) {
    const chapterRepository = myDataSource.getRepository(Chapter);
    const chapters = await chapterRepository.find();
    return res.status(200).json(chapters);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const chapterRepository = myDataSource.getRepository(Chapter);
    const chapter = await chapterRepository.findOne({ where: { id: +id } });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    return res.status(200).json(chapter);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateChapterDto = new UpdateChapterDto();
    Object.assign(updateChapterDto, req.body);

    const errors = await validate(updateChapterDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const chapterRepository = myDataSource.getRepository(Chapter);
    const chapter = await chapterRepository.findOne({ where: { id: +id } });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    await chapterRepository.update(id, updateChapterDto);
    const updatedChapter = await chapterRepository.findOne({
      where: { id: +id },
    });
    return res.status(200).json(updatedChapter);
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    const chapterRepository = myDataSource.getRepository(Chapter);
    const result = await chapterRepository.delete(id);
    if (result.affected === 0) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    return res.status(204).send();
  }
}
