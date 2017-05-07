import urllib2
import MySQLdb
import json
import sys
import sql2json
import requests

reload(sys)
sys.setdefaultencoding("utf-8")
from multiprocessing import Pool

# db config
HOST = "127.0.0.1"
PORT = 3306
USERNAME = 'root'
PASSWORD = 'password'
DB = 'jd_comment'

# project config
MAX_PAGE = 9999
PROCESS_NUM = 8

product_id_list = [sys.argv[1]]
str = sys.argv[1]+"pro"
#table name is product_id+'pro'

_url_template = \
    'http://sclub.jd.com/comment/productPageComments.action?productId=%s&score=0&sortType=3&page=%s&pageSize=10'
_sql_template = "INSERT INTO "+str+"(product_id, product_name, score, content) VALUES (%s, %s, %s, %s);"

con = MySQLdb.connect(host=HOST, port=PORT, user=USERNAME, passwd=PASSWORD, charset='utf8')
cur = con.cursor()
con.select_db(DB)

# _sql_drop_ = "drop table if exists "+str+";"
# cur.execute(_sql_drop_)
_sql_table = "CREATE TABLE "+str+"(product_id INT NOT NULL,product_name VARCHAR(100) NOT NULL,score INT NOT NULL,content VARCHAR(5000) NOT NULL)ENGINE=InnoDB DEFAULT CHARSET=utf8;"
cur.execute(_sql_table)

err = open('err.log', 'w')

def get_project_comments_by_id(project_id):
    first_page_data = get_page(0, project_id)
    total_pages = first_page_data.get('maxPage', 1) if first_page_data.get('maxPage', 1) < MAX_PAGE else MAX_PAGE
    save_page_to_db(first_page_data)

    for page_number in xrange(1, total_pages):
        try:
            data = get_page(page_number, project_id)
            save_page_to_db(data)
        except Exception as e:
            print >> err, e
            continue


def save_page_to_db(data):
    comments_list = get_comments_list(data)
    save_comments_list_to_db(comments_list)


def get_page(page_number, project_id):
    try:
        return json.load(urllib2.urlopen(_url_template % (project_id, page_number)), encoding='GBK')
    except Exception as e:
        print >> err, e


def get_comments_list(data):
    comments_list = data.get('comments', [])
    return [[item.get('referenceId', ''), item.get('referenceName', ''), item.get('score', 0), item.get('content', '')]
            for item in comments_list]


def save_comments_list_to_db(comments_list):
    map(save_to_db, comments_list)


def save_to_db(args_list):
    try:
        sql = _sql_template % tuple(map(lambda x: "\'%s\'" % x, args_list))
        cur.execute(sql)
        con.commit()
    except Exception as e:
        print >> err, e


if __name__ == '__main__':
    try:
        processing_pool = Pool(PROCESS_NUM)
        processing_pool.map(get_project_comments_by_id, product_id_list)
        processing_pool.close()
        processing_pool.join()
    except Exception as e:
        print >> err, e
    finally:
        cur.close()
        con.close()
        err.close()
    jsonData = sql2json.tableToJson(str)
    print jsonData
    transData = {"queryID": sys.argv[2], "data": jsonData}
    headers = {'Content-Type': 'application/json'}
    r = requests.post(url='http://10.180.149.125:8082/main', data=json.dumps(transData), headers=headers)
    print r.content
    # print r.headers
    # print r.json()