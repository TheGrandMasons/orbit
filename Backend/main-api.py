from fastapi import FastAPI, HTTPException, Depends, Form, Query, Request
from sqlite3 import *
from json import dumps, loads


app = FastAPI()


# app. (get or post) is handling the type of API's request.
# /{path-name}  - > is the adx api bath : 192.168.1.7:8000/{path}
@app.get('/get-orreries')
def OrerriesOutput():

    # Here we will get a new orrery data
    # Data will be returned as a dict from the database. 

    orreries = []
    return orreries

# get_db used to get a cursor in actual thread of api, please use it in any execution
def get_db():
    # Init connection
    conn = connect('database.db')
    try:
        return conn.cursor()
    finally:
        try:
            # This is our static usr info 
            conn.cursor().execute("""
                        CREATE TABLE USERS (
                            USERNAME TEXT, 
                            VISITS   TEXT,
                            BADGES   TEXT
                        )
                        """)      
            conn.close()
        except Exception as e :
            # Checking in Exp, It should be right . we can yeild an error if - else, leave it right now
            if 'exists' in str(e).lower():
                pass
