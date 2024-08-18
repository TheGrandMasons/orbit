from fastapi import FastAPI, HTTPException, Depends, Form, Query, Request
from sqlite3 import *
from json import dumps, loads

app = FastAPI()

# /{path-name}  -> is the API path: 192.168.1.7:8000/{path}
@app.get('/GetOrreries')
def OrreriesOutput():
    # Here we will get a new orrery data
    # Data will be returned as a dict from the database.
    orreries = []
    return orreries

# GetDb is used to get a cursor in the actual thread of the API, please use it in any execution
def GetDb():
    # Init connection
    conn = connect('database.db')
    try:
        return conn.cursor()
    finally:
        try:
            # This is our static user info
            conn.cursor().execute("""
                CREATE TABLE USERS (
                    USERNAME TEXT, 
                    VISITS   TEXT,
                    BADGES   TEXT
                )
            """)

            # Here is Model info . let all in TEXT.
            # ID for indenticate 
            # INFO is json.dumps({"info-key":"info-desc"}) data . will be json serialized in DB
            # To deserialize dumped data just use json.load()
            # Visits is a set of usernames : times EX, {'adelaziz' : 3}, {'seif' : 1}
            # Leave STATS alone RN , we will add it later .

            conn.cursor().execute("""
                CREATE TABLE MODELS (
                    ID       TEXT, 
                    INFO     TEXT,
                    VISITS   TEXT,
                    STATS    TEXT
                )
            """)
            conn.close()
        except Exception as e:
            # Checking for exceptions. If 'exists' is in the error message, it indicates the table already exists.
            if 'exists' in str(e).lower():
                pass

@app.post('/UserCreation/')
# Query(...) is a parameter input; it provides like api.com/path?parameter_name=""
# You must pass type into it: str, int, float = Query(...)
# Depends are server-based enclosed parameters.
def CreateUser(username: str = Query(...), curs = Depends(GetDb)):
    # Execute the insertion with parameterized queries to prevent SQL injection
    curs.execute('SELECT * FROM USERS WHERE USERNAME = ?', (username,))
    # Checking if username exists. "username" in [fetched data[0] -> indicates each username]
    if username in [x[0] for x in curs.fetchall()]:
        return {
            'success': False,                        # Success "bool" must be passed in every call.
            'UFM': 'Sorry, Username Already Exists', # User-Friendly-Message (can be shown in GUI).
            'WFM': 'USERNAME_EXISTS'                 # Used for validation in z3ln's side.
        }
    elif " " in username or any(char in username for char in '!@#$%^&*()'):
        return {
            'success': False,
            'UFM': 'Sorry, Username must be lowercase, use _ instead of spaces and don\'t use special chars.', 
            'WFM': 'WRONG_USERNAME_FORMAT'
        }
    else:
        curs.execute("""
            INSERT INTO USERS
            VALUES (?, ?, ?)
        """, (
            username,
            dumps([]),  # dumps() -> used to add JSON info into SQL.
            dumps([{'badgeName':'Visitor', 'rarity':'normal'}])  # LowerCamelCase for keys
        ))
        curs.connection.commit()  # Commit the transaction

        return {
            'success': True,
            'instructions': f'Use api/users/{username} to get all user\'s info.',  # LowerCamelCase for instructions
            'UFM': '',
            'WFM': 'USER_CREATED'
        }

@app.get('/Users/{username}')
def GetUser(username, curs=Depends(GetDb)):
    curs.execute('SELECT * FROM USERS WHERE USERNAME = ?', (username,))
    user = curs.fetchone()
    if user:
        return {
            'success': True,
            'userInfo': {  # LowerCamelCase for user-info keys
                "username": user[0],
                "visits": user[1],
                "badges": loads(user[2])
            },
            'UFM': '',
            'WFM': 'USER_FOUND'
        }
    else:
        return {
            'success': False,
            'UFM': 'The user you are searching for does not exist.',
            'WFM': 'USER_NOT_FOUND'
        }

# We will use this api path to add a visit into orrery model
# I've added curs : Cursor to highlight every func

#################################
# Can you clean badges system ? #
#################################

@app.post('/AddVisit/')
def AddVisit(username : str = Query(...), orr_id : str = Query(...), curs : Cursor = Depends(GetDb)):
    curs.execute('SELECT * FROM MODELS WHERE ID = ?', (orr_id,))

    # loded the set .
    visitsSet = loads(curs.fetchone())
    # adding / editing visits number {"username" : i++}
    visitsSet[username] += 1 if visitsSet[username] > 0 else 1

    curs.execute('UPDATE MODELS SET VISITS = ? WHERE ID = ?',(
        dumps(visitsSet),
        orr_id
    ))

    curs.execute('SELECT * FROM USERS WHERE USERNAME = ?', (username,))
    userInfo = curs.fetchone()

    # Increasing visits number . 
    newVisitsNumber =  int( userInfo[1] ) + 1 
    if newVisitsNumber > 9:
        curs.execute('UPDATE USERS SET BADGES = ? WHERE USERNAME = ?', (
            dumps([{'badge-name' : 'Visitor !',
                    'badge-rariety' : 'silver',
                    'badge-description' : 'You Visited more than 10 models, You are an actual visitor !'}]),
            str( username )
            ))

    curs.execute('UPDATE USERS SET VISITS = ? WHERE USERNAME = ?', (
        str( newVisitsNumber ),
        str( username )
        ))
    curs.connection.commit()

    additions = {}
    if newVisitsNumber > 9 :
        additions['bages-added'] = {'badge-name' : 'Visitor !',
                    'badge-rariety' : 'silver',
                    'badge-description' : 'You Visited more than 10 models, You are an actual visitor !'}
        additions['instructions'] = "You can show ['badge-description'] to the user."
    else:
        additions['message'] = 'Nothing here.'
    return {
        'success' : True,
        'ADDITIONS': additions,
        'UFM' : f'Welcome, {username}',
        'WFM' : 'VISIT_ADDED'
    }



