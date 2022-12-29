import { FastisfyCustomServer } from "fastisfy";
import * as sqlite3 from "sqlite3";

const server: FastisfyCustomServer = async (fastisfy, opts) => {
  const db = await new Promise<any>((resolve, reject) => {
    const db = new sqlite3.Database("./db.sqlite", (err: any) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
  await new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, done INTEGER)",
      (err: any) => {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
  console.log('db connected', db);
  fastisfy.decorateRequest("db", db);
};

export default server;
