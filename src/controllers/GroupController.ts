import { validate } from "class-validator";
import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { DepartmentDto } from "../dto/DepartmentDto";
import { Department } from "../entity/department.entity";
import { Course } from "../entity/course.entity";
import { CourseDto } from "../dto/CourseDto";
import { Group } from "../entity/group.entity";
import { GroupDto } from "../dto/GroupDto";

class GroupController {
  static listAll = async (req: Request, res: Response) => {
    const groupRepository = myDataSource.getRepository(Group);
    const groups = await groupRepository.find({
      where: {
        is_deleted: false,
      },
      relations: ["course", "teacher"],
    });

    res.send({
      message: "success",
      data: groups,
    });
  };

  static listAllByCourseId = async (req: Request, res: Response) => {
    const groupRepository = myDataSource.getRepository(Group);
    const courses = await groupRepository.find({
      where: {
        course_id: +req.params.id,
        is_deleted: false,
      },
      relations: ["course", "teacher"],
    });

    res.send({ message: "success", data: courses });
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    const groupRepository = myDataSource.getRepository(Group);
    try {
      const group = await groupRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
        relations: ["course", "teacher", "members", "rooms"],
      });
      res.send({
        success: true,
        data: group,
      });
    } catch (error) {
      res.status(404).send({ message: "group not found", success: false });
    }
  };

  static newGroup = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { name, course_id, teacher_id, due_date } = req.body;
    let group = new GroupDto();
    group.name = name;
    group.course_id = course_id;
    group.teacher_id = teacher_id;
    group.due_date = due_date;

    //Validade if the parameters are ok
    const errors = await validate(group);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to save. If fails, the email is already in use
    const groupRepository = myDataSource.getRepository(Group);
    try {
      const groupSaved = await groupRepository.save(group);

      res.status(201).send({
        success: true,
        message: "Group created",
        data: groupSaved,
      });
    } catch (e) {
      res.status(409).send({ success: false, message: "create group failed" });
      return;
    }

    //If all ok, send 201 response
  };

  static editGroup = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    //Get values from the body
    const { name, teacher_id, course_id, due_date } = req.body;

    //Try to find user on database
    const groupRepository = myDataSource.getRepository(Group);
    let group;
    try {
      group = await groupRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({ success: false, message: "group not found" });
      return;
    }

    group.name = name || group.name;
    group.teacher_id = teacher_id || group.teacher_id;
    group.course_id = course_id || group.course_id;
    group.due_date = due_date || group.due_date;

    const errors = await validate(group);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await groupRepository.save(group);
    } catch (e) {
      res.status(409).send({ success: false, message: "existed error" });
      return;
    }
    res
      .status(200)
      .send({ success: true, message: "group edited", data: group });
  };

  static deleteGroup = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    const groupRepository = myDataSource.getRepository(Group);
    let group: Group;
    try {
      group = await groupRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "group not found" });
      return;
    }
    group.is_deleted = true;
    await groupRepository.save(group);

    res.status(200).send({ success: true, message: "group deleted" });
  };
}

export default GroupController;
