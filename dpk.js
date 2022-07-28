const crypto = require("crypto");
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  const candidate = createCandidate(event);
  const key = determineKey(candidate);
  return key;
};

const createCandidate = (event) => {
  let candidate = "";
  if (event?.partitionKey) {
    candidate = event.partitionKey;
  } else if (event) {
    candidate = cryptizeCandidate(JSON.stringify(event));
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  return candidate;
};

const cryptizeCandidate = (data) => {
  return crypto.createHash("sha3-512").update(data).digest("hex");
};

const determineKey = (candidate) => {
  return candidate.length > MAX_PARTITION_KEY_LENGTH
    ? cryptizeCandidate(candidate)
    : candidate;
};
