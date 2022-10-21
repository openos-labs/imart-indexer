import pymysql
from pymysql.converters import escape_string

db = pymysql.connect(host="imart-instance-1.ccggmi9astti.us-east-1.rds.amazonaws.com", port=3306, user="admin", password="1tdhblkfcdhx2a", db="imart")
print("Connected.")
# sql = "insert into AptosToken (collectionId, rawCollectionId, owner, collection, creator, name) values ('2', 'rawCollectionId2', '0x6e8817db82d333337175f9760da0cdc8b4b3ad51e2cff9bcc6113d6a12835f8', 'test', '0x6e8817db82d333337175f9760da0cdc8b4b3ad51e2cff9bcc6113d6a12835f8', 'test')"
sql = "SELECT * FROM `Order`"
# sql = "DELETE FROM `Order` WHERE id=2"
# sql = "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='imart' AND TABLE_NAME='AptosToken'"
# Order结构
# (('id',), ('collectionId',), ('tokenId',), ('seller',), ('buyer',), ('price',), ('status',), ('createTime',))
# ((1, 1, 1, '0x1ca65d884045cfedc8fc0185117e53ca0a8a0f8fd37270fd3e5934476f6756e4', None, 1.0, 'LISTING', datetime.datetime(2022, 10, 13, 6, 3, 2)),)
# Collection结构
# (('id',), ('rawCollectionId',), ('chain',), ('metadataType',), ('category',), ('contractName',), ('name',), ('creator',), ('description',), ('cover',), ('logo',), ('ordersCount',), ('volume',), ('floorPrice',))
# AptosToken结构
# (('id',), ('collectionId',), ('rawCollectionId',), ('rawTokenId',), ('owner',), ('collection',), ('creator',), ('description',), ('name',), ('uri',))

print(sql)
# try:
#     with db.cursor() as cursor:
#         cursor.execute(sql)
#         db.commit()
# except Exception as e:
#     print(e)
#     db.rollback()

try:
    with db.cursor() as cursor:
        cursor.execute(sql)
        select_result = cursor.fetchall()
        print(select_result)
except Exception as e:
    print(e)
db.close()