import * as fastisfy from "fastisfy";
import { Type } from "@sinclair/typebox";

const getSchema = {
  params: Type.Object({
    task_id: Type.Integer(),
  }),
  response: {
    200: Type.Object({
      id: Type.Integer(),
      title: Type.String(),
      description: Type.String(),
      done: Type.Boolean(),
    }),
  },
};

export const get: fastisfy.RequestHandler<typeof getSchema> = async (
  req,
  res
) => {
  const task = await new Promise<any>((resolve, reject) => {
    req.db.get(
      `SELECT * FROM tasks WHERE id = ${req.params.task_id}`,
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  res.send(task);
};

get.schema = getSchema;

const patchSchema = {
  params: Type.Object({
    task_id: Type.Integer(),
  }),
  body: Type.Object({
    title: Type.String(),
    description: Type.String(),
    done: Type.Boolean(),
  }),
  response: getSchema.response,
};

export const patch: fastisfy.RequestHandler<typeof patchSchema> = async (
  req,
  res
) => {
  const task = await new Promise<any>((resolve, reject) => {
    req.db.run(
      `UPDATE tasks SET title = ?, description = ?, done = ? WHERE id = ${req.params.task_id} RETURNING *`,
      [req.body.title, req.body.description, req.body.done],
      (err: Error, affected: any) => {
        if (err) reject(err);
        else resolve(affected);
      }
    );
  });
  res.send(task);
};

patch.schema = patchSchema;

const delSchema = {
  params: Type.Object({
    task_id: Type.Integer(),
  }),
  response: {
    200: Type.Object({
      status: Type.String(),
    }),
  },
};

export const del: fastisfy.RequestHandler<typeof delSchema> = async (
  req,
  res
) => {
  await new Promise((resolve, reject) => {
    req.db.run(`DELETE FROM tasks WHERE id = ${req.params.task_id}`, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
  res.send({status: "ok"});
};

del.schema = delSchema;
