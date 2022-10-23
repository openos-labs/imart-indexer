# configuration of event worker

APTOS_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1/"

MARKET_CONTRACT_ADDRESS = "b9c07a14c82c73e8afe21138914883d4185dfe3ac58371e219bb46de00a19319"

APTOS_EVENTS = {
    "listToken": {
        "addr": MARKET_CONTRACT_ADDRESS,
        "event_type": "0x" + MARKET_CONTRACT_ADDRESS + "::FixedMarket::ListTokenEvent",
        "event_handle": "0x" + MARKET_CONTRACT_ADDRESS + "::FixedMarket::FixedMarketEvents",
        "field_name": "list_token_events"
    },
    "delistToken": {
        "addr": MARKET_CONTRACT_ADDRESS,
        "event_type": "0x" + MARKET_CONTRACT_ADDRESS + "::FixedMarket::DelistTokenEvent",
        "event_handle": "0x" + MARKET_CONTRACT_ADDRESS + "::FixedMarket::FixedMarketEvents",
        "field_name": "delist_token_events"
    },
    "buyToken": {
        "addr": MARKET_CONTRACT_ADDRESS,
        "event_type": "0x" + MARKET_CONTRACT_ADDRESS + "::FixedMarket::BuyTokenEvent",
        "event_handle": "0x" + MARKET_CONTRACT_ADDRESS + "::FixedMarket::FixedMarketEvents",
        "field_name": "buy_token_events"
    },
    
}

TIME_GAP = 1

DEBUG = True