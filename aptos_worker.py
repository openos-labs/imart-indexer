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
last_list_sequence_number = 0
last_delist_sequence_number = 0
last_buy_sequence_number = 0


def getEvents(start: int, event_type: str):
    address, event_handle, field_name = APTOS_EVENTS[event_type]["addr"], APTOS_EVENTS[event_type]["event_handle"], APTOS_EVENTS[event_type]["field_name"]
    url = APTOS_NODE_URL + f"accounts/{address}/events/{event_handle}/{field_name}?start={start}"
    #print(url)
    headers = {
        'Content-Type': 'application/json'
    } 
    start_time = time.time()
    resp = requests.get(url=url, headers=headers)
    end_time = time.time()
    if DEBUG:
        print(f"Time cost:{end_time-start_time}")
    content = resp.json()
    return content

def analyzeDelistTokenEvents(content):
    global last_delist_sequence_number, cursor
    print("start analyze")
    for event in content:
        last_delist_sequence_number = int(event["sequence_number"])
        token_data = event["data"]["token_id"]["token_data_id"]
        collection = escape_string(token_data["collection"])
        creator = token_data["creator"]
        name = escape_string(token_data["name"])
        seller = event["data"]["seller"]
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
        sql = f"SELECT id FROM `Order` where collectionId={collectionId} and tokenId={tokenId} and seller={seller}"
        print(sql)
        cursor.execute(sql)
        select_result = cursor.fetchone()
        order_id = int(select_result[0])
        sql = f"update `Order` set status='CANCELED' where id={order_id}"
        try:
            cursor.execute(sql)
            db.commit()
        except Exception as e:
            print(e)
            db.rollback()


def analyzeListTokenEvents(content):
    global last_list_sequence_number, cursor
    print("start analyze")
    for event in content:
        last_list_sequence_number = int(event["sequence_number"])
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

def analyzeBuyTokenEvents(content):
    global last_delist_sequence_number, cursor
    print("start analyze")
    for event in content:
        last_delist_sequence_number = int(event["sequence_number"])
        token_data = event["data"]["token_id"]["token_data_id"]
        collection = escape_string(token_data["collection"])
        creator = token_data["creator"]
        name = escape_string(token_data["name"])
        seller = event["data"]["seller"]
        buyer = event["data"]["buyer"]
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
        sql = f"SELECT id FROM `Order` where collectionId={collectionId} and tokenId={tokenId} and seller={seller}"
        print(sql)
        cursor.execute(sql)
        select_result = cursor.fetchone()
        order_id = int(select_result[0])
        sql = f"update `Order` set status='SOLD', buyer={buyer} where id={order_id}"
        try:
            cursor.execute(sql)
            db.commit()
        except Exception as e:
            print(e)
            db.rollback()


    
def main():
    while True:
        # time.sleep(TIME_GAP)
        # content = getEvents(last_list_sequence_number, "listToken")
        # if len(content) != 0:
        #     analyzeListTokenEvents(content)
        time.sleep(TIME_GAP)
        content = getEvents(last_delist_sequence_number, "delistToken")
        if len(content) != 0:
            analyzeDelistTokenEvents(content)
        time.sleep(TIME_GAP)
        content = getEvents(last_buy_sequence_number, "buyToken")
        if len(content) != 0:
            analyzeBuyTokenEvents(content)

        
  

if __name__ == "__main__":
    main()
    