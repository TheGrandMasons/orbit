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

@app.post('/user-creation/')
# Query(...) is param input it provides like api.com/path?parameter_name=""
# You must pass type into it str , int , float = Query(...)
# Depends are server based enclosed parameters .

def create_user(username : str = Query(...), curs = Depends(get_db)):

        # Execute the insertion with parameterized queries to prevent SQL injection
        curs = get_db()
        curs.execute('SELECT * FROM USERS WHERE USERNAME = ?', (username,))
        # Checking for username if exists . "username" in [fetched data[0] -> indecated for every username]
        if username in [x[0] for x in curs.fetchall()]:
            return {
                'success': False,                        # Success "bool" must be passed in every call.
                'UFM': 'Sorry, Username Already Exists', # User-Friendly-Message ( can be shown in GUI ).
                'WFM': 'USERNAME_EXISTS'                 # Used to validation in z3ln's side.
            }
        else:
            curs.execute("""
                INSERT INTO USERS
                VALUES (?, ?, ?)
                """, (
                    username,
                    dumps([]),
                    dumps([{'badge-name':'Visitor', 'rarity':'normal'}])
                )
            )
            curs.connection.commit()  # Commit the transaction

            return {
                'success': True,
                'user-info':{},
                'UFM': '',
                'WFM': 'USER_CREATED'
            }
