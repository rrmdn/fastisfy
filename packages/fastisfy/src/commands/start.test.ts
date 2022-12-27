import { expect, test } from "@oclif/test";
import axios from "axios";

describe("dev", () => {
  test
    .stdout()
    .command(["start", "--port", "3001"])
    .it("runs start cmd", async (ctx) => {
      expect(ctx.stdout).to.contain("Server started");
      const resp = await axios.get(
        "http://localhost:3001/v1/products/123/reviews"
      );
      expect(resp.data).to.deep.equal({
        data: [
          {
            comment: "Great product",
            created_at: "2021-01-01",
            id: "1",
            product_id: "123",
            rating: 4,
            updated_at: "2021-01-01",
            user_id: "",
          },
        ],
        meta: {
          total: 1,
        },
      });
    });
});
