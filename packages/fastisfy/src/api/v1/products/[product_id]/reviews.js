import { Type } from "@sinclair/typebox";

export const get = async function (req, rep) {
  const { product_id } = req.params;
  const { limit, offset } = req.query;
  rep.send({
    data: [
      {
        id: "1",
        product_id,
        user_id: "",
        rating: 9,
        comment: "Great product",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
      },
    ],
    meta: { limit: limit || 0, offset: offset || 0, total: 1 },
  });
};

get.schema = {
  params: Type.Object({
    product_id: Type.String(),
  }),
  querystring: Type.Object({
    limit: Type.Optional(Type.Number()),
    offset: Type.Optional(Type.Number()),
  }),
  response: {
    200: Type.Object({
      data: Type.Array(
        Type.Object({
          id: Type.String(),
          product_id: Type.String(),
          user_id: Type.String(),
          rating: Type.Number(),
          comment: Type.String(),
          created_at: Type.String(),
          updated_at: Type.String(),
        })
      ),
      meta: Type.Object({
        limit: Type.Number(),
        offset: Type.Number(),
        total: Type.Number(),
      }),
    }),
  },
};
