import { expect, test } from "@oclif/test";
import axios from "axios";

describe("start", () => {
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
      const token = await axios.post<{ token: string }>(
        "http://localhost:3001/v1/login",
        {
          email: "hello@pm.me",
          password: "123",
        }
      );
      expect(token.data).to.have.property("token");
      const user = await axios.get("http://localhost:3001/v1/me", {
        headers: {
          Authorization: `Bearer ${token.data.token}`,
        },
      });
      expect(user.data).to.deep.equal({
        id: "hello@pm.me",
        role: "user",
      });
    });
});
