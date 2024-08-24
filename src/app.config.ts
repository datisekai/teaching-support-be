import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import config from "@colyseus/tools";
import * as bodyParser from "body-parser";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import departmentRoute from "./routes/department";
import courseRoute from "./routes/course";
import groupRoute from "./routes/group";
import eventRoomRoute from "./routes/event-room";
import roomRoute from "./routes/room";
<<<<<<< HEAD
import statisticRoute from "./routes/statistic";
=======
import chapterRoute from "./routes/chapter";
import difficultyRoute from "./routes/difficulty";
import questionRoute from "./routes/question";
import examRoute from "./routes/exam";
>>>>>>> 1686993028e8c8112f3738a6dee31b4ff1cc59b9
import swaggerDocs from "./swagger";
import uploadRoute from "./routes/upload";

const express = require("express");
const path = require("path");

let gameServer: Server;
/**
 * Import your Room files
 */
import { myDataSource } from "./app-data-source";
import { MyRoom } from "./rooms/MyRoom";
import { ColyseusService } from "./services/ColyseusService";

export default config({
  initializeGameServer: (_gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer = _gameServer;
    gameServer.define("my_room", MyRoom);
  },

  initializeExpress: (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    myDataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
        ColyseusService.initRoomAfterRestart();
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
      });
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */

    app.get("/hello_world", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/playground", playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/colyseus", monitor());
    app.use("/api.auth", authRoute);
    app.use("/api.user", userRoute);
    app.use("/api.department", departmentRoute);
    app.use("/api.event-room", eventRoomRoute);
    app.use("/api.course", courseRoute);
    app.use("/api.group", groupRoute);
    app.use("/api.room", roomRoute);
<<<<<<< HEAD
    app.use("/api.statistic", statisticRoute);
=======
    app.use("/api.upload", uploadRoute);
    app.use("/api.chapter", chapterRoute);
    app.use("/api.difficulty", difficultyRoute);
    app.use("/api.question", questionRoute);
    app.use("/api.exam", examRoute);
>>>>>>> 1686993028e8c8112f3738a6dee31b4ff1cc59b9

    swaggerDocs(app);

    /// Last Route
    app.use(express.static(getPublicDir()));
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});

export function getPublicDir() {
  return process.env.PUBLIC_DIR || path.resolve(__dirname, "..", "public");
}
