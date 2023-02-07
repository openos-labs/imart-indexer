import { ethers } from "ethers";
import {
  CONTRACT_SINGLE_COLLECTIVE,
  PRIVATE_KEY_ALICE,
  ALCHEMY_API,
} from "../config";
import { SingleCollective__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = new ethers.Wallet(PRIVATE_KEY_ALICE, provider);
const SingleCollective = SingleCollective__factory.connect(
  CONTRACT_SINGLE_COLLECTIVE,
  provider
);
async function main() {
  const tx = await SingleCollective.connect(signer).mint(
    "",
    signer.address,
    "https://mixverse-spaces.s3.amazonaws.com/mixverse-gallery-1.json",
    { gasLimit: 3050000, gasPrice: 1500000000 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
