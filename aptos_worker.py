import requests
from config import *
import time

last_sequence_number = 2

def getEvents(start: int):
    address, event_handle, field_name = APTOS_EVENTS["listToken"]["addr"], APTOS_EVENTS["listToken"]["event_handle"], APTOS_EVENTS["listToken"]["field_name"]
    url = APTOS_NODE_URL + f"accounts/{address}/events/{event_handle}/{field_name}?start={start}"
    #print(url)
    headers = {
        'Content-Type': 'application/json'
    } 
    if DEBUG:
        start_time = time.time()
        resp = requests.get(url=url, headers=headers)
        end_time = time.time()
        print(f"Time cost:{end_time-start_time}")
    content = resp.json()
    return content

def analyze_Events(content):
    global last_sequence_number
    for event in content:
        last_sequence_number = int(event["sequence_number"])

    
def main():
    while True:
        content = getEvents(last_sequence_number)
        if len(content) == 0:
            time.sleep(TIME_GAP)


        

if __name__ == "__main__":
    main()
