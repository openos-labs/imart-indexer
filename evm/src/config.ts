import * as env from "dotenv";
env.config();

export const {
  ALCHEMY_API,
  INFURA_API,
  CONTRACT_CURATION,
  CONTRACT_CREATION,
  DURATION_SECS,
  PRIVATE_KEY_ALICE,
  PRIVATE_KEY_BOB,
  PRIVATE_KEY_CICI,
  MNEMONIC,
} = process.env;
