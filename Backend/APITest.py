from requests import get, post
from json import dumps
print(post('http://127.0.0.1:8000/CustomExecution/', params={'execution' : dumps({'block_1' : {'head' : 'EXIDB', 'query' : 'SELECT * FROM USERS WHERE USERNAME = "omar"'}})}).json())