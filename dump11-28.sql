/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.1.2-MariaDB, for osx10.19 (x86_64)
--
-- Host: localhost    Database: rpg_game
-- ------------------------------------------------------
-- Server version	12.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login_id` varchar(255) NOT NULL,
  `banned` tinyint(3) unsigned DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `login_id` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `accounts` VALUES
(1,'kakao:4550196462',0,'2025-11-24 15:13:31',NULL),
(2,'kakao:100002',0,'2025-10-12 09:55:44','2025-11-21 14:33:11'),
(3,'kakao:100003',0,'2025-10-13 18:10:29','2025-11-22 17:01:55'),
(4,'kakao:100004',0,'2025-10-14 08:15:12','2025-11-23 12:45:22'),
(5,'kakao:100005',0,'2025-10-16 15:44:10','2025-11-22 22:10:10'),
(6,'kakao:100006',0,'2025-10-18 22:13:51','2025-11-23 13:22:50'),
(7,'kakao:100007',0,'2025-10-19 07:51:19','2025-11-21 10:18:01'),
(8,'kakao:100008',0,'2025-10-20 13:31:29','2025-11-23 16:11:44'),
(9,'kakao:100009',0,'2025-10-21 16:44:56','2025-11-23 17:01:20'),
(10,'kakao:100010',0,'2025-10-22 19:25:30','2025-11-23 18:33:55'),
(12,'kakao:4547526516',0,'2025-11-23 20:07:15',NULL),
(13,'kakao:100001',0,'2025-10-11 11:23:10','2025-11-20 20:11:05');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `auction`
--

DROP TABLE IF EXISTS `auction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auction` (
  `auction_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_id` int(11) unsigned NOT NULL,
  `seller_char_id` int(11) unsigned DEFAULT NULL,
  `price` int(11) unsigned NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`auction_id`),
  UNIQUE KEY `inventory_id_key` (`inventory_id`),
  KEY `inventory_id` (`inventory_id`),
  KEY `seller_char_id` (`seller_char_id`),
  CONSTRAINT `auction_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auction_ibfk_2` FOREIGN KEY (`seller_char_id`) REFERENCES `characters` (`char_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auction`
--

LOCK TABLES `auction` WRITE;
/*!40000 ALTER TABLE `auction` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `auction` VALUES
(24,6,12,111,'2025-11-26 20:09:00'),
(25,39,12,111,'2025-11-26 23:23:31');
/*!40000 ALTER TABLE `auction` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_auction_sell_log
AFTER INSERT ON auction
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (char_id, type, action, detail)
    VALUES (
        NEW.seller_char_id,
        'action',
        '아이템 판매 등록',
        CONCAT('inventory_id=', NEW.inventory_id, ', price=', NEW.price)
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `char_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(11) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `hp` int(11) unsigned DEFAULT 100,
  `atk` int(11) unsigned DEFAULT 10,
  `def` int(11) unsigned DEFAULT 10,
  `gold` int(11) unsigned DEFAULT 10,
  `best_stage` int(11) unsigned DEFAULT 0,
  `best_survived_time` time DEFAULT NULL,
  `best_played_date` datetime DEFAULT NULL,
  PRIMARY KEY (`char_id`),
  KEY `account_id` (`account_id`),
  KEY `idx_charactersTBL_ranking` (`best_stage` DESC,`gold` DESC),
  KEY `idx_char_ranking` (`best_stage` DESC,`best_played_date` DESC),
  CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `characters` VALUES
