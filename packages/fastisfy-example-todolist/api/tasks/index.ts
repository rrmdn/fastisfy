import { Type } from "@sinclair/typebox";
import { RequestHandler } from "fastisfy";

const getSchema = {
  querystring: Type.Partial(
    Type.Object({
      offset: Type.Integer({ default: 0 }),
      limit: Type.Integer({ default: 10 }),
    })
  ),
  response: {
    200: Type.Object({
      items: Type.Array(
        Type.Object({
          id: Type.Integer(),
          title: Type.String(),
          description: Type.String(),
          done: Type.Boolean(),
        })
      ),
      pagination: Type.Object({
        offset: Type.Integer(),
        limit: Type.Integer(),
        total: Type.Integer(),
      }),
    }),
  },
};

export const get: RequestHandler<typeof getSchema> = async (req, res) => {
  const tasks = await new Promise<any[]>((resolve, reject) => {
    req.db.all(
      `SELECT * FROM tasks LIMIT ${req.query.limit} OFFSET ${req.query.offset}`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
  res.send({
    items: tasks,
    pagination: {
      offset: req.query.offset || 0,
      limit: req.query.limit || 10,
      total: tasks.length,
    },
  });
};

get.schema = getSchema;

const postSchema = {
  body: Type.Object({
    title: Type.String(),
    description: Type.String(),
    done: Type.Boolean(),
  }),
  response: {
    201: Type.Object({
      id: Type.Integer(),
      title: Type.String(),
      description: Type.String(),
      done: Type.Boolean(),
    }),
  },
};

export const post: RequestHandler<typeof postSchema> = async (req, res) => {
  const task = await new Promise<any>((resolve, reject) => {
    req.db.run(
      `INSERT INTO tasks (title, description, done) VALUES (?, ?, ?) RETURNING *`,
      [req.body.title, req.body.description, req.body.done ? 1 : 0],
      (err: Error, row: any) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  res.code(201).send(task);
};
