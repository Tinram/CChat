
# CChat

#### Lightweight end-to-end encrypted chatbox, with an emphasis on speed and minimalism.

[1]: https://tinram.github.io/images/cchat.png
![cchat][1]


## Password

Uses a previously agreed password with the recipient, avoiding any initial key exchange across a network.


## Features

+ Lightweight (45kB).
+ All data encrypted by the browser's JavaScript.
+ Uses only PHP, MySQL, and JavaScript.
+ POST AJAX used (GET AJAX data would be recorded in server logs).
+ Coded to PHP 5.3 and using legacy JavaScript event handlers for maximum server-client compatibility.


## Encryption

+ SHA-256-hashed key.
+ Blowfish cipher in CBC-mode (base64 display overlays binary-encrypted data).
+ Messages stored encrypted in the database.

The Blowfish block cipher is simple, strong, and fast. Its speed is ideal for JavaScript implementation.


## Set-up

1. Clone the repository (or extract the ZIP archive) into a suitable directory in the server's web directory  
e.g.

    `cd /var/www/html`

    `sudo git clone https://github.com/Tinram/CChat.git`

2. On Linux/BSD servers, set appropriate file ownership / permissions  
e.g. for Debian-based distros, Apache is *www-data*:

    `sudo chown -R www-data:<username> CChat/`

    `cd CChat`

    `sudo chmod 664 install.php classes/cchat.class.php`

3. Edit the configuration section details in *install.php* (line 18 onwards): username, passwords, database, host etc.

4. Edit the relevant constants in */classes/cchat.class.php* (line 19 onwards) to conform to the credentials used in *install.php*

5. Execute *install.php* via the terminal: `php install.php`  
or through the server:

    `http://localhost/CChat/install.php`

     (which, if you have root MySQL access, should mean set-up is now complete)

6. View CChat's *index.php* in a browser, which if *install.php* ran correctly, should display without connection errors to the server, and display *init: test* as the first message.

    `http://localhost/CChat/`

7. Alter the timezone if required: *index.php* (line 7):

    `date_default_timezone_set('Europe/London');`


## Operation

### Fields:

1. **message display**
2. **your name**
3. **your password** (use a strong password, previously agreed, to share messages with a recipient)
4. **your message**

The *decrypt* button will decrypt existing encrypted messages in *field 1*, if the correct password is present in *field 2*.

Enter your name in *field 2*, password in *field 3*, and a message in *field 4*, then click the *chat* button.

A page refresh (encrypted messages displayed) or the wrong password will result in gibberish displayed in *field 1*.


### Default Timings

The AJAX polling is 6 seconds between server checks for new messages (change the `iCheckFreq` variable (in microseconds) */js/cchat.js* (line 21)).

The last hour's messages are displayed in field 1 (change the `MESSAGE_BUFFER` constant */classes/cchat.class.php* (line 25)).


### Character Set Limitation

Unicode character encoding is unfortunately not possible with the present JavaScript Blowfish cipher encryption (the reason the database remains as *latin1* encoding).


### Known Bugs

1. Intermittent duplicate message bug (refresh page and it disappears): */js/cchat.js* (line 297).
2. Some intermittent line break character removal when using Linux and Windows browser clients together.


## Credits

+ Nils Reimers for the Blowfish cipher implementation in JavaScript.
+ Angel Marin and Paul Johnston for the SHA-256 hash function implementation in JavaScript.
+ Matthew of JS Classes for testing / revision suggestions.
+ Karl, who asked me to create a 'shoutbox' in 2010.


### Dedications

+ To God (I narrowly escaped death in 1992).
+ To Sofia.


## License

CChat is released under the [GPL v.3](https://www.gnu.org/licenses/gpl-3.0.html).


#### Miscellaneous

![alt](http://www.jsclasses.org/award/innovation/winner.png "JS Classes Innovation Award")

<small>Won a [JS Classes Innovation Award](http://www.jsclasses.org/award/innovation/) ([August 2016](http://www.jsclasses.org/package/513-JavaScript-Chat-system-that-exchanges-encrypted-messages.html)).</small>