(1,13,'파괴왕준서',120,37,20,16140,5,'00:01:22','2025-11-22 14:11:20'),
(2,2,'도끼맨',150,40,30,13400,7,'00:02:10','2025-11-23 15:01:55'),
(3,3,'NightHunter',130,55,18,26700,9,'00:03:33','2025-11-23 13:44:12'),
(4,4,'초보전사',100,20,15,4211,2,'00:00:48','2025-11-22 20:30:11'),
(5,5,'용사킹',160,62,28,60000,11,'00:04:55','2025-11-23 17:20:52'),
(6,6,'돌격형인간',180,75,40,77500,15,'00:06:33','2025-11-23 18:10:33'),
(7,7,'매운맛전사',140,48,25,46400,8,'00:02:44','2025-11-22 21:49:00'),
(8,8,'슬라임킬러',110,28,17,15500,3,'00:01:10','2025-11-22 19:11:55'),
(9,9,'최강자',200,90,55,95000,20,'00:08:22','2025-11-23 13:50:32'),
(10,10,'갓생러',170,70,33,53000,13,'00:05:02','2025-11-23 14:21:18'),
(11,12,'준서',100,10,10,957233,0,NULL,NULL),
(12,1,'고영민',101,30,34,69626,7,'00:01:39','2025-11-26 23:32:40');
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_stat_enhance_log
AFTER UPDATE ON characters
FOR EACH ROW
BEGIN
    -- HP 증가
    IF NEW.hp > OLD.hp THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '스탯 강화',
            CONCAT('hp: ', OLD.hp, ' → ', NEW.hp)
        );
    END IF;

    -- ATK 증가
    IF NEW.atk > OLD.atk THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '스탯 강화',
            CONCAT('atk: ', OLD.atk, ' → ', NEW.atk)
        );
    END IF;

    -- DEF 증가
    IF NEW.def > OLD.def THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '스탯 강화',
            CONCAT('def: ', OLD.def, ' → ', NEW.def)
        );
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_save_game_end_log
AFTER UPDATE ON characters
FOR EACH ROW
BEGIN
    -- best_stage가 갱신된 경우 → 로그 기록
    IF NEW.best_stage > OLD.best_stage THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '게임 종료',
            CONCAT(
                'stage:', NEW.best_stage,
                ', time:', TIME_FORMAT(NEW.best_survived_time, '%H:%i:%s'),
                ', gold:', NEW.gold
            )
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `game_config`
--

