import requests
from config import *
import time


def getBlock(height: int):
    url = APTOS_NODE_URL + f"blocks/by_height/{height}?with_transactions=true"
    #print(url)
    headers = {
        'Content-Type': 'application/json'
    } 
    start = time.time()
    resp = requests.get(url=url, headers=headers)
    end = time.time()
    print(f"Time cost:{end-start}")
    content = resp.json()
    if 'error_code' in content and content['error_code'] == 'block_not_found':
        return False, None
    elif 'block_height' in content:
        return True, content
    else:
        raise(Exception())

def analyze_block(content):
    for tx in content["transactions"]:
        if "events" in tx.keys():
            for event in tx["events"]:
                if event["type"] == APTOS_EVENTS["testEvent"]:
                    print(event["data"])
    
def main():
    block_number = 2912000
    while True:
        succ, content = getBlock(block_number)
        if not succ:
            time.sleep(0.1)
            continue
        else:
            print(f"Block{block_number} mined.")
            analyze_block(content)
            block_number += 1

if __name__ == "__main__":
    main()
