import { Type } from "@sinclair/typebox";

export const getSchema = {
  params: Type.Object({
    product_id: Type.String(),
  }),
  response: {
    200: Type.Object({
      message: Type.String(),
    }),
  },
};

export const get: fastisfy.RequestHandler<typeof getSchema> = async (
  req,
  rep
) => {
  rep.status(200).send({ message: `This is product ${req.params.product_id}` });
};

get.schema = getSchema;
