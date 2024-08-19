from requests import get, post

print(post('http://127.0.0.1:8000/UserCreation/', params={'username':'omar'}).json())