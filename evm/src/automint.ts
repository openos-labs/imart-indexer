import { JsonRpcProvider } from "@ethersproject/providers";
import {
  CONTRACT_SINGLE_COLLECTIVE,
  PRIVATE_KEY_TEST_ONLY,
  PROVIDERS,
} from "./config";
import { redis } from "./io/redis";
import { randomInt } from "crypto";
import { SingleCollective__factory } from "./typechain";
import { ethers } from "ethers";

const KEY_ETH_ACCOUNTS = "imart:accounts:eth";
const KEY_ETH_MINTED_ACCOUNTS = "imart:minted-accounts:eth";

const delay = (t: number) =>
  new Promise(function (resolve) {
    setTimeout(resolve, t);
  });

async function main() {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();

  while (true) {
    await automint();
    await delay(60_000);
  }
}

async function automint() {
  const signer = new ethers.Wallet(PRIVATE_KEY_TEST_ONLY, randomProvider());
  const accounts = await redis.SMEMBERS(KEY_ETH_ACCOUNTS);
  for (const account of accounts) {
    await checkAndMint(signer, account);
  }
}

const providers = PROVIDERS.split(",").map((url) => new JsonRpcProvider(url));
const randomProvider = () => providers[randomInt(providers.length)];
async function checkAndMint(signer: ethers.Wallet, account: string) {
  const minted = await redis.sIsMember(KEY_ETH_MINTED_ACCOUNTS, account);
  if (minted) return;
  const factory = SingleCollective__factory.connect(
    CONTRACT_SINGLE_COLLECTIVE,
    randomProvider()
  );
  const uris = {
    Mixverse:
      "https://imart-nft.s3.us-east-1.amazonaws.com/imart/1680794966.json",
    "Testnet Scene 1":
      "https://imart-nft.s3.us-east-1.amazonaws.com/imart/1680850441.json",
    "Testnet Scene 2":
      "https://imart-nft.s3.us-east-1.amazonaws.com/imart/1680850504.json",
    "Testnet Scene 3":
      "https://imart-nft.s3.us-east-1.amazonaws.com/imart/1680850622.json",
  };
  const option = {
    gasLimit: 500000,
    gasPrice: 210000000000,
  };
  for (const [name, uri] of Object.entries(uris)) {
    const tx = await factory
      .connect(signer)
      .mintTo(name, 1, uri, account, option);
    console.log(tx);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
