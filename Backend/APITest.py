from requests import get, post

print(post('http://127.0.0.1:8000/GiveBadge/', params={'username':'omar', 'badgeName':'Test2', 'badgeRariety':'Silver', 'badgeDescription':'test badge 111'}).json())