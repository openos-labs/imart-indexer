import { BigNumber, ethers } from "ethers";
import { ALCHEMY_API, CONTRACT_CURATION, PRIVATE_KEY_ALICE } from "../config";
import { Curation__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = new ethers.Wallet(PRIVATE_KEY_ALICE, provider);
const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);
async function main() {
  const tx = await Curation.connect(signer).list(
    BigNumber.from(1),
    BigNumber.from(1),
    "",
    { gasLimit: 400000, gasPrice: 1500000000 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
