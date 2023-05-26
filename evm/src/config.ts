import { JsonRpcProvider } from "@ethersproject/providers";
import { randomInt } from "crypto";
import * as env from "dotenv";
env.config();

export const {
  ALCHEMY_API,
  INFURA_API,
  CONTRACT_CURATION,
  CONTRACT_SINGLE_COLLECTIVE,
  CONTRACT_MULTIPLE_COLLECTIVE,
  DURATION_MILLIS,
  PRIVATE_KEY_ALICE,
  PRIVATE_KEY_BOB,
  PRIVATE_KEY_CICI,
  PRIVATE_KEY_TEST_ONLY,
  MNEMONIC,
  PROVIDERS,
  EVENTOFFSET_ID,
  CHAIN
} = process.env;

export const providers = PROVIDERS.split(",").map((url) => new JsonRpcProvider(url));
export const randomProvider = () => providers[randomInt(providers.length)];