DROP TABLE IF EXISTS `game_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_category_key` (`category`,`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_config`
--

LOCK TABLES `game_config` WRITE;
/*!40000 ALTER TABLE `game_config` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `game_config` VALUES
(1,'stage','baseMonsterCount','5','2025-11-22 15:54:44'),
(2,'stage','monsterCountIncreasePerStage','2','2025-11-22 15:54:44'),
(3,'stage','baseSpawnDelay','1500','2025-11-22 15:54:44'),
(4,'stage','spawnDelayDecreasePerStage','50','2025-11-22 15:54:44'),
(5,'stage','minSpawnDelay','300','2025-11-22 15:54:44'),
(6,'level','baseExpToLevelUp','10','2025-11-25 07:33:55'),
(7,'level','expGrowthRate','1.15','2025-11-22 15:54:44');
/*!40000 ALTER TABLE `game_config` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `char_id` int(11) unsigned NOT NULL,
  `item_id` int(11) unsigned NOT NULL,
  `equipped` tinyint(3) unsigned DEFAULT 0,
  `auctioned` tinyint(3) unsigned DEFAULT 0,
  PRIMARY KEY (`inventory_id`),
  KEY `item_id` (`item_id`),
  KEY `char_id` (`char_id`),
  KEY `idx_inventoryTBL_char_auction` (`char_id`,`auctioned`),
  KEY `idx_char_id` (`char_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`char_id`) REFERENCES `characters` (`char_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `inventory` VALUES
(1,1,64,1,0),
(2,12,69,1,0),
(3,1,70,0,0),
(4,2,71,1,0),
(5,2,75,0,0),
(6,12,75,0,1),
(7,3,81,1,0),
(8,3,77,1,0),
(9,3,80,0,0),
(10,12,82,0,0),
(11,4,64,1,0),
(12,12,65,0,0),
(13,4,72,0,0),
(14,12,87,0,0),
(15,5,90,0,0),
(16,5,93,0,1),
(17,5,85,0,0),
(18,6,99,1,0),
(19,6,98,1,0),
(20,6,95,0,0),
(21,6,96,0,0),
(22,7,88,1,0),
(23,7,91,0,0),
(24,7,75,0,0),
(25,8,64,1,0),
(26,8,67,0,0),
(27,8,78,0,0),
(28,9,93,1,0),
(29,9,95,1,0),
(30,9,99,0,1),
(31,9,97,0,0),
(32,10,86,1,0),
(33,10,92,0,0),
(34,10,94,0,1),
(35,12,99,0,0),
(36,11,78,0,0),
(37,11,70,0,0),
(38,11,91,0,0),
(39,12,64,0,1),
(40,12,65,0,0),
(41,12,64,0,0),
(187,12,76,0,0),
(188,12,64,0,0),
(189,12,64,0,0),
(190,12,65,0,0),
(191,12,70,0,0),
(192,12,64,0,0),
(193,12,65,0,0),
(194,12,64,0,0),
(195,12,65,0,0),
(196,12,64,0,0),
(197,12,65,0,0),
(198,12,64,0,0),
(199,12,65,0,0),
(200,12,64,0,0),
(201,12,65,0,0),
(202,12,64,0,0),
(203,12,65,0,0),
(204,12,64,0,0),
(205,12,74,0,0),
(206,12,64,0,0),
(207,12,64,0,0),
(208,12,64,0,0),
(209,12,86,0,0),
(210,12,64,0,0),
(211,12,64,0,0),
(212,12,75,0,0),
(213,12,75,0,0),
(214,12,84,0,0),
(215,12,94,0,0),
(216,12,90,0,0),
(217,12,64,0,0),
(218,12,64,0,0),
(219,12,93,0,0),
(220,12,96,0,0),
(221,12,64,0,0),
(222,12,75,0,0),
(223,12,74,0,0),
(224,12,89,0,0),
(225,12,64,0,0),
(226,12,64,0,0),
(227,12,75,0,0),
(228,12,75,0,0),
(229,12,64,0,0),
(230,12,97,0,0),
(231,12,98,0,0),
(232,12,74,0,0),
(233,12,64,0,0),
(234,12,75,0,0),
(235,12,75,0,0),
(236,12,98,0,0),
(237,12,96,0,0),
(238,12,97,0,0),
(239,12,95,0,0),
(240,12,74,0,0),
(241,12,74,0,0),
(242,12,96,0,0),
(243,12,90,0,0),
(244,12,99,0,0),
(245,12,95,0,0),
(246,12,75,0,0),
(247,12,97,0,0),
(248,12,64,0,0),
(249,12,86,0,0),
(250,12,74,0,0),
(251,12,90,0,0),
(252,12,74,0,0),
(253,12,89,0,0),
(254,12,83,0,0),
(255,12,91,0,0),
(256,12,74,0,0),
(257,12,94,0,0),
(258,12,92,0,0),
(259,12,64,0,0),
(260,12,93,0,0),
(261,12,75,0,0),
(262,12,94,0,0),
(263,12,75,0,0),
(264,12,92,0,0),
(265,12,64,0,0),
(266,12,97,0,0),
(267,12,64,0,0),
(268,12,98,0,0),
(269,12,74,0,0),
(270,12,67,0,0),
(271,12,69,0,0),
(272,12,70,0,0),
(273,12,67,0,0),
(274,12,80,0,0),
(275,12,65,0,0),
(276,12,73,0,0),
(277,12,69,0,0),
(278,12,68,0,0),
(279,12,66,0,0),
(280,12,72,0,0),
(281,12,71,0,0),
(282,12,65,0,0),
(283,12,70,0,0);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_inventory_equip_log
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    -- 장착
    IF OLD.equipped = 0 AND NEW.equipped = 1 THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '아이템 장착',
            CONCAT('inventory_id=', NEW.inventory_id)
        );
    END IF;

    -- 해제
    IF OLD.equipped = 1 AND NEW.equipped = 0 THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '아이템 장착 해제',
            CONCAT('inventory_id=', NEW.inventory_id)
        );
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_inventory_buy_log
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    -- 구매한 경우: char_id가 변경됨
    IF OLD.char_id <> NEW.char_id THEN
        INSERT INTO user_logs (char_id, type, action, detail)
        VALUES (
            NEW.char_id,
            'action',
            '아이템 구매',
            CONCAT('inventory_id=', NEW.inventory_id)
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` enum('hat','top','bottom','shoes','gloves','weapon') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `add_hp` int(11) unsigned DEFAULT 0,
  `add_atk` int(11) unsigned DEFAULT 0,
  `add_def` int(11) unsigned DEFAULT 0,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `items` VALUES
(64,'낡은 모자','hat',10,1,1,'1등급 모자'),
(65,'낡은 셔츠','top',10,1,1,'1등급 상의'),
(66,'낡은 바지','bottom',10,1,1,'1등급 하의'),
(67,'낡은 신발','shoes',10,1,1,'1등급 신발'),
(68,'낡은 장갑','gloves',10,1,1,'1등급 장갑'),
(69,'녹슨 칼','weapon',0,5,0,'1등급 무기'),
(70,'천 모자','hat',20,3,2,'2등급 모자'),
(71,'천 셔츠','top',20,3,2,'2등급 상의'),
(72,'천 바지','bottom',20,3,2,'2등급 하의'),
(73,'천 신발','shoes',20,3,2,'2등급 신발'),
(74,'천 장갑','gloves',20,3,2,'2등급 장갑'),
(75,'철 파이프','weapon',0,10,0,'2등급 무기'),
(76,'가죽 모자','hat',35,5,3,'3등급 모자'),
(77,'가죽 재킷','top',35,5,3,'3등급 상의'),
(78,'가죽 바지','bottom',35,5,3,'3등급 하의'),
(79,'가죽 신발','shoes',35,5,3,'3등급 신발'),
(80,'가죽 장갑','gloves',35,5,3,'3등급 장갑'),
(81,'마체테','weapon',0,16,0,'3등급 무기'),
(82,'강화 모자','hat',55,8,4,'4등급 모자'),
(83,'강화 상의','top',55,8,4,'4등급 상의'),
(84,'강화 바지','bottom',55,8,4,'4등급 하의'),
(85,'강화 신발','shoes',55,8,4,'4등급 신발'),
(86,'강화 장갑','gloves',55,8,4,'4등급 장갑'),
(87,'철 검','weapon',0,23,0,'4등급 무기'),
(88,'전투 모자','hat',80,12,6,'5등급 모자'),
(89,'전투 상의','top',80,12,6,'5등급 상의'),
(90,'전투 바지','bottom',80,12,6,'5등급 하의'),
(91,'전투 신발','shoes',80,12,6,'5등급 신발'),
(92,'전투 장갑','gloves',80,12,6,'5등급 장갑'),
(93,'강철 검','weapon',0,31,0,'5등급 무기'),
(94,'전술 모자','hat',110,18,8,'6등급 모자'),
(95,'전술 상의','top',110,18,8,'6등급 상의'),
(96,'전술 바지','bottom',110,18,8,'6등급 하의'),
(97,'전술 신발','shoes',110,18,8,'6등급 신발'),
(98,'전술 장갑','gloves',110,18,8,'6등급 장갑'),
(99,'전술 검','weapon',0,40,0,'6등급 무기');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `monsters`
--

DROP TABLE IF EXISTS `monsters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `monsters` (
  `monster_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `hp` int(11) unsigned NOT NULL DEFAULT 100,
  `atk` int(11) unsigned NOT NULL DEFAULT 10,
  `def` int(11) unsigned NOT NULL DEFAULT 10,
  `speed` int(11) unsigned DEFAULT 100,
  `chance` int(11) NOT NULL,
  PRIMARY KEY (`monster_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monsters`
--

LOCK TABLES `monsters` WRITE;
/*!40000 ALTER TABLE `monsters` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `monsters` VALUES
(1,'Shambler',35,5,1,100,90),
(2,'Rotter',50,7,2,130,80),
(3,'Biter',70,10,3,140,70),
(4,'Walker',120,16,6,150,60),
(5,'Ghoul',160,22,8,160,50),
(6,'Ravager',220,30,12,170,40);
/*!40000 ALTER TABLE `monsters` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `monsters_drops`
--

DROP TABLE IF EXISTS `monsters_drops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `monsters_drops` (
  `drop_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `monster_id` int(11) unsigned DEFAULT NULL,
  `item_id` int(11) unsigned DEFAULT NULL,
  `chance` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`drop_id`),
  KEY `monster_id` (`monster_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `monsters_drops_ibfk_1` FOREIGN KEY (`monster_id`) REFERENCES `monsters` (`monster_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `monsters_drops_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monsters_drops`
--

LOCK TABLES `monsters_drops` WRITE;
/*!40000 ALTER TABLE `monsters_drops` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `monsters_drops` VALUES
(1,1,64,34),
(2,1,65,34),
(3,1,66,34),
(4,1,67,34),
(5,1,68,23),
(6,1,69,23),
(7,2,70,35),
(8,2,71,35),
(9,2,72,35),
(10,2,73,35),
(11,2,74,23),
(12,2,75,23),
(13,3,76,23),
(14,3,77,23),
(15,3,78,23),
(16,3,79,45),
(17,3,80,25),
(18,3,81,35),
(19,4,82,63),
(20,4,83,23),
(21,4,84,23),
(22,4,85,53);
/*!40000 ALTER TABLE `monsters_drops` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `user_logs`
--

DROP TABLE IF EXISTS `user_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `char_id` int(11) unsigned NOT NULL,
  `type` enum('login','action') NOT NULL,
  `action` varchar(100) NOT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `char_id` (`char_id`),
  KEY `idx_user_logs_char` (`char_id`,`created_at`),
  CONSTRAINT `user_logs_ibfk_1` FOREIGN KEY (`char_id`) REFERENCES `characters` (`char_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_logs`
--

LOCK TABLES `user_logs` WRITE;
/*!40000 ALTER TABLE `user_logs` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `user_logs` VALUES
(405,12,'action','게임 종료','stage:3, time:01:01:01, gold:70612','2025-11-26 23:20:32'),
(406,12,'action','아이템 장착 해제','inventory_id=14','2025-11-26 23:22:25'),
(407,12,'action','아이템 장착 해제','inventory_id=40','2025-11-26 23:22:26'),
(408,12,'action','아이템 장착 해제','inventory_id=187','2025-11-26 23:22:27'),
(409,12,'action','아이템 판매 등록','inventory_id=39, price=111','2025-11-26 23:23:31'),
(410,12,'action','아이템 구매','inventory_id=12','2025-11-26 23:24:06'),
(411,12,'action','아이템 장착','inventory_id=2','2025-11-26 23:24:17'),
(412,12,'action','게임 시작',NULL,'2025-11-26 23:24:34'),
(413,12,'action','게임 시작',NULL,'2025-11-26 23:28:12'),
(414,12,'action','게임 시작',NULL,'2025-11-26 23:30:42'),
(415,12,'action','게임 종료','stage:7, time:00:01:39, gold:69626','2025-11-26 23:32:40'),
(416,12,'action','게임 종료','stage:7, time:00:01:39, gold:25','2025-11-26 23:32:40'),
(417,12,'action','게임 시작',NULL,'2025-11-26 23:35:42'),
(418,12,'action','게임 종료','stage:1, time:00:00:38, gold:0','2025-11-26 23:36:22'),
(419,12,'action','게임 시작',NULL,'2025-11-26 23:37:32'),
(420,12,'action','게임 종료','stage:1, time:00:00:52, gold:0','2025-11-26 23:38:24'),
(421,12,'action','게임 시작',NULL,'2025-11-26 23:38:35'),
(422,12,'action','게임 종료','stage:2, time:00:00:51, gold:0','2025-11-26 23:39:33'),
(423,12,'action','게임 시작',NULL,'2025-11-27 20:42:42'),
(424,12,'action','게임 종료','stage:1, time:00:02:43, gold:0','2025-11-27 20:45:31');
/*!40000 ALTER TABLE `user_logs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Temporary table structure for view `v_auction`
--

DROP TABLE IF EXISTS `v_auction`;
/*!50001 DROP VIEW IF EXISTS `v_auction`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_auction` AS SELECT
 1 AS `auction_id`,
  1 AS `price`,
  1 AS `created_at`,
  1 AS `inventory_id`,
  1 AS `item_id`,
  1 AS `seller_id`,
  1 AS `item_name`,
  1 AS `item_type`,
  1 AS `add_hp`,
  1 AS `add_atk`,
  1 AS `add_def`,
  1 AS `seller_name` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_character_equipped_stats`
--

DROP TABLE IF EXISTS `v_character_equipped_stats`;
/*!50001 DROP VIEW IF EXISTS `v_character_equipped_stats`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_character_equipped_stats` AS SELECT
 1 AS `char_id`,
  1 AS `bonusHp`,
  1 AS `bonusAtk`,
  1 AS `bonusDef` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_ranking`
--

DROP TABLE IF EXISTS `v_ranking`;
/*!50001 DROP VIEW IF EXISTS `v_ranking`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_ranking` AS SELECT
 1 AS `char_id`,
  1 AS `nickName`,
  1 AS `maxStage`,
  1 AS `playTime`,
  1 AS `lastPlayed` */;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'rpg_game'
--

--
-- Dumping routines for database 'rpg_game'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buy_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buy_item`(
    IN p_buyer_char_id INT,
    IN p_auction_id INT
)
BEGIN
    DECLARE v_inventory_id INT;
    DECLARE v_seller_char_id INT;
    DECLARE v_price INT;
    DECLARE v_buyer_gold INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Buy item failed';
    END;

    START TRANSACTION;

    SELECT inventory_id, seller_char_id, price
    INTO v_inventory_id, v_seller_char_id, v_price
    FROM auction
    WHERE auction_id = p_auction_id
    FOR UPDATE;

    IF v_inventory_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Auction not found';
    END IF;

    SELECT gold INTO v_buyer_gold
    FROM characters
    WHERE char_id = p_buyer_char_id
    FOR UPDATE;

    IF v_buyer_gold < v_price THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough gold';
    END IF;

    -- buyer gold 감소
    UPDATE characters
    SET gold = gold - v_price
    WHERE char_id = p_buyer_char_id;

    -- seller gold 증가
    UPDATE characters
    SET gold = gold + v_price
    WHERE char_id = v_seller_char_id;

    -- inventory 소유권 변경
    UPDATE inventory
    SET char_id = p_buyer_char_id,
        auctioned = 0
    WHERE inventory_id = v_inventory_id;

    -- auction 삭제
    DELETE FROM auction WHERE auction_id = p_auction_id;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cancel_sell_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cancel_sell_item`(
    IN p_char_id INT,
    IN p_auction_id INT
)
BEGIN
    DECLARE v_inventory_id INT;
    DECLARE v_seller_char_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cancel sell failed';
    END;

    START TRANSACTION;

    SELECT inventory_id, seller_char_id
    INTO v_inventory_id, v_seller_char_id
    FROM auction
    WHERE auction_id = p_auction_id
    FOR UPDATE;

    IF v_inventory_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Auction not found';
    END IF;

    IF v_seller_char_id <> p_char_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not seller';
    END IF;

    -- auction 삭제
    DELETE FROM auction WHERE auction_id = p_auction_id;

    -- 인벤토리 상태 복구
    UPDATE inventory
    SET auctioned = 0
    WHERE inventory_id = v_inventory_id;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_enhance_stat` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_enhance_stat`(
    IN p_char_id INT,
    IN p_stat VARCHAR(10)
)
BEGIN
    DECLARE v_stat INT;          -- 현재 스텟 값
    DECLARE v_gold INT;			 -- 현재 골드
    DECLARE v_required_gold INT; -- 강화에 필요한 골드

	-- SQL 에러 공통 처리 핸들러
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Enhance stat failed';
    END;
    
    -- SQL 인젝션 방지
    IF p_stat NOT IN ('hp', 'atk', 'def') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid stat';
    END IF;

    START TRANSACTION;
    SELECT gold,
           CASE 
               WHEN p_stat = 'hp' THEN hp
               WHEN p_stat = 'atk' THEN atk
               WHEN p_stat = 'def' THEN def
           END
    INTO v_gold, v_stat
    FROM characters
    WHERE char_id = p_char_id
    FOR UPDATE; -- row 잠궈서 경쟁조건 막기 (강화 버튼 계속 누를 시에)

    SET v_required_gold = v_stat * 10;

    IF v_gold < v_required_gold THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough gold';
    END IF;

	-- 스텟 1증가
    SET v_stat = v_stat + 1;

	-- 스텟 업데이트
    UPDATE characters
	SET 
		hp  = CASE WHEN p_stat = 'hp'  THEN v_stat ELSE hp  END,
		atk = CASE WHEN p_stat = 'atk' THEN v_stat ELSE atk END,
		def = CASE WHEN p_stat = 'def' THEN v_stat ELSE def END,
		gold = gold - v_required_gold
	WHERE char_id = p_char_id;
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_equip_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_equip_item`(
    IN p_char_id INT,
    IN p_inventory_id INT,
    IN p_equip TINYINT
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_type VARCHAR(50);
    DECLARE v_auctioned TINYINT;

    /*DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Equip item failed';
    END;*/

    START TRANSACTION;

    -- (1) 인벤토리 + 아이템 타입 + 경매 상태를 한 번에 조회 (가장 안전한 방식)
    SELECT inv.item_id, it.type, inv.auctioned
    INTO v_item_id, v_type, v_auctioned
    FROM inventory inv
    JOIN items it ON inv.item_id = it.item_id
    WHERE inv.inventory_id = p_inventory_id
      AND inv.char_id = p_char_id
    FOR UPDATE;

    -- (2) 소유권 검증
    IF v_item_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid inventory or no permission';
    END IF;

    -- (3) 경매 아이템 장착 불가
    IF v_auctioned = 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot equip an auctioned item';
    END IF;

    -- (4) 장착 처리
    IF p_equip = 1 THEN

        -- 기존 장착 해제
        UPDATE inventory inv
        JOIN items it ON inv.item_id = it.item_id
        SET inv.equipped = 0
        WHERE inv.char_id = p_char_id
          AND it.type = v_type
          AND inv.equipped = 1;

        -- 새 장착
        UPDATE inventory
        SET equipped = 1
        WHERE inventory_id = p_inventory_id
          AND char_id = p_char_id;

    ELSEIF p_equip = 0 THEN

        UPDATE inventory
        SET equipped = 0
        WHERE inventory_id = p_inventory_id
          AND char_id = p_char_id;

    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid equipped value';
    END IF;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_save_game` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_save_game`(
    IN p_char_id INT,
    IN p_stage INT,
    IN p_kills INT,
    IN p_survival_time TIME,  
    IN p_gold_earned INT,
    IN p_rewards JSON
)
BEGIN
    DECLARE v_old_best INT;
    DECLARE v_max_kills_possible INT;
    DECLARE v_min_kills_possible INT;
    DECLARE v_base_monster INT;
    DECLARE v_increase_monster INT;

    DECLARE v_reward_count INT;
    DECLARE v_idx INT;
    DECLARE v_item_id INT;
    DECLARE v_item_exists INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- 기본 검증
    IF p_stage IS NULL OR p_stage < 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid stage value';
    END IF;

    IF p_survival_time IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid survival time';
    END IF;

    IF p_gold_earned IS NULL OR p_gold_earned < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid gold earned';
    END IF;

    IF p_kills IS NULL OR p_kills < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid kills value';
    END IF;

    START TRANSACTION;

    -- 설정 조회
    SELECT config_value INTO v_base_monster
    FROM game_config
    WHERE config_key = 'baseMonsterCount';

    SELECT config_value INTO v_increase_monster
    FROM game_config
    WHERE config_key = 'monsterCountIncreasePerStage';

    IF v_base_monster IS NULL OR v_increase_monster IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Game config not found';
    END IF;

    -- 누적 몬스터 수 계산
    SET v_max_kills_possible = v_base_monster * p_stage
        + v_increase_monster * ((p_stage - 1) * p_stage) / 2;

    IF p_stage = 1 THEN
        SET v_min_kills_possible = 0;
    ELSE
        SET v_min_kills_possible = v_base_monster * (p_stage - 1)
            + v_increase_monster * ((p_stage - 2) * (p_stage - 1)) / 2;
    END IF;

    IF p_kills < v_min_kills_possible OR p_kills > v_max_kills_possible THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Invalid stage or illegal kill count';
    END IF;

    -- 캐릭터 락
    SELECT best_stage INTO v_old_best
    FROM characters
    WHERE char_id = p_char_id
    FOR UPDATE;

    -- 캐릭터 업데이트
    UPDATE characters
    SET 
        best_stage = IF(v_old_best < p_stage, p_stage, best_stage),
        best_survived_time = IF(v_old_best < p_stage, p_survival_time, best_survived_time),
        best_played_date = IF(v_old_best < p_stage, NOW(), best_played_date),
        gold = gold + p_gold_earned
    WHERE char_id = p_char_id;

    -- JSON 보상 처리
    IF p_rewards IS NOT NULL AND JSON_LENGTH(p_rewards) > 0 THEN
        SET v_reward_count = JSON_LENGTH(p_rewards);
        SET v_idx = 0;

        WHILE v_idx < v_reward_count DO
            SET v_item_id = CAST(
                JSON_UNQUOTE(JSON_EXTRACT(p_rewards, CONCAT('$[', v_idx, ']')))
                AS UNSIGNED
            );

            SELECT COUNT(*) INTO v_item_exists
            FROM items
            WHERE item_id = v_item_id;

            IF v_item_exists > 0 THEN
                INSERT INTO inventory (char_id, item_id, equipped, auctioned)
                VALUES (p_char_id, v_item_id, 0, 0);
            ELSE
				SIGNAL SQLSTATE '45000' 
					SET MESSAGE_TEXT = ' does not exist items';
            END IF;

            SET v_idx = v_idx + 1;
        END WHILE;
    END IF;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_sell_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sell_item`(
    IN p_char_id INT,
    IN p_inventory_id INT,
    IN p_price INT
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_auctioned INT;
    DECLARE v_equipped INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sell item failed';
    END;

    START TRANSACTION;

    -- (1) 가격 검증
    IF p_price IS NULL OR p_price <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid price';
    END IF;

    -- (2) 소유권, 경매상태 확인
    SELECT item_id, auctioned, equipped
	INTO v_item_id, v_auctioned, v_equipped
    FROM inventory
    WHERE inventory_id = p_inventory_id
      AND char_id      = p_char_id
    FOR UPDATE;

	-- (3) 아이템 존재 하지 않음
    IF v_item_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item not found';
    END IF;
	-- (3) 아이템이 이미 거래소에 등록
    IF v_auctioned = 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item already auctioned';
    END IF;
    -- (3) 장착 상태 판매 금지
    IF v_equipped = 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Equipped item cannot be sold';
    END IF;

    -- (4) 중복 경매 등록 방지
    IF EXISTS (SELECT 1 FROM auction WHERE inventory_id = p_inventory_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate auction entry';
    END IF;

    -- (5) 경매 등록
    INSERT INTO auction (inventory_id, price, seller_char_id, created_at)
    VALUES (p_inventory_id, p_price, p_char_id, NOW());

    -- (6) 인벤토리 상태 변경
    UPDATE inventory
       SET auctioned = 1
     WHERE inventory_id = p_inventory_id;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_auction`
--

/*!50001 DROP VIEW IF EXISTS `v_auction`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_auction` AS select `a`.`auction_id` AS `auction_id`,`a`.`price` AS `price`,`a`.`created_at` AS `created_at`,`inv`.`inventory_id` AS `inventory_id`,`inv`.`item_id` AS `item_id`,`inv`.`char_id` AS `seller_id`,`it`.`name` AS `item_name`,`it`.`type` AS `item_type`,`it`.`add_hp` AS `add_hp`,`it`.`add_atk` AS `add_atk`,`it`.`add_def` AS `add_def`,`ch`.`name` AS `seller_name` from (((`auction` `a` join `inventory` `inv` on(`a`.`inventory_id` = `inv`.`inventory_id`)) join `items` `it` on(`inv`.`item_id` = `it`.`item_id`)) join `characters` `ch` on(`inv`.`char_id` = `ch`.`char_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_character_equipped_stats`
--

/*!50001 DROP VIEW IF EXISTS `v_character_equipped_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_character_equipped_stats` AS select `inv`.`char_id` AS `char_id`,ifnull(sum(`i`.`add_hp`),0) AS `bonusHp`,ifnull(sum(`i`.`add_atk`),0) AS `bonusAtk`,ifnull(sum(`i`.`add_def`),0) AS `bonusDef` from (`inventory` `inv` join `items` `i` on(`inv`.`item_id` = `i`.`item_id`)) where `inv`.`equipped` = 1 group by `inv`.`char_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_ranking`
--

/*!50001 DROP VIEW IF EXISTS `v_ranking`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_ranking` AS select `c`.`char_id` AS `char_id`,`c`.`name` AS `nickName`,`c`.`best_stage` AS `maxStage`,date_format(`c`.`best_survived_time`,'%Hh:%im:%ss') AS `playTime`,`c`.`best_played_date` AS `lastPlayed` from `characters` `c` order by `c`.`best_stage` desc,`c`.`gold` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-28 15:50:18
