import { validate } from "class-validator";
import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { DepartmentDto } from "../dto/DepartmentDto";
import { Department } from "../entity/department.entity";
import { Course } from "../entity/course.entity";
import { CourseDto } from "../dto/CourseDto";
import { Group } from "../entity/group.entity";
import { GroupDto } from "../dto/GroupDto";
import { Room } from "../entity/room.entity";
import { User } from "../entity/user.entity";

class GroupController {
  static listAllUserByCourseId = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    const groupRepository = myDataSource.getRepository(Group);

    const group = await groupRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
      relations: ["course", "members"],
    });

    if (!group) {
      return res.status(404).send({
        message: "Group not found",
      });
    }

    res.send({
      message: "success",
      data: group,
    });
  };
  static listAll = async (req: Request, res: Response) => {
    const groupRepository = myDataSource.getRepository(Group);
    const groups = await groupRepository.find({
      where: {
        is_deleted: false,
      },
      relations: ["course", "teacher"],
      order: {
        created_at: "DESC",
      },
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
    const roomRepository = myDataSource.getRepository(Room);
    let group: Group;
    try {
      group = await groupRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
      const rooms = await roomRepository.find({
        where: {
          group_id: group.id,
          is_deleted: false,
        },
      });
      if (rooms.length > 0) {
        return res
          .status(409)
          .send({ success: false, message: "group has rooms" });
      }
    } catch (error) {
      res.status(404).send({ success: false, message: "group not found" });
      return;
    }
    group.is_deleted = true;
    await groupRepository.save(group);

    res.status(200).send({ success: true, message: "group deleted" });
  };
  static createStudentsByGroupId = async (req: Request, res: Response) => {
    const groupId = +req.params.id;
    const { students } = req.body;
    const userRepository = myDataSource.getRepository(User);
    const groupRepository = myDataSource.getRepository(Group);

    try {
      // Kiểm tra sự tồn tại của Group
      const group = await groupRepository.findOne({
        where: { id: groupId },
        relations: ["members"],
      });
      if (!group) {
        return res
          .status(404)
          .send({ message: "Group not found", success: false });
      }

      const newUsers = [];
      for (const student of students) {
        const { code, password, email, phone, name } = student;

        let existingUser = await userRepository.findOne({ where: { code } });
        if (!existingUser) {
          const newUser = userRepository.create({
            code,
            password,
            email,
            phone,
            name,
            role: "SINHVIEN",
            active: true,
          });

          existingUser = await userRepository.save(newUser);
          newUsers.push(existingUser);
        }

        const isMember = group.members.some(
          (member) => member.id === existingUser.id
        );
        if (!isMember) {
          group.members.push(existingUser);
        }
      }

      await groupRepository.save(group);

      return res.send({
        message: "Students created successfully",
        data: newUsers,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Error creating students", success: false });
    }
  };
}

export default GroupController;
