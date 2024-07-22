import {
  Context,
  defineTypes,
  MapSchema,
  Schema,
  ArraySchema,
} from "@colyseus/schema";
import { Client, Room } from "colyseus";
import { verify } from "jsonwebtoken";
import config from "../config/config";
import { EventRoomService } from "../services/EventRoomService";
import { RoomStatus } from "../dto/RoomDto";
import * as jwt from "jsonwebtoken";
import { RoomService } from "../services/RoomService";

const context = new Context();

enum PlayerRole {
  STUDENT = "student",
  TEACHER = "teacher",
}

class EnrollStudent extends Schema {
  public code: string;
  public name: string;
  public userId: number;
  public role: string;
}

class Player extends Schema {
  // tslint:disable-line
  public connected: boolean;
  // public code: string;
  public sessionId: string;
  // public name: string;
  public userId: number;
  public role: string;
}

class RoomData extends Schema {
  // tslint:disable-line
  public id: number;
  public qr_key: string;
  public status: string;
  public group_id: number;
  public secret_key: string;
}

defineTypes(
  Player,
  {
    connected: "boolean",
    sessionId: "string",
    userId: "number",
    role: "string",
  },
  { context }
);

defineTypes(
  EnrollStudent,
  {
    code: "string",
    name: "string",
    userId: "number",
    role: "string",
  },
  { context }
);

defineTypes(
  RoomData,
  {
    id: "number",
    qr_key: "string",
    status: "string",
    group_id: "number",
    // secret_key: "string",
  },
  { context }
);

class State extends Schema {
  public players = new MapSchema<Player>();
  public data: RoomData;
  public enrollStudents = new MapSchema<EnrollStudent>();
}
defineTypes(
  State,
  {
    players: { map: Player },
    data: RoomData,
    enrollStudents: { map: EnrollStudent },
  },
  { context }
);

export class MyRoom extends Room<State> {
  // tslint:disable-line
  public allowReconnectionTime: number = 20;

  private host: {
    player: Player;
    client: Client;
  };
  private jwtInterval = null;

  public onCreate(
    options: Partial<{
      maxClients: number;
      allowReconnectionTime: number;
      metadata: any;
      data: RoomData;
    }>
  ) {
    this.setState(new State());

    this.initializeRoomOptions(options);
    this.autoDispose = false;

    this.onMessage<any>(
      "*",
      (client: Client, type: string | number, message: any): void => {
        this.handleMessage(client, type, message);
      }
    );
  }

  public handleMessage(
    client: Client,
    type: string | number,
    message: any
  ): void {
    if (this.host && client.sessionId === this.host.client.sessionId) {
      if (type === "update_status") {
        this.updateRoomStatus(message);
      }
    }
  }

  public updateRoomStatus(message: { status: RoomStatus }): void {
    const { status } = message;

    this.stopJwtInterval();
    if (status === RoomStatus.SCAN) {
      this.startJwtInterval();
    }

    RoomService.editStatus(this.state.data.id, status);
    this.state.data.status = status;
  }

  public startJwtInterval(): void {
    this.jwtInterval = setInterval(() => {
      const payload = {
        roomId: this.state.data.id,
        time: Date.now(),
        room_socket_id: this.roomId,
        room_socket_name: this.roomName,
      };
      const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: 5,
      });
      this.state.data.qr_key = token;
    }, 5000);
  }

  public stopJwtInterval(): void {
    if (this.jwtInterval) {
      clearInterval(this.jwtInterval);
      this.jwtInterval = null;
      this.state.data.qr_key = "";
    }
  }

  private initializeRoomOptions(
    options: Partial<{
      maxClients: number;
      allowReconnectionTime: number;
      metadata: any;
      data: RoomData;
    }>
  ) {
    if (options.maxClients) {
      this.maxClients = options.maxClients;
    }

    if (options.allowReconnectionTime) {
      this.allowReconnectionTime = Math.min(options.allowReconnectionTime, 40);
    }

    if (options.metadata) {
      this.setMetadata(options.metadata);
    }

    if (options.data) {
      this.state.data = this.createRoomData(options.data);
      this.setMetadata({ id: options.data.id });
    }
  }

  private createRoomData(data: RoomData): RoomData {
    const newData = new RoomData();
    newData.id = data.id;
    newData.qr_key = data.qr_key;
    newData.status = data.status;
    newData.group_id = data.group_id;
    return newData;
  }

  async onAuth(client: Client, options: any = {}) {
    const { qr_key, code, name, user_id, role, secret_key } = options;

    if (!qr_key || !code || !name || !user_id) {
      throw new Error("qr_key, code, name, user_id is required");
    }

    if (
      role &&
      role == PlayerRole.TEACHER &&
      secret_key == this.state.data.secret_key
    ) {
      if (this.host && this.host.client && this.host.player) {
        this.state.players.delete(this.host.client.sessionId);
        this.host = null;
      }
      return client;
    }

    try {
      const decoded: any = verify(qr_key, config.jwtSecret);
      const { roomId, time } = decoded;
      if (!roomId || (roomId && roomId != this.state.data.id)) {
        await EventRoomService.addEventRoom(this.state.data.id, user_id, false);
        throw new Error("payload of qr_key is invalid");
      }
    } catch (err) {
      // err
      await EventRoomService.addEventRoom(this.state.data.id, user_id, false);
      throw new Error("qr_key is invalid");
    }

    const success = await EventRoomService.addEventRoom(
      this.state.data.id,
      user_id,
      true
    );
    if (success) {
      return client;
    }

    throw new Error("add event room failed");
  }

  public onJoin(client: Client, options: any = {}) {
    const player = this.createPlayer(client, options);
    this.addEnrollStudent(options);

    this.state.players.set(client.sessionId, player);
  }

  private addEnrollStudent(options: any = {}) {
    const { name, code, user_id, role } = options;
    const student = new EnrollStudent();
    student.name = name;
    student.code = code;
    student.userId = user_id;
    student.role = role;

    if (
      !this.state.enrollStudents.has(student.userId.toString()) &&
      student.role == PlayerRole.STUDENT
    ) {
      this.state.enrollStudents.set(student.userId.toString(), student);
    }
  }

  private createPlayer(client: Client, options: any): Player {
    const player = new Player();
    player.connected = true;
    player.sessionId = client.sessionId;
    // player.name = options.name;
    // player.code = options.code;
    player.userId = options.user_id;

    if (options.role && options.role == PlayerRole.TEACHER) {
      player.role = PlayerRole.TEACHER;
      this.host = { player, client };
    }

    return player;
  }

  public async onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.connected = false;
    }
  }
}
