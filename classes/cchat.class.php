<?php

class Chatbox {

	/**
	* Crypto Chatbox
	*
	* @author            Martin Latter <copysense.co.uk>
	* @copyright         Martin Latter, Sep 2013
	* @version           2.00
	* @license           GPL v.3
	*/


	const

		DB_NAME = 'cchat',
		DB_TABLE = 'chatbox',
		DB_USERNAME = 'messenger',
		DB_PASSWORD = 'password',

		MESSAGE_BUFFER = 3600, # 1 hour of messages displayed

		BR = '<br>',
		LB = '~',

		DEBUG = FALSE;


	/**
	* connecto to database
	* @return   database object
	*/	
	
	private static function getConnection() {

		$oConnection = new mysqli('localhost', self::DB_USERNAME, self::DB_PASSWORD, self::DB_NAME);

		if ($oConnection->connect_errno) {

			die('Connection failed: ' . $oConnection->connect_errno . ') ' . $oConnection->connect_error);
		}

		return $oConnection;

	} # end getConnection()


	/**
	* output chatbox message
	* @return   string
	*/

	public static function outputMessages() {

		$iTime = time() - self::MESSAGE_BUFFER;
		$sOutput = '';
		$sTemp = '';
		$oConn = self::getConnection();

		$sQuery = '
			SELECT name, message 
			FROM ' . self::DB_TABLE . ' 
			WHERE date > ' . $iTime;

		$rResults = $oConn->query($sQuery);

		while ($aResults = $rResults->fetch_assoc()) {

			$sOutput .= stripslashes($aResults['name']) . ': ';
			$sTemp = $aResults['message'];
			$sTemp = '<span class="m">' . $sTemp . '</span>';
			$sOutput .= stripslashes($sTemp);
			$sOutput .= self::BR;
		}

		$rResults->close();
		$oConn->close();

		return $sOutput;

	} # end outputMessages()


	/**
	* check for new chatbox message
	* @return   string
	*/

	public static function checkForUpdate() {

		$sOutput = '';
		$sTemp = '';
		$oConn = self::getConnection();
		$sID = self::dbSafe($_POST['id'], $oConn);

		if ($sID !== '0') {

			$sQuery = '
				SELECT id
				FROM ' . self::DB_TABLE .' 
				WHERE id > ' . $sID;

			$rResults = $oConn->query($sQuery);
			$aResults = $rResults->fetch_row();

			if (!$aResults) { # no new messages

				$a = array('id' => $sID, 'n' => '', 'm' => '');
				$sOutput .= '[' . json_encode($a) . ']';
			}
			else { # new messages

				$aJSON = array();

				$sQuery = '
					SELECT id, name, message 
					FROM ' . self::DB_TABLE . ' 
					WHERE id > ' . $sID;

				$rResults = $oConn->query($sQuery); # need to query again, else blank results between browser windows

				while ($aResults = $rResults->fetch_assoc()) {

					$sTemp = str_ireplace(self::LB, self::BR, $aResults['message']);
					$aJSON[] = json_encode(array('id' => $aResults['id'], 'n' => $aResults['name'], 'm' => $sTemp));
				}

				$sOutput .= '[' . join(',', $aJSON) . ']';

				$rResults->close();
				$oConn->close();
			}
		}
		else {

			$sQuery = '
				SELECT id
				FROM ' . self::DB_TABLE . '
				ORDER BY id
				DESC LIMIT 1';

			$rResults = $oConn->query($sQuery);
			$aResult = $rResults->fetch_row(); 
			$sID = $aResult[0];

			$rResults->close();
			$oConn->close();

			$a = array('id' => $sID, 'n' => '', 'm' => '');
			$sOutput .= '[' . json_encode($a) . ']';
		}

		return $sOutput;

	} # end checkForUpdate()


	/**
	* add a chatbox message to database
	* @return   string (if successful)
	*/

	public static function addMessage() {

		if (!isset($_POST['n'])) {

			return '';
		}

		$bInsertion = FALSE;

		$oConn = self::getConnection();

		$sName = self::dbSafe(rawurldecode($_POST['n']), $oConn);
		$sMessage = self::dbSafe($_POST['m'], $oConn);
		$iDate = time();

		$sInsert = '
			INSERT INTO ' . self::DB_TABLE . ' 
				(name, message, date) 
			VALUES(?, ?, ?)';

		$oStmt = $oConn->stmt_init();
		$oStmt->prepare($sInsert);
		$oStmt->bind_param('ssi', $sName, $sMessage, $iDate);
		$oStmt->execute();

		if ($oStmt->affected_rows) {

			$bInsertion = TRUE;
		}

		$iID = $oStmt->insert_id; # find ID from insert

		$oStmt->close();
		$oConn->close();

		if ($bInsertion) {

			$a = array('id' => $iID, 'n' => $sName, 'm' => $sMessage);
			$sOutput = json_encode($a); # NB no square brackets
			return $sOutput;
		}
		else {

			if (self::DEBUG) {

				return 'Row could not be inserted into table.';
			}
		}

	} # end addMessage()


	/**
	* sanitize string for database input
	* @param    string $sExt, external string to be sanitized; object $oConn, database connection
	* @return   string
	*/

	private static function dbSafe($sExt, mysqli &$oConn) {

		return $oConn->real_escape_string(strip_tags(stripslashes(trim($sExt))));

	} # end dbSafe()

} # end Chatbox {}

?>