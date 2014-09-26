
# CChat

## Purpose

Lightweight encrypted chatbox using Javascript, PHP and MySQLi, with an emphasis on speed and minimalism.


## Password

Uses a previously agreed password with the recipient, avoiding any initial key exchange across a network.


## Features

+ Lightweight (40kB)
+ All data encrypted by the browser's JavaScript
+ POST AJAX used to avoid GET data being recorded in server logs.


## Encryption

SHA256-hashed key, Blowfish cipher (base64 display is a binary-encrypted overlay), messages stored encrypted in the database.  
The Blowfish block cipher is simple, strong, and fast.  Its speed is ideal for JavaScript implementation.


### Setup

1. Configure */install.php* configuration details - username and password etc.  
2. Configure */classes/cchat.class.php* constants to be identical.  
3. Run */install.php* through your server (which, if you have root MySQL access, should mean setup is now complete and CChat's */index.php* now displays without connection errors via server access).  
4. Alter the timezone ( date_default_timezone_set('Europe/London') ), if required, in index.php


### Operation

**Fields**

1. message display
2. your name
3. your password (use a strong, previously agreed, password to share messages with a recipient)
4. your message

The *decrypt* button will decrypt existing encrypted messages in field 1, if the correct password is present in field 2.  
Enter your name in field 2, password in field 3, and a message in field 4, then click the *chat* button.  
A page refresh (encrypted messages displayed) or the wrong password will result in gibberish displayed in field 1.


### Default Timings

The AJAX polling is 6 seconds between server checks for new messages (change iCheckFreq variable in */js/cchat.js*).  
The last hour's messages are displayed in field 1 (change MESSAGE_BUFFER constant in */classes/cchat.class.php*).


### Limitations

Unicode character encoding is not possible with the present JavaScript Blowfish cipher encryption (the reason the database remains as latin1 encoding).


#### Known Bugs

Intermittent duplicate message bug (refresh page and it disappears), line 277 */js/cchat.js*  
Some intermittent line break character removal between Windows and Linux browser instances.


#### Dedication

To Sofia.


#### License

CChat is released under the [GPL v.3](https://www.gnu.org/licenses/gpl-3.0.html).
