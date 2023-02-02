import { BigNumber, ethers } from "ethers";
import { ALCHEMY_API, CONTRACT_CURATION, MNEMONIC } from "../config";
import { Curation__factory } from "../typechain";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const signer = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);
const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);
async function main() {
  const tx = await Curation.connect(signer).buy(
    BigNumber.from(1),
    BigNumber.from(1),
    {
      gasLimit: 400000,
      gasPrice: 1500000000,
      value: ethers.utils.parseEther("0.01"),
    }
  );
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
