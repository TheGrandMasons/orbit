from fastapi import FastAPI, HTTPException, Depends, Form, Query, Request
from sqlite3 import *
from json import dumps, loads
import random
import APIsControllers
from APIsBlocks import Blocks
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
            'UFM': f"There is a spaceship got your name, {APIsControllers.GiveRndUsername()} is available.", # User-Friendly-Message (can be shown in GUI).
            'WFM': 'USERNAME_EXISTS'                 # Used for validation in z3ln's side.
        }
    elif " " in username or any(char in username for char in '!@#$%^&*()'):
        return {
            'success': False,
            'UFM': random.choice(APIsControllers.UFMs['WRONG_USERNAME_FORMAT']), 
            'WFM': 'WRONG_USERNAME_FORMAT'
        }
    else:
        curs.execute("""
            INSERT INTO USERS
            VALUES (?, ?, ?)
        """, (
            username,
            dumps([]),  # dumps() -> used to add JSON info into SQL.
            dumps([])   # LowerCamelCase for keys
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


@app.post('/AddVisit/')
def AddVisit(username : str = Query(...), orr_id : str = Query(...), curs : Cursor = Depends(GetDb)):
    
    curs.execute('SELECT * FROM USERS WHERE USERNAME = ?', (username,))
    userInfo = curs.fetchone()


    # checks for user existance ..
    if not userInfo:
        return {
            'success': False,
            'UFM': 'Your login sssion might be ended, please push a bug in our repo TheGrandMasons/orbit',
            'WFM': 'USER_NOT_FOUND'
            } 
    
    curs.execute('SELECT * FROM MODELS WHERE ID = ?', (orr_id,))

    # loded the set .
    visitsSet = loads(curs.fetchone()[3])
    # adding / editing visits number {"username" : i++}
    # This snippet edited to be more efficient ..
    visitsSet[username] = visitsSet.get(username, 0) + 1

    curs.execute('UPDATE MODELS SET VISITS = ? WHERE ID = ?',(
        dumps(visitsSet),
        orr_id
    ))



    # Increasing visits number . 
    newVisitsNumber =  int( userInfo[1] ) + 1 

    additions = {}

    # Badges System.
    if newVisitsNumber > 9:
        if len(userInfo[2]) == 0:
            curs.execute('UPDATE USERS SET BADGES = ? WHERE USERNAME = ?', (
                dumps([{'badge-name' : 'Visitor !',
                        'badge-rariety' : 'silver',
                        'badge-description' : 'You Visited more than 10 models, You are an actual visitor !'}]),
                str( username )
                )) 
            curs.connection.commit()
        else:
            additions['alert'] = 'BADGE_EXISTS'

    curs.execute('UPDATE USERS SET VISITS = ? WHERE USERNAME = ?', (
        str( newVisitsNumber ),
        str( username )
        ))
    curs.connection.commit()

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

@app.post('/GiveBadge/')
def GiveCustomBadge(username : str = Query(...), badgeName : str = Query(...),
                    badgeRariety : str = Query(...), badgeDescription : str = Query(...), curs : Cursor = Depends(GetDb)):
    
    curs.execute('SELECT * FROM USERS WHERE USERNAME = ? ', (username,))
    userInfo = curs.fetchone() 

    # fetchone() returns None if nothing in table with Identicator

    if not userInfo :
        return {
            'success': False,
            'UFM': 'Your login sssion might be ended, please push a bug in our repo TheGrandMasons/orbit',
            'WFM': 'USER_NOT_FOUND'
            }
    
    # Check if badge exists or not .
    for badge in loads(userInfo[2]):
        try:
            if badge['badge-name'] == badgeName:
                return {
                    'succss' : False,
                    'UFM' : 'You have this badge already',
                    "WFM": 'BADGE_EXISTS'
                }
        except:
            pass
    curs.execute('UPDATE USERS SET BADGES = ? WHERE USERNAME = ?', (
                    dumps(loads(userInfo[2]) + [{'badge-name' : badgeName,
                    'badge-rariety' : badgeRariety,
                    'badge-description' : badgeDescription}]),
                    str( username )
        )) 
    curs.connection.commit()
    return {
        'success' : True,
        'EaserEgg' : random.randint(0000,1090), # It has a huge task to do let us see it later.
        'UFM' : 'I think Z3ln made somthing spechial for you',
        'WFM' : 'BADGE_ADDED'
    }

@app.post('/CustomExecution/')
def CustomExecution(execution : dict = Query(...)):

    # This is 
    Ex = Blocks()
    for blockName, blockInfo in execution.items():
        if blockInfo['head'] == 'EXIDB':
            Ex.ExecuteInDatabase(blockInfo['query'])
        if blockInfo['head'] == 'SRIDB':
            Ex.SearchInDatabase(blockInfo['table'], blockInfo['column'], blockInfo['key'])
    return Ex.PullLog()