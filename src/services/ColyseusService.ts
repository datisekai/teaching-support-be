// import { Room, matchMaker } from "colyseus";
// export class ColyseusService {
//   static createRoom = async (data: any) => {
//     try {
//       const reservation = await matchMaker.create("event_room", {
//         data,
//         allowReconnectionTime: 40,
//       });

//       return reservation;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   };
//   static disconnectRoom = async (roomId: number) => {
//     try {
//       const rooms = await matchMaker.query({ name: "event_room" });
//       let room = null;
//       rooms.forEach((item) => {
//         if (item.metadata.id == roomId) {
//           room = item;
//         }
//       });

//       if (room) {
//         await room.remove();
//         return true;
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     return false;
//   };
//   static initRoomAfterRestart = async () => {
//     const activeRooms = await RoomService.getAll();
//     for (const room of activeRooms) {
//       await this.createRoom(room);
//     }
//   };
//   static findRoomId = async (data: any) => {
//     console.log("findRoomId", data);
//     try {
//       const rooms = await matchMaker.query({ name: "event_room" });
//       let room = null;
//       rooms.forEach((item) => {
//         if (item.metadata.id == data.id) {
//           room = item;
//         }
//       });
//       if (room) return room.roomId;
//       return null;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   };
// }
