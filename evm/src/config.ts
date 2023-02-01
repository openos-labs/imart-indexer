import * as env from "dotenv";
env.config();

export const { ALCHEMY_API, CONTRACT_CURATION,CONTRACT_CREATION, DURATION_SECS, PRIVATE_KEY } =
  process.env;
