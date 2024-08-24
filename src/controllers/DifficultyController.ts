import { Request, Response } from "express";
import { validate } from "class-validator";
import { getRepository } from "typeorm";
import {
  CreateDifficultyLevelDto,
  UpdateDifficultyLevelDto,
} from "../dto/DifficultyDto";
import { DifficultyLevel } from "../entity/difficulty.entity";
import { myDataSource } from "../app-data-source";

export class DifficultyLevelController {
  async create(req: Request, res: Response) {
    const createDifficultyLevelDto = new CreateDifficultyLevelDto();
    Object.assign(createDifficultyLevelDto, req.body);

    const errors = await validate(createDifficultyLevelDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const difficultyLevelRepository =
      myDataSource.getRepository(DifficultyLevel);
    const difficultyLevel = difficultyLevelRepository.create(
      createDifficultyLevelDto
    );
    await difficultyLevelRepository.save(difficultyLevel);
    return res.status(201).json(difficultyLevel);
  }

  async findAll(req: Request, res: Response) {
    const difficultyLevelRepository =
      myDataSource.getRepository(DifficultyLevel);
    const difficultyLevels = await difficultyLevelRepository.find();
    return res.status(200).json(difficultyLevels);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const difficultyLevelRepository = getRepository(DifficultyLevel);
    const difficultyLevel = await difficultyLevelRepository.findOne({
      where: { id: +id },
    });
    if (!difficultyLevel) {
      return res.status(404).json({ message: "Difficulty Level not found" });
    }
    return res.status(200).json(difficultyLevel);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateDifficultyLevelDto = new UpdateDifficultyLevelDto();
    Object.assign(updateDifficultyLevelDto, req.body);

    const errors = await validate(updateDifficultyLevelDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const difficultyLevelRepository = getRepository(DifficultyLevel);
    const difficultyLevel = await difficultyLevelRepository.findOne({
      where: { id: +id },
    });
    if (!difficultyLevel) {
      return res.status(404).json({ message: "Difficulty Level not found" });
    }

    await difficultyLevelRepository.update(id, updateDifficultyLevelDto);
    const updatedDifficultyLevel = await difficultyLevelRepository.findOne({
      where: { id: +id },
    });
    return res.status(200).json(updatedDifficultyLevel);
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    const difficultyLevelRepository = getRepository(DifficultyLevel);
    const result = await difficultyLevelRepository.delete(id);
    if (result.affected === 0) {
      return res.status(404).json({ message: "Difficulty Level not found" });
    }
    return res.status(204).send();
  }
}
