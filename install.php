<?php

/**
	* Very simple install script to set-up the MySQL database for CChat.
	* Edit the constants in the configuration section below, then load this file via your web server
	* (or via the command-line: php install.php).
	*
	* @author            Martin Latter <copysense.co.uk>
	* @copyright         29/06/2014
	* @version           0.05
	* @license           GNU GPL version 3.0 (GPL v3); http://www.gnu.org/licenses/gpl.html
	* @link              https://github.com/Tinram/cchat.git
*/


/* CONFIGURATION */

define('APP_USERNAME', 'messenger');
define('APP_PASSWORD', 'password');
define('APP_NAME', 'CChat');

define('SUPER_USER', 'root');
define('SUPER_USER_PASSWORD', '**root_password**');

define('HOST', 'localhost');
define('DATABASE', 'cchat');
define('TABLE', 'chatbox');

define('CHARSET', 'latin1');
define('COLLATION', 'latin1_general_ci');

/* END CONFIGURATION */


# command-line or server line break output
define('LINE_BREAK', (PHP_SAPI !== 'cli') ? '<br>' : "\n");


$oConnection = new mysqli(HOST, SUPER_USER, SUPER_USER_PASSWORD);

if ($oConnection->connect_errno) {
	die('Database connection failed: ' . $oConnection->connect_errno . ') ' . $oConnection->connect_error . LINE_BREAK);
}
else {

	$sTitle = APP_NAME . ' Database Setup';

	if (PHP_SAPI !== 'cli') {
		echo '<h2>' . $sTitle . '</h2>';
	}
	else {
		echo $sTitle . LINE_BREAK . LINE_BREAK;
	}

	# create database
	$sQuery = 'CREATE DATABASE IF NOT EXISTS ' . DATABASE . ' CHARACTER SET ' . CHARSET . ' COLLATE ' . COLLATION;
	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created database ' . DATABASE . '.' . LINE_BREAK;
	}
	else {
		die('ERROR: could not create the ' . DATABASE . ' database.' . LINE_BREAK);
	}

	# select database
	$sQuery = 'USE ' . DATABASE;
	$rResults = $oConnection->query($sQuery);

	# create table
	$sQuery = '
		CREATE TABLE IF NOT EXISTS `' . TABLE . '` (
			`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
			`name` CHAR(15) NOT NULL,
			`message` VARCHAR(384) NOT NULL,
			`date` INT(10) UNSIGNED NOT NULL,
			KEY `kdate` (`date`),
			PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=' . CHARSET;

	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created table ' . TABLE . '.' . LINE_BREAK;
	}
	else {
		die('ERROR: could not create the ' . TABLE . ' table.' . LINE_BREAK);
	}

	# create first (unencrypted) test message
	$sQuery = 'INSERT INTO ' . DATABASE . '.' . TABLE . ' (name, message, date) VALUES("init", "test", UNIX_TIMESTAMP())';
	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created first ' . APP_NAME . ' message.' . LINE_BREAK;
	}
	else {
		die('ERROR: could not create the required first message.' . LINE_BREAK);
	}

	# create grants to cchat user
	$sQuery = 'GRANT SELECT, INSERT ON ' . DATABASE . '.* TO ' . APP_USERNAME . '@localhost IDENTIFIED BY "' . APP_PASSWORD . '"';
	$rResults = $oConnection->query($sQuery);

	if ($rResults) {
		echo 'Created ' . APP_NAME . ' database user.' . LINE_BREAK;
	}
	else {
		die('ERROR: could not create the required ' . APP_NAME . ' database user.' . LINE_BREAK);
	}

	# flush
	$sQuery = 'FLUSH PRIVILEGES';
	$rResults = $oConnection->query($sQuery);

	#  if run in browser, display link to CChat
	if (PHP_SAPI !== 'cli') {
		echo LINE_BREAK . '<a href="./index.php">' . APP_NAME . '</a>';
	}

	# close connection
	$oConnection->close();
}

?>