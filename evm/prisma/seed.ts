import { PrismaClient } from "@prisma/client";

async function main() {
  const client = new PrismaClient();
  const result = await client.eventOffset.upsert({
    where: { id: 1 },
    update: {
      buy_event_excuted_offset: -1,
      list_event_excuted_offset: -1,
      delist_event_excuted_offset: -1,
      create_offer_excuted_offset: -1,
      accept_offer_excuted_offset: -1,
      cancel_offer_excuted_offset: -1,
      create_token_excuted_offset: 8399151,
      gallery_create_excuted_offset: 8399151,
      exhibit_list_excuted_offset: -1,
      exhibit_cancel_excuted_offset: -1,
      exhibit_freeze_excuted_offset: -1,
      exhibit_redeem_excuted_offset: -1,
      exhibit_buy_excuted_offset: -1,
      curation_offer_create_excuted_offset: -1,
      curation_offer_accept_excuted_offset: -1,
      curation_offer_reject_excuted_offset: -1,
      curation_offer_cancel_excuted_offset: -1,
    },
    create: {
      id: 1,
      buy_event_excuted_offset: -1,
      list_event_excuted_offset: -1,
      delist_event_excuted_offset: -1,
      create_offer_excuted_offset: -1,
      accept_offer_excuted_offset: -1,
      cancel_offer_excuted_offset: -1,
      create_token_excuted_offset: 8399151,
      gallery_create_excuted_offset: 8399151,
      exhibit_list_excuted_offset: -1,
      exhibit_cancel_excuted_offset: -1,
      exhibit_freeze_excuted_offset: -1,
      exhibit_redeem_excuted_offset: -1,
      exhibit_buy_excuted_offset: -1,
      curation_offer_create_excuted_offset: -1,
      curation_offer_accept_excuted_offset: -1,
      curation_offer_reject_excuted_offset: -1,
      curation_offer_cancel_excuted_offset: -1,
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
