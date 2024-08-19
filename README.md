# API News.

 - username exists gives now random usernames to use

 ```bash
    oe@pop-os:~/orbit$ /bin/python3 /home/oe/orbit/Backend/APITest.py
    {'success': False, 'UFM': 'There is a spaceship got your name, anonymouscurious94 is available.', 'WFM': 'USERNAME_EXISTS'}
    oe@pop-os:~/orbit$ /bin/python3 /home/oe/orbit/Backend/APITest.py
    {'success': False, 'UFM': 'There is a spaceship got your name, curiouscat50 is available.', 'WFM': 'USERNAME_EXISTS'}
    oe@pop-os:~/orbit$ /bin/python3 /home/oe/orbit/Backend/APITest.py
    {'success': False, 'UFM': 'There is a spaceship got your name, astronut9 is available.', 'WFM': 'USERNAME_EXISTS'}
    oe@pop-os:~/orbit$ /bin/python3 /home/oe/orbit/Backend/APITest.py
    {'success': False, 'UFM': 'There is a spaceship got your name, explorer10 is available.', 'WFM': 'USERNAME_EXISTS'}
 ```