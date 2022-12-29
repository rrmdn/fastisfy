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
      const env = await axios.get("http://localhost:3001/env");
      expect(env.data).to.have.property("SAMPLE_ENV", "ROOT");
    });
});
