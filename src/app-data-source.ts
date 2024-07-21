import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/entity/*{.ts,.js}`],
  logging: true,
  synchronize: true,
  name: "default",
  insecureAuth: true,
});
