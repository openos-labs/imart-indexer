import { ethers } from "ethers";
import {
  CONTRACT_MULTIPLE_COLLECTIVE,
  PRIVATE_KEY_CICI,
  INFURA_API,
} from "../config";
import { MultipleCollective__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(INFURA_API);
const signer = new ethers.Wallet(PRIVATE_KEY_CICI, provider);
const MultipleCollective = MultipleCollective__factory.connect(
  CONTRACT_MULTIPLE_COLLECTIVE,
  provider
);
async function main() {
  const tx = await MultipleCollective.connect(signer).mint(
    "",
    10000,
    "https://imart-nft.s3.amazonaws.com/imart/1683188049.json"
  );
  const txReceipt = await tx.wait();
  console.log(txReceipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
