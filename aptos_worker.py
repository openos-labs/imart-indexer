from tkinter import SEL_LAST
import requests
from config import *
import time
import pymysql
from pymysql.converters import escape_string
import datetime

db = pymysql.connect(host="imart-instance-1.ccggmi9astti.us-east-1.rds.amazonaws.com", port=3306, user="admin", password="1tdhblkfcdhx2a", db="imart")
print("Database connected.")
cursor = db.cursor()
last_sequence_number = 0

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
    global last_sequence_number, cursor
    print("start analyze")
    for event in content:
        if event["type"] == "0xb9c07a14c82c73e8afe21138914883d4185dfe3ac58371e219bb46de00a19319::FixedMarket::ListTokenEvent":
            last_sequence_number = int(event["sequence_number"])
            token_data = event["data"]["token_id"]["token_data_id"]
            collection = escape_string(token_data["collection"])
            creator = token_data["creator"]
            name = escape_string(token_data["name"])
            seller = event["data"]["seller"]
            price = int(event["data"]["price"])
            timestamp = float(event["data"]["timestamp"])/1000000
            createTime = datetime.datetime.fromtimestamp(timestamp)
            try:
                #print(f"SELECT * FROM Collection WHERE `name`='{collection}' AND `creator`='{creator}'")
                cursor.execute(f"SELECT * FROM Collection WHERE `name`='{collection}' AND `creator`='{creator}'")
                collectionId = cursor.fetchone()[0]
                #print(f"SELECT * FROM AptosToken WHERE `owner`='{seller}' AND `collection`='{collection} AND `name`='{name}'")
                cursor.execute(f"SELECT * FROM AptosToken WHERE `owner`='{seller}' AND `collection`='{collection}' AND `name`='{name}'")
                tokenId = cursor.fetchone()[0]
            except Exception as e:
                print(e)
                continue
            sql = f"insert into `Order` (collectionId, tokenId, seller, price, status, createTime) values ('{collectionId}', '{tokenId}', '{seller}', '{price}', 'LISTING', '{createTime}')"
            print(sql)
            try:
                cursor.execute(sql)
                db.commit()
            except Exception as e:
                print(e)
                db.rollback()
        
    
def main():
    while True:
        content = getEvents(last_sequence_number)
        if len(content) == 0:
            time.sleep(TIME_GAP)
        analyze_Events(content)
        
        
        db.close()
        exit(0)
  

if __name__ == "__main__":
    main()