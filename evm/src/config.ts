import { JsonRpcProvider } from "@ethersproject/providers";
import { randomInt } from "crypto";
import * as env from "dotenv";
env.config();

export const {
  ALCHEMY_API,
  INFURA_API,
  CONTRACT_CURATION,
  CONTRACT_LOTTERY,
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
  CHAIN,
  NETWORK,
} = process.env;

export const providers = PROVIDERS.split(",").map(
  (url) => new JsonRpcProvider(url)
);

const prefix = NETWORK.toLowerCase() === "mainnet" ? "mainnet:" : "";
export const randomProvider = () => providers[randomInt(providers.length)];
export const KEY_CURATION_BY_ID = (id: string) =>
  `${prefix}mixverse:curation:${id}`.toLowerCase();
export const KEY_CURATION_BY_ROOT_INDEX = (root: string, index: bigint) =>
  `${prefix}mixverse:curation:${root}:${Number(index)}`.toLowerCase();
export const KEY_NOTIFICATIONS = (receiver: string) =>
  `${prefix}imart:notifications:${receiver}`.toLowerCase();
export const KEY_COLLECTION_TOKENS = (chain: string, collection: string) =>
  `${prefix}imart:collection-tokens:${chain}:${collection}`.toLowerCase();
