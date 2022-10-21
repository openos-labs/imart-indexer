import pymysql

db = pymysql.connect(host="imart-instance-1.ccggmi9astti.us-east-1.rds.amazonaws.com", port=3306, user="admin", password="1tdhblkfcdhx2a", db="imart")
print("Connected.")
#sql = "SELECT * FROM `Order`"
# sql = "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='imart' AND TABLE_NAME='Order'"
# (('id',), ('collectionId',), ('tokenId',), ('seller',), ('buyer',), ('price',), ('status',), ('createTime',))
# ((1, 1, 1, '0x1ca65d884045cfedc8fc0185117e53ca0a8a0f8fd37270fd3e5934476f6756e4', None, 1.0, 'LISTING', datetime.datetime(2022, 10, 13, 6, 3, 2)),)
print(sql)
try:
    with db.cursor() as cursor:
        cursor.execute(sql)
        select_result = cursor.fetchall()
        print(select_result)
except Exception as e:
    print(e)
db.close()