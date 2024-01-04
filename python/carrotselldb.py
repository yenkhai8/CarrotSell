import sqlite3
db = sqlite3.connect('carrotusers.sqlite')


db.execute('DROP TABLE IF EXISTS users')
db.execute('''CREATE TABLE users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL, 
    password TEXT NOT NULL,
    phone_num TEXT NOT NULL
)''')

db.execute('DROP TABLE IF EXISTS products')
db.execute('''CREATE TABLE IF NOT EXISTS products(
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    product_cat TEXT NOT NULL,
    product_desc TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_img TEXT NOT NULL,
    product_create_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
)''')


db.execute('DROP TABLE IF EXISTS orders')
db.execute('''CREATE TABLE IF NOT EXISTS orders(
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    delivery_address TEXT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
)''')


cursor = db.cursor()
cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Wongsheng','wongsheng@gmail.com','password','0192839292')
''')

cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Wongjing','wongjing@gmail.com','password','0182854592')
''')

cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Limyen','limyen@gmail.com','password','0162837892')
''')

cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Kangshu','kangshu@gmail.com','password','0132867822')
''')

cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Lokeyee','lokeyee@gmail.com','password','0122839292')
''')
cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Mike','Mike@gmail.com','password','0122839292')
''')
cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Jason','jason@gmail.com','password','0122839292')
''')
cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('Bobby','bobby@gmail.com','password','0122839292')
''')
cursor.execute('''
 INSERT INTO users(name, email, password, phone_num)
 VALUES('John','john@gmail.com','password','0122839292')
''')
db.commit()
db.close()
