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
            'ufm': 'Sorry, Username Already Exists', # User-Friendly-Message (can be shown in GUI).
            'wfm': 'USERNAME_EXISTS'                 # Used for validation in z3ln's side.
        }
    elif " " in username or any(char in username for char in '!@#$%^&*()'):
        return {
            'success': False,
            'ufm': 'Sorry, Username must be lowercase, use _ instead of spaces and don\'t use special chars.', 
            'wfm': 'WRONG_USERNAME_FORMAT'
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
            'ufm': '',
            'wfm': 'USER_CREATED'
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
            'ufm': '',
            'wfm': 'USER_FOUND'
        }
    else:
        return {
            'success': False,
            'ufm': 'The user you are searching for does not exist.',
            'wfm': 'USER_NOT_FOUND'
        }

@app.post('/AddVisit/')
def AddVisit():
    pass
