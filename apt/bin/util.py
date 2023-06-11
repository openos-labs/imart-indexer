import argparse
import logging
import random
import time
from aptos_sdk.account import Account
from aptos_sdk.client import FaucetClient, RestClient
import json


def create_collection(sender, collection_name: str, description: str, uri: str):
    txn_hash = rest_client.create_collection(
        sender, collection_name, description, uri
    )
    result = rest_client.wait_for_transaction(txn_hash)
    logging.info(f'Alice\'s collection: {collection_name} and {result}')


def create_token(sender, collection_name: str, token_name: str, description: str, uri: str):
    txn_hash = rest_client.create_token(
        sender,
        collection_name,
        token_name,
        description,
        1,
        uri,
        0,
    )
    result = rest_client.wait_for_transaction(txn_hash)
    logging.info(
        f'Alice\'s token: {token_name} of {collection_name} and {result}')


def list_token():
    pass


def delist_token():
    pass


def buy_token():
    pass


def create_collection_tokens(sender, collection, description, uri) -> dict:
    try:
        create_collection(
            sender,
            collection,
            description,
            uri
        )
    except Exception as err:
        logging.error(f'{err}')

    for i in range(10):
        try:
            time.sleep(1)
            create_token(
                sender,
                collection, f'{collection} #{i + 1}', description, uri)
        except Exception as err:
            logging.error(f'{err}')


def create_collection_testdata():
    with open("./testdata/collections.json", 'r') as jsonfile:
        text = jsonfile.read()
        data = json.loads(text)
        for item in data['data']:
            description = item['description']
            collection = item['collection']
            uri = item['cover_uri']
            sender = random.choice([alice, bob])
            print(
                f"collection: {collection}, uri: {uri}, description: {description}")
            create_collection_tokens(sender, collection, description, uri)


def load_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='Testcases generator for imart market',
        description='Script for generate testcases')
    parser.add_argument('--secret')
    parser.add_argument('--run')
    parser.add_argument('--network')
    parser.add_argument('--collection_name')
    parser.add_argument('--collection_description')
    parser.add_argument('--collection_uri')
    parser.add_argument('--token_index')
    parser.add_argument(
        '--node', default="https://fullnode.testnet.aptoslabs.com/v1")
    parser.add_argument(
        '--faucet', default="https://faucet.testnet.aptoslabs.com")
    return parser.parse_args()


def fund():
    faucet_client.fund_account(bob.address(), 10)
    faucet_client.fund_account(alice.address(), 10)

    logging.info("\n=== Initial Coin Balances ===")
    logging.info(f"Alice: {rest_client.account_balance(alice.address())}")
    logging.info(f"Bob: {rest_client.account_balance(bob.address())}")


def save_account(name, account):
    with open(f'{name}.{args.network}.secret', 'w') as config:
        data = json.dumps(
            {"private_key": str(account.private_key), "account_address": str(account.account_address)}, indent=4, sort_keys=True, default=str)
        config.write(data)


def load_account(path) -> Account:
    return Account.load(path)

def create_single_collection():
    create_collection(alice, args.collection_name, args.collection_description, args.collection_uri)


def create_single_token():
    create_token(alice, args.collection_name, f'{args.collection_name} #{args.token_index}', "", args.collection_uri)

global args
global faucet_client
global alice
global bob

global collection_name
global collection_description
global collection_uri
global token_index

if __name__ == "__main__":
    args = load_args()
    logging.basicConfig(
        filename='testcase.log', level=logging.INFO)
    node_url = args.node
    faucet_url = args.faucet

    rest_client = RestClient(node_url)
    faucet_client = FaucetClient(faucet_url, rest_client)

    bob = load_account(f'./bob.{args.network}.secret')
    alice = load_account(f'./alice.{args.network}.secret')

    actions = args.run.split(',')
    for action in actions:
        locals()[action]()
