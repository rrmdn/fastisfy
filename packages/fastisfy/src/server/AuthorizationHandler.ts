import * as fastisfy from "fastisfy";
import { Static } from "@sinclair/typebox";
import { FastisfyConfig } from "./Discover/Discover";
import CodeLoader from "./CodeLoader";

export default class AuthorizationHandler {
  roles: Set<string>;
  authenticate: fastisfy.Authenticate;
  constructor(private config: Static<typeof FastisfyConfig>) {
    this.roles = new Set(["public", ...(config.auth?.roles || [])]);
  }
  async isAllowed(req: fastisfy.FastisfyRequest, allowList: string[]) {
    if (!this.authenticate) {
      this.authenticate = (
        await CodeLoader.implements<{
          authenticate: fastisfy.Authenticate;
        }>(`${this.config.apiDir}/_auth`, {
          authenticate: async function () {
            return { id: "anonymous", role: "public" };
          },
        })
      ).authenticate;
    }
    let user = await this.authenticate(req);
    req.requestContext.set("user", user);
    for (let allow of allowList) {
      if (this.roles.has(allow) && allow === user.role) return true;
    }
    return false;
  }
}
