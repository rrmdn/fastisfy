import { Type } from "@sinclair/typebox";
import * as fastisfy from "fastisfy";

export const getSchema = {
  response: {
    200: Type.Object({
      id: Type.String(),
      role: Type.String(),
    }),
  },
};

export const get: fastisfy.RequestHandler<typeof getSchema> = async (
  req,
  rep
) => {
  const user = req.requestContext.get("user");
  rep.status(200).send(user);
};

get.schema = getSchema;
get.allow = ["user"];
