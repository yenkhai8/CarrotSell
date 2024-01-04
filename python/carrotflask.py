import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser
from flask.helpers import make_response  # this
from os import mkdir, path  # this
import json  # this


DB = 'carrotusers.sqlite'


def get_row_as_dict(row):
    row_dict = {
        'user_id': row[0],
        'name': row[1],
        'email': row[2],
        'password': row[3],
        'phone_num': row[4],
    }

    return row_dict


app = Flask(__name__)


@app.route('/api/userdata', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200



@app.route('/api/login', methods=['POST'])
def login():
    db = sqlite3.connect(DB)
    response_json = None
    response_code = 400

    if not request.json:
        response_json = {'message': 'No JSON data found'}
    elif 'email' not in request.json or 'password' not in request.json:
        response_json = {'message': 'Fill in all text fields.'}
    else:
        email = request.json['email']
        password = request.json['password']
        cursor = db.cursor()
        cursor.execute("SELECT password FROM users WHERE email=?", (email,))
        data = cursor.fetchone()

        if data is None:
            response_json = {'message': 'Email not found ' + email}
        else:
            if (data[0] == password):
                response_json = {
                    'message': 'Login successful',
                    'email':email,
                }
                response_code = 200
            else:
                response_json = {'message': 'Invalid password'}
    db.close()
    return jsonify(response_json),response_code



@app.route('/api/loginsuccess/<email>', methods=['GET'])
def loginSuccess(email):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE email=?',(email,))
    row = cursor.fetchone()
    db.close()
    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
         return jsonify(None), 200


@app.route('/api/retrieveuser/<user_id>', methods=['GET'])
def retrieveUser(user_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE user_id=?',(user_id,))
    row = cursor.fetchone()
    db.close()
    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
         return jsonify(None), 200
         

#update profile
@app.route('/api/update', methods=['POST'])
def update():
    if not request.json:
        abort(404)
    update_user = (
        request.json['name'],
        request.json['email'],
        request.json['phone_num'],
        request.json['user_id'],
    )
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('''UPDATE users SET name=?,email=?,phone_num=? WHERE user_id=?;''', update_user)
    user_id = cursor.lastrowid
    db.commit()
    response = {
        'id': user_id,
        'affected': db.total_changes,
    }
    db.close()
    return jsonify(response), 201


@app.route('/api/register', methods=['POST'])
def register():
    db = sqlite3.connect(DB)
    response_json = None
    response_code = 400

    if not request.json:
        response_json = {'message': 'No JSON data found'}
    elif 'email' not in request.json or 'password' not in request.json or 'name' not in request.json or 'phone_num' not in request.json:
        response_json = {'message': 'Please fill in all fields'}
    else:
        
        name = request.json['name']
        email = request.json['email']
        password = request.json['password']
        phone_num = request.json['phone_num']
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?",(email,))
        data = cursor.fetchone()

        if data is None:
            cursor = db.cursor()
            cursor.execute("INSERT INTO users(name,email,password,phone_num) VALUES(?,?,?,?)", (name,email,password,phone_num))
            user_id = cursor.lastrowid
            data = db.total_changes
            db.commit()

            if data == 0:
                response_json = {'message': 'account not created '}
            else:
                response_json = {
                    'message': 'Register successful',
                    'email': email,
                    'user_id':user_id,
                }
                response_code = 200
        else: response_json = {'message': 'Account already exists '}
            
    db.close()
    return make_response(jsonify(response_json), response_code)




    
if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)