
# CChat

## Purpose

Lightweight end-to-end encrypted chatbox using JavaScript, PHP, and MySQL, with an emphasis on speed and minimalism.


[1]: https://tinram.github.io/images/cchat.png
![cchat][1]


## Password

Uses a previously agreed password with the recipient, avoiding any initial key exchange across a network.


## Features

+ Lightweight (45kB).
+ All data encrypted by the browser's JavaScript.
+ POST AJAX used (GET AJAX data would be recorded in server logs).
+ Coded to PHP 5.3 and using legacy JavaScript event handlers for maximum server-client compatibility.


## Encryption

+ SHA-256-hashed key.
+ Blowfish cipher in CBC-mode (base64 display overlays binary-encrypted data).
+ Messages stored encrypted in the database.

The Blowfish block cipher is simple, strong, and fast. Its speed is ideal for JavaScript implementation.


## Set-up

1. Configure */install.php* (line 18 onwards) configuration section details: username, passwords, database etc.
2. Configure */classes/cchat.class.php* (line 18 onwards) constants to be identical to those in */install.php*
3. Run */install.php* through your server (which, if you have root MySQL access, should mean set-up is now complete and CChat's */index.php* now displays in a browser without connection errors to the server).
4. Alter the timezone if required: */index.php* (line 5): `date_default_timezone_set('Europe/London')`


## Operation

### Fields:

1. **message display**
2. **your name**
3. **your password** (use a strong password, previously agreed, to share messages with a recipient)
4. **your message**

The *decrypt* button will decrypt existing encrypted messages in field 1, if the correct password is present in field 2.

Enter your name in field 2, password in field 3, and a message in field 4, then click the *chat* button.

A page refresh (encrypted messages displayed) or the wrong password will result in gibberish displayed in field 1.


### Default Timings

The AJAX polling is 6 seconds between server checks for new messages (change the `iCheckFreq` variable (in microseconds) */js/cchat.js* (line 17)).

The last hour's messages are displayed in field 1 (change the `MESSAGE_BUFFER` constant */classes/cchat.class.php* (line 24)).


### Character Set Limitation

Unicode character encoding is unfortunately not possible with the present JavaScript Blowfish cipher encryption (the reason the database remains as latin1 encoding).


### Known Bugs

1. Intermittent duplicate message bug (refresh page and it disappears): */js/cchat.js* (line 294).
2. Some intermittent line break character removal when using Linux and Windows browser clients together.


## Credits

+ Nils Reimers for the Blowfish cipher in JavaScript.
+ Angel Marin and Paul Johnston for the SHA-256 hash function in JavaScript.
+ Matthew of JS Classes for testing / revision suggestions.
+ Karl, who asked me to create a 'shoutbox' in 2010.


### Dedications

+ To God (I narrowly escaped death in 1992).
+ To Sofia.


## License

CChat is released under the [GPL v.3](https://www.gnu.org/licenses/gpl-3.0.html).


### Miscellaneous

![alt](http://www.jsclasses.org/award/innovation/winner.png "JS Classes Innovation Award")

Won a [JS Classes Innovation Award](http://www.jsclasses.org/award/innovation/) ([August 2016](http://www.jsclasses.org/package/513-JavaScript-Chat-system-that-exchanges-encrypted-messages.html)).
