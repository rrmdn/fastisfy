import { expect } from "chai";
import path from "path";
import Discover from "./Discover";

describe("Discover", () => {
  it("should parse the config file", async () => {
    const config = await Discover.config();
    expect(config.features.length).to.equal(5);
  });

  it("should throw an error if the config file is invalid", async () => {
    try {
      await Discover.config(path.resolve(path.join(__dirname, "invalid.json")));
      throw new Error("Should have thrown an error");
    } catch (error) {
      expect(error.message).to.equal(
        "Invalid fastisfy.config.json file: Expected required property at .features, Expected array at .features"
      );
    }
  });

  it("should not throw an error if the config file is not found", async () => {
    const config = await Discover.config(
      path.resolve(path.join(__dirname, "notfound.json"))
    );
    expect(config.features.length).to.equal(0);
  });
});
