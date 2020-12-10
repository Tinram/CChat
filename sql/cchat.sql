
CREATE DATABASE cchat CHARACTER SET latin1 COLLATE latin1_general_ci;


USE cchat;


CREATE TABLE `chatbox`
(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` CHAR(16) NOT NULL,
    `message` VARCHAR(384) NOT NULL COMMENT '255 = ~352 bytes of base64',
    `date` INT UNSIGNED NOT NULL,
    KEY `idx_date` (`date`),
    PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;