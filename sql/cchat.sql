
CREATE DATABASE cchat CHARACTER SET latin1 COLLATE latin1_general_ci;


USE cchat;


CREATE TABLE `chatbox` (

	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` CHAR(15) NOT NULL,
	`message` VARCHAR(384) NOT NULL, -- 255 = ~352 bytes of base64
	`date` INT(10) UNSIGNED NOT NULL,
	KEY `kdate` (`date`),
	PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;
