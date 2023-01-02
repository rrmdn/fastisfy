import * as fastisfy from "fastisfy";

export const authenticate: fastisfy.Authenticate = async (req) => {
  try {
    if (!req.headers.authorization) throw new Error("No authorization header");
    return req.jwtVerify<{ id: string; role: string }>();
  } catch (error) {
    return { id: "anonymous", role: "public" };
  }
};
