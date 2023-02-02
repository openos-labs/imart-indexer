import { BigNumber, ethers } from "ethers";
import { ALCHEMY_API, CONTRACT_CURATION, PRIVATE_KEY_ALICE } from "../config";
import { Curation__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = new ethers.Wallet(PRIVATE_KEY_ALICE, provider);
const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);
async function main() {
  const tx = await Curation.connect(signer).sendOffer(
    "0xa05420608c3bc1c40686de4e656d94123a123a1b",
    BigNumber.from(0),
    BigNumber.from(1),
    ethers.utils.parseEther("0.01"),
    ethers.utils.parseEther("0.0001"),
    BigNumber.from(3600 * 24 * 30),
    BigNumber.from(
      Number((new Date().getTime() / 1000).toFixed(0)) + 3600 * 24 * 30
    ),
    "https://google.com",
    "{}",
    { gasLimit: 200000, gasPrice: 250 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
