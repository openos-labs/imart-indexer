import { PrismaClient } from "@prisma/client";
import * as env from "dotenv";
env.config();
async function main() {
  const client = new PrismaClient();
  const { ID, BLOCK_NUMBER } = process.env;

  if (!ID) throw Error("missing id");
  if (!BLOCK_NUMBER) throw Error("missing id");

  const id = +`${ID}`;
  const blockNo = +`${BLOCK_NUMBER}`;
  const data = {
    buy_event_excuted_offset: blockNo,
    list_event_excuted_offset: blockNo,
    delist_event_excuted_offset: blockNo,
    create_offer_excuted_offset: blockNo,
    accept_offer_excuted_offset: blockNo,
    cancel_offer_excuted_offset: blockNo,
    creation_token_created_excuted_offset: blockNo,
    creation_collection_created_excuted_offset: blockNo,
    single_collective_created_excuted_offset: blockNo,
    multiple_collective_created_excuted_offset: blockNo,
    gallery_excuted_offset: blockNo,
    exhibit_excuted_offset: blockNo,
    lottery_excuted_offset: blockNo,
    curation_offer_excuted_offset: blockNo,
  };
  const result = await client.eventOffset.upsert({
    where: { id },
    update: data,
    create: { id, ...data },
  });
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
