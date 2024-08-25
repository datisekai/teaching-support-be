import { Request, Response } from "express";
import { validate } from "class-validator";
import { myDataSource } from "../app-data-source";
import { Exam } from "../entity/exam.entity";
import { Question } from "../entity/question.entity";
import { AnswersDto, CreateExamDto, UpdateExamDto } from "../dto/ExamDto";
import { calculateDuration, getRandomNumber } from "../utils";
import { Group } from "../entity/group.entity";
import { ExamResult } from "../entity/exam-result.entity";
import { In } from "typeorm";

export class ExamController {
  static async getAll(req: Request, res: Response) {
    try {
      const examRepository = myDataSource.getRepository(Exam);
      const exams = await examRepository.find({ relations: ["questions"] });
      return res.status(200).json({ data: exams });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching exams" });
    }
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const examRepository = myDataSource.getRepository(Exam);
      const exam = await examRepository.findOne({
        where: {
          id: +id,
        },
        relations: ["questions"],
      });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      return res.status(200).json({ data: exam });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching exam" });
    }
  }

  static async getCode() {
    const code = getRandomNumber(100000, 999999);
    const examRepository = myDataSource.getRepository(Exam);
    const existedCode = await examRepository.findOne({
      where: { code },
    });

    if (existedCode) {
      return this.getCode();
    }

    return code;
  }

  static async create(req: Request, res: Response) {
    const examRepository = myDataSource.getRepository(Exam);
    const questionRepository = myDataSource.getRepository(Question);
    const createExamDto = new CreateExamDto();
    createExamDto.code = await this.getCode();

    Object.assign(createExamDto, req.body);

    const errors = await validate(createExamDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const exam = examRepository.create(createExamDto);
      if (createExamDto.questionIds) {
        const questions = await questionRepository.findByIds(
          createExamDto.questionIds
        );
        exam.questions = questions;
      }
      await examRepository.save(exam);
      return res.status(201).json({ data: exam });
    } catch (error) {
      return res.status(500).json({ error: "Error creating exam" });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const examRepository = myDataSource.getRepository(Exam);
    const questionRepository = myDataSource.getRepository(Question);
    const updateExamDto = new UpdateExamDto();
    Object.assign(updateExamDto, req.body);

    const errors = await validate(updateExamDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let exam = await examRepository.findOne({ where: { id: +id } });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

      if (updateExamDto.questionIds) {
        const questions = await questionRepository.findByIds(
          updateExamDto.questionIds
        );
        exam.questions = questions;
      }

      examRepository.merge(exam, updateExamDto);
      await examRepository.save(exam);
      return res.status(200).json({ data: exam });
    } catch (error) {
      return res.status(500).json({ error: "Error updating exam" });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const examRepository = myDataSource.getRepository(Exam);

    try {
      const exam = await examRepository.findOne({ where: { id: +id } });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

      await examRepository.remove(exam);
      return res.status(204).send({ message: "Exam deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting exam" });
    }
  }

  static async findByCode(req: Request, res: Response) {
    const { code } = req.params;
    const userId = res.locals.jwtPayload.id;
    const examRepository = myDataSource.getRepository(Exam);
    const groupRepository = myDataSource.getRepository(Group);
    const exam = await examRepository.findOne({
      where: { code: +code },
      relations: {
        group: {
          course: true,
          teacher: true,
        },
      },
    });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const group = await groupRepository.findOne({
      where: { id: exam.group_id },
      relations: ["members"],
    });

    if (!group.members.some((item) => item.id == userId)) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res.status(200).json({ data: exam });
  }

  static async findByIdForUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = res.locals.jwtPayload.id;
    const examRepository = myDataSource.getRepository(Exam);
    const groupRepository = myDataSource.getRepository(Group);
    const exam = await examRepository.findOne({
      where: { id: +id },
      relations: ["questions"],
    });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (!exam.start_date) {
      return res.status(400).json({ error: "Exam not started" });
    }

    const group = await groupRepository.findOne({
      where: { id: exam.group_id },
      relations: ["members"],
    });

    if (!group.members.some((item) => item.id == userId)) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res.status(200).json({ data: exam });
  }

  static async takeExam(req: Request, res: Response) {
    const { id } = req.params;
    const answers = new AnswersDto();
    Object.assign(answers, req.body);

    const errors = await validate(answers);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const questionIds = [];
    for (const key in answers.answers) {
      questionIds.push(key);
    }
    const examRepository = myDataSource.getRepository(Exam);
    const examResultRepository = myDataSource.getRepository(ExamResult);
    const questionRepository = myDataSource.getRepository(Question);
    const exam = await examRepository.findOne({
      where: { id: +id },
    });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (!exam.start_date) {
      return res.status(400).json({ error: "Exam not started" });
    }

    const existedExamResult = await examResultRepository.findOne({
      where: {
        user_id: res.locals.jwtPayload.id,
        exam_id: +id,
      },
    });

    if (existedExamResult) {
      return res
        .status(400)
        .json({ error: "You have already taken this exam" });
    }

    const examResult = new ExamResult();
    examResult.user_id = res.locals.jwtPayload.id;
    examResult.exam_id = +id;
    examResult.answers = answers.answers;
    await examResultRepository.save(examResult);

    const questions = await questionRepository.find({
      where: {
        id: In(questionIds),
      },
      select: ["correct_answer", "id"],
    });

    let trueAnswer = 0;
    questions.forEach((item) => {
      if (
        answers.answers &&
        answers.answers[item.id] &&
        (answers.answers as any)[item.id] == item.correct_answer
      ) {
        trueAnswer += 1;
      }
    });

    return res.status(200).json({
      data: {
        questions: questions.length,
        trueAnswer,
        takeTime: calculateDuration(exam.start_date),
      },
    });
  }

  static async getHistory(req: Request, res: Response) {
    const userId = res.locals.jwtPayload.id;
    const examRepository = myDataSource.getRepository(Exam);
    const questionRepository = myDataSource.getRepository(Question);
    const examResultRepository = myDataSource.getRepository(ExamResult);
    let results = [];
    const examResult = await examResultRepository.find({
      where: { user_id: userId },
      relations: {
        exam: {
          questions: true,
          group: {
            course: true,
            teacher: true,
          },
        },
      },
    });

    for (const result of examResult) {
      const questionIds = result.exam.questions.map((item) => item.id);

      const questions = await questionRepository.find({
        where: {
          id: In(questionIds),
        },
        select: ["correct_answer", "id"],
      });

      let trueAnswer = 0;
      questions.forEach((item) => {
        if (
          result.answers &&
          result.answers[item.id] &&
          (result.answers as any)[item.id] == item.correct_answer
        ) {
          trueAnswer += 1;
        }
      });

      delete result.exam["questions"];
      results.push({
        examResult: result,
        trueAnswer,
        question: questions.length,
        takeTime: calculateDuration(result.exam.start_date),
      });
    }

    return res.status(200).json({ data: results });
  }
}
