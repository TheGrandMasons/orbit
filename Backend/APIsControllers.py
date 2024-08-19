
import random

# API's Controllers is a magician to give user a unique Exp !
# UFM - User Friendly Messages will be stored here 
# You can be kind and add some cute messages here :)
# NEOs Descriptions will be destriputed in here 
# User can add fingerprint to last in our lovely project .
# NEOs Is A Magic Made By God , Care About It .

# Random username generation.
def GiveRndUsername():
   namesPrefix = ['astronut', 'spacevisitor', 'explorer', 'anonymouscurious',
                  'curiouscat', 'algorive', 'persudec', 'dsudusu', 'kitoooo']
   namesVox    = random.randint(00, 99)
   return random.choice(namesPrefix) + str(namesVox)


# UFM will be saved with key of WFM - Website Friendly Message . {'BADGE ADDED' : [a list of messages !]}
UFMs = {
   'USER_NOT_FOUND' : [
                        'We think that your login session has been ended',
                        'This is our fault you can pet a cat until we fix it',
                        'Security says, this way is under construction, go fill your car tank and get back later',
                        "Always , always and always it's front-end fault :("
                        'Try again, login again. huh ?',
                        "Astronuts sleeping now, we can't take off, be back later ..",
                        'Your Ship stolen ! we are getting it in 10 mins',
                        'You can call it an error, somthing like magic . but we will make this disappear soon ;)'
                        ],
   'WRONG_USERNAME_FORMAT' : [
                        "Yeah, our website is from mars.. but your username must be from earth ~  Don't use  spaces or spechial chars" 
                        "'Astronut' See ? No spaces, No spechial chars, just simple ~ username must be simple",
                        "Spaceships don't take complex names. The love no spaces, no spechial chars names"
   ],
   'USERNAME_EXISTS' : [
                        
   ]
}