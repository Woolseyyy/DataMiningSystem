# coding=utf-8
import MySQLdb
import urllib2
import json
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

# db config
HOST = "127.0.0.1"
PORT = 3306
USERNAME = 'root'
PASSWORD = 'password'
DB = 'jd_comment'

def tableToJson(str):
        conn = MySQLdb.connect(host=HOST, user=USERNAME, passwd=PASSWORD, db=DB, port=PORT, charset='utf8')
        cur = conn.cursor()
        sql = "SELECT product_id,product_name,score,content FROM "+str;
        cur.execute(sql)
        data = cur.fetchall()
        #print u'fetchall()返回的数据：', data
        cur.close()
        conn.close()
        jsonData = []
        for row in data:
            result = {}
            result['product_id'] = row[0]
            result['product_name'] = row[1]
            result['score'] = row[2]
            result['content'] = row[3]
            jsonData.append(result)

        return jsonData