<?php

/**
	* Very simple install script to setup the database for CChat.
	* Define your constants in the configuration section below, then load this via your web server, or via the command-line: php -f install.php
	*
	* @author            Martin Latter <copysense.co.uk>
	* @copyright         29/06/2014
	* @version           0.03
	* @license           GNU GPL version 3.0 (GPL v3); http://www.gnu.org/licenses/gpl.html
	* @link              https://github.com/Tinram/cchat.git
*/


/* CONFIGURATION */

define('APP_USERNAME', 'messenger');
define('APP_PASSWORD', 'password');
define('APP_NAME', 'CChat');

define('SUPER_USER', 'root');
define('SUPER_USER_PASSWORD', 'root_password');

define('HOST', 'localhost');
define('DATABASE', 'cchat');
define('TABLE', 'chatbox');

define('CHARSET', 'latin1');
define('COLLATION', 'latin1_general_ci');

/* END CONFIGURATION */


$oConnection = new mysqli(HOST, SUPER_USER, SUPER_USER_PASSWORD);

if ($oConnection->connect_errno) {
	die('Database connection failed: ' . $oConnection->connect_errno . ') ' . $oConnection->connect_error);
}
else {

	echo '<h2>' . APP_NAME . ' Database Setup</h2>';

	# create database
	$sQuery = 'CREATE DATABASE IF NOT EXISTS ' . DATABASE . ' CHARACTER SET ' . CHARSET . ' COLLATE ' . COLLATION;
	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created database ' . DATABASE . '.<br>';
	}
	else {
		die('ERROR: could not create the ' . DATABASE . ' database.');
	}

	# select database
	$sQuery = 'USE ' . DATABASE;
	$rResults = $oConnection->query($sQuery);

	# create table
	$sQuery = '
		CREATE TABLE `' . TABLE . '` (
			`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
			`name` VARCHAR(15) NOT NULL,
			`message` VARCHAR(384) NOT NULL,
			`date` INT(10) UNSIGNED NOT NULL,
			KEY `kdate` (`date`),
			PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=latin1';

	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created table ' . TABLE . '.<br>';
	}
	else {
		die('ERROR: could not create the ' . TABLE . ' table.');
	}

	# create first (unencrypted) test message
	$sQuery = 'INSERT INTO ' . DATABASE . '.' . TABLE . ' (name, message, date) VALUES("init", "test", UNIX_TIMESTAMP())';
	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created first ' . APP_NAME . ' message.<br>';
	}
	else {
		die('ERROR: could not create the required first message.');
	}

	# create grants to cchat user
	$sQuery = 'GRANT SELECT, INSERT ON ' . DATABASE . '.* TO ' . APP_USERNAME . '@localhost IDENTIFIED BY "' . APP_PASSWORD . '"';
	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created ' . APP_NAME . ' database user.<br>';
	}
	else {
		die('ERROR: could not create the required ' . APP_NAME . ' database user.');
	}

	# flush
	$sQuery = 'FLUSH PRIVILEGES';
	$rResults = $oConnection->query($sQuery);

	# close connection
	$oConnection->close();
}

?>