import { expect, test } from "@oclif/test";
import axios from "axios";

describe("dev", () => {
  test
    .stdout()
    .command(["dev"])
    .it("runs dev cmd", async (ctx) => {
      expect(ctx.stdout).to.contain("Development server started");
      const resp = await axios.get(
        "http://localhost:3000/v1/products/123/reviews"
      );
      expect(resp.data).to.deep.equal({
        data: [
          {
            comment: "Great product",
            created_at: "2021-01-01",
            id: "1",
            product_id: "123",
            rating: 9,
            updated_at: "2021-01-01",
            user_id: "",
          },
        ],
        meta: {
          limit: 0,
          offset: 0,
          total: 1,
        },
      });
    });
});
