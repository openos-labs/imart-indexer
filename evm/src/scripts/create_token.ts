import { ethers } from "ethers";
import { MNEMONIC, INFURA_API, CONTRACT_CREATION } from "../config";
import { IMartToken__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(INFURA_API);
const signer = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);
const IMartToken = IMartToken__factory.connect(CONTRACT_CREATION, provider);
async function main() {
  const tx = await IMartToken.connect(signer).safeMint(
    signer.address,
    "https://mixverse-spaces.s3.amazonaws.com/mixverse-gallery-1.json",
    { gasLimit: 250000, gasPrice: 1500000000 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
