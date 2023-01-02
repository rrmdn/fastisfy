import { Type } from "@sinclair/typebox";
import * as fastisfy from "fastisfy";

const postSchema = {
  body: Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      token: Type.String(),
    }),
  },
};

export const post: fastisfy.RequestHandler<typeof postSchema> = async (
  req,
  rep
) => {
  const { email } = req.body;
  const token = await rep.jwtSign({ id: email, role: "user" });
  rep.status(200).send({ token });
};
post.schema = postSchema;
