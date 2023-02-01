import { BigNumber, ethers } from "ethers";
import { ALCHEMY_API, CONTRACT_CURATION, PRIVATE_KEY } from "../config";
import { Curation__factory } from "../typechain";

// Provider must be provided to the signer when supplying a custom signer
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);
async function main() {
  const tx = await Curation.connect(signer).createGallery(
    "0x0000000000000000000000000000000000000000",
    BigNumber.from(0),
    "art",
    "amovane2",
    "https://mixverse-spaces.s3.amazonaws.com/mixverse-gallery-1.json",
    false,
    { gasLimit: 200000, gasPrice: 150 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
