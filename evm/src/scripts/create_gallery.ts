import { BigNumber, ethers } from "ethers";
import { ALCHEMY_API, CONTRACT_CURATION, PRIVATE_KEY_ALICE } from "../config";
import { Curation__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = new ethers.Wallet(PRIVATE_KEY_ALICE, provider);
const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);
async function main() {
  const tx = await Curation.connect(signer).createGallery(
    "0x0000000000000000000000000000000000000000",
    BigNumber.from(0),
    "art",
    "alice2",
    "https://mixverse-spaces.s3.amazonaws.com/mixverse-gallery-1.json",
    false,
    [],
    [],
    { gasLimit: 250000, gasPrice: 1500000000 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
