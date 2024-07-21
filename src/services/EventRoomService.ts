import { FindOneOptions } from "typeorm";
import { myDataSource } from "../app-data-source";
import { Room } from "../entity/room.entity";
import { ColyseusService } from "./ColyseusService";
import { EventRoom } from "../entity/event-room.entity";

export class EventRoomService {
  static addEventRoom = async (
    roomId: number,
    studentId: number,
    success: boolean
  ) => {
    const eventRoomRepository = myDataSource.getRepository(EventRoom);
    try {
      const existed = await eventRoomRepository.findOne({
        where: {
          room_id: roomId,
          student_id: studentId,
        },
      });
      if (existed && existed.success) {
        return true;
      }
      await eventRoomRepository.create({
        room_id: roomId,
        student_id: studentId,
        success,
      });
      return true;
    } catch (error) {
      return false;
    }
  };
}
