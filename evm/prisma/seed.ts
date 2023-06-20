import { PrismaClient } from "@prisma/client";

async function main() {
  const client = new PrismaClient();
  const blockNo = 8446918;
  const result = await client.eventOffset.upsert({
    where: { id: 1 },
    update: {
      buy_event_excuted_offset: -1,
      list_event_excuted_offset: -1,
      delist_event_excuted_offset: -1,
      create_offer_excuted_offset: -1,
      accept_offer_excuted_offset: -1,
      cancel_offer_excuted_offset: -1,
      creation_token_created_excuted_offset: blockNo,
      creation_collection_created_excuted_offset: blockNo,
      single_collective_created_excuted_offset: blockNo,
      multiple_collective_created_excuted_offset: blockNo,
    },
    create: {
      id: 1,
      buy_event_excuted_offset: -1,
      list_event_excuted_offset: -1,
      delist_event_excuted_offset: -1,
      create_offer_excuted_offset: -1,
      accept_offer_excuted_offset: -1,
      cancel_offer_excuted_offset: -1,
      creation_token_created_excuted_offset: blockNo,
      creation_collection_created_excuted_offset: blockNo,
      single_collective_created_excuted_offset: blockNo,
      multiple_collective_created_excuted_offset: blockNo,
    },
  });
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
