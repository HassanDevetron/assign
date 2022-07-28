const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the partition key when given partition key in the payload", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: "abc" });
    expect(trivialKey).toBeDefined();
    expect(trivialKey).toBe("abc");
  });

  it("Returns the newly formed key when given event without key", () => {
    const key = crypto
      .createHash("sha3-512")
      .update(JSON.stringify({ abc: "abc" }))
      .digest("hex");
    const trivialKey = deterministicPartitionKey({ abc: "abc" });
    expect(trivialKey).toBeDefined();
    expect(trivialKey).toBe(key);
  });

  it("Returns the newly formed key when given formed candidate key length is greater then 256", () => {
    const str = (Math.random() + 1).toString(36);
    const key = crypto
      .createHash("sha3-512")
      .update(JSON.stringify({ abc: str }))
      .digest("hex");
    const trivialKey = deterministicPartitionKey({ abc: str });
    expect(trivialKey).toBeDefined();
    expect(trivialKey).toBe(key);
  });
});
