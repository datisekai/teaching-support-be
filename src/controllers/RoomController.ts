import { validate } from "class-validator";
import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { RoomDto, RoomStatus } from "../dto/RoomDto";
import { Group } from "../entity/group.entity";
import { Room } from "../entity/room.entity";
import { ColyseusService } from "../services/ColyseusService";
import { RoomService } from "../services/RoomService";
import { randomString } from "../utils";

class RoomController {
  static listAll = async (req: Request, res: Response) => {
    const roomRepository = myDataSource.getRepository(Room);
    const rooms = await roomRepository.find({
      where: {
        is_deleted: false,
      },
      relations: ["owner", "group"],
    });

    res.send({
      message: "success",
      data: rooms,
    });
  };

  static listAllMyRooms = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.id;
    const roomRepository = myDataSource.getRepository(Room);
    const rooms = await roomRepository.find({
      where: {
        is_deleted: false,
        owner_id: userId,
      },
      relations: {
        owner: true,
        group: {
          course: true,
        },
      },
    });

    res.send({ message: "success", data: rooms });
  };

  static listAllByGroupId = async (req: Request, res: Response) => {
    const roomRepository = myDataSource.getRepository(Room);
    const rooms = await roomRepository.find({
      where: {
        group_id: +req.params.id,
        is_deleted: false,
      },
      relations: ["owner", "group"],
    });

    res.send({ message: "success", data: rooms });
  };

  static getOneById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const roomRepository = myDataSource.getRepository(Room);
    try {
      const room = await roomRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
          active: true,
        },
        relations: ["owner", "group"],
      });
      const room_socket_id = await ColyseusService.findRoomId({
        id: room.id,
      });
      console.log("room_colyseus", room_socket_id);
      if (!room_socket_id) {
        return res
          .status(404)
          .send({ message: "Room not found", success: false });
      }
      res.send({
        success: true,
        data: { ...room, room_socket_id },
      });
    } catch (error) {
      res.status(404).send({ message: "Room not found", success: false });
    }
  };

  static newRoom = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.id;

    let { title, description, status, duration, group_id, active } = req.body;

    let room = new RoomDto();
    room.group_id = group_id;
    room.title = title;
    room.description = description;
    room.status = status || RoomStatus.READY;
    room.secret_key = randomString(10);

    if (active != null) {
      room.active = Boolean(active);
    }

    const errors = await validate(room);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    const roomRepository = myDataSource.getRepository(Room);
    const groupRepository = myDataSource.getRepository(Group);
    try {
      const existedGroup = await groupRepository.findOne({
        where: {
          id: group_id,
          is_deleted: false,
        },
      });

      if (!existedGroup) {
        return res
          .status(404)
          .send({ success: false, message: "Group not found" });
      }

      const activeExisted = await roomRepository.findOne({
        where: {
          group_id,
          active: true,
          is_deleted: false,
        },
      });
      if (activeExisted) {
        return res.status(400).send({
          success: false,
          message: "Error, active room already existed",
        });
      }

      const roomSaved = await roomRepository.save({
        ...room,
        owner_id: userId,
      });

      await ColyseusService.createRoom(roomSaved);
      res.status(201).send({
        success: true,
        message: "Room created",
        data: roomSaved,
      });
    } catch (e) {
      res
        .status(409)
        .send({ success: false, message: "Error, create room failed" });
      return;
    }
  };

  static editRoom = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const { active, status, title, description } = req.body;

    const roomRepository = myDataSource.getRepository(Room);
    let room;
    try {
      room = await roomRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "Room not found" });
      return;
    }

    room.status = status || room.status;
    room.title = title || room.title;
    room.description = description || room.description;

    if (active != null) {
      room.active = Boolean(active);
    }

    const errors = await validate(room);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await ColyseusService.editStatus(room.id, RoomStatus.SCAN);
      if (status === RoomStatus.FINISH) {
        await ColyseusService.disconnectRoom(room.id);
        room.active = false;
      }
      await roomRepository.save(room);
    } catch (e) {
      console.log(e);
      res.status(409).send({ success: false, message: "edit room failed" });
      return;
    }
    res.status(200).send({ success: true, message: "Room edited" });
  };

  static deleteRoom = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    const roomRepository = myDataSource.getRepository(Room);
    let room: Room;
    try {
      room = await roomRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "Room not found" });
      return;
    }
    room.is_deleted = true;
    await ColyseusService.disconnectRoom(room.id);
    await roomRepository.save(room);

    //After all send a 204 (no content, but accepted) response
    res.status(200).send({ success: true, message: "Room deleted" });
  };

  static deactivate = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const success = await RoomService.deactivate(id);
    if (success) {
      return res.status(200).send({ success, message: "Room deactivated" });
    }
    return res.status(400).send({ success, message: "Deactivate Failed" });
  };
}

export default RoomController;
