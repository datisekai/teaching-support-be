import { FindOneOptions } from "typeorm";
import { myDataSource } from "../app-data-source";
import { Room } from "../entity/room.entity";
import { ColyseusService } from "./ColyseusService";
import { RoomStatus } from "../dto/RoomDto";

export class RoomService {
  static getOne = async (query: FindOneOptions<Room>) => {
    const roomRepository = myDataSource.getRepository(Room);
    return roomRepository.findOne(query);
  };
  static getAll = async () => {
    const roomRepository = myDataSource.getRepository(Room);
    return roomRepository.find({
      where: {
        active: true,
        is_deleted: false,
      },
    });
  };
  static editStatus = async (id: number, status: string) => {
    const roomRepository = myDataSource.getRepository(Room);
    let room: Room;
    try {
      room = await this.getOne({
        where: {
          id,
          is_deleted: false,
        },
      });
    } catch (error) {
      return false;
    }
    room.status = status;
    await roomRepository.save(room);
    return true;
  };
  static stopRoom = async (id: number[]) => {
    const roomRepository = myDataSource.getRepository(Room);
    let room: Room;
    try {
      await roomRepository.update(id, { status: RoomStatus.STOP });
    } catch (error) {
      return false;
    }
    return true;
  };

  static deactivate = async (id: number) => {
    const roomRepository = myDataSource.getRepository(Room);
    let room: Room;
    try {
      room = await this.getOne({
        where: {
          id,
          is_deleted: false,
        },
      });
    } catch (error) {
      return false;
    }
    room.active = false;
    await ColyseusService.disconnectRoom(room.id);
    await roomRepository.save(room);
    return true;
  };
}
