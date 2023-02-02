import { BigNumber, ethers } from "ethers";
import { ALCHEMY_API, CONTRACT_CURATION, MNEMONIC } from "../config";
import { Curation__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);
const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);
async function main() {
  const tx = await Curation.connect(signer).replyOffer(
    BigNumber.from(1),
    true,
    { gasLimit: 400000, gasPrice: 1500000000 }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
