-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: burekas_menu
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aktsiya`
--

DROP TABLE IF EXISTS `aktsiya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aktsiya` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_tovara` int DEFAULT NULL,
  `id_kategorii` int DEFAULT NULL,
  `procent_skidki` int NOT NULL,
  `aktiv` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  KEY `kategori_id_idx` (`id_kategorii`),
  KEY `tovar_id_idx` (`id_tovara`),
  CONSTRAINT `kategori_id` FOREIGN KEY (`id_kategorii`) REFERENCES `kategorii` (`ID`),
  CONSTRAINT `tovar_id` FOREIGN KEY (`id_tovara`) REFERENCES `menu` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aktsiya`
--

LOCK TABLES `aktsiya` WRITE;
/*!40000 ALTER TABLE `aktsiya` DISABLE KEYS */;
INSERT INTO `aktsiya` VALUES (2,'скидка на десерты ',NULL,3,54,1),(3,'234',NULL,3,32,1),(4,'аы',102,NULL,3,1),(5,'23',94,NULL,2,1),(6,'23кв',98,NULL,21,1);
/*!40000 ALTER TABLE `aktsiya` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avtorizaciya`
--

DROP TABLE IF EXISTS `avtorizaciya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avtorizaciya` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Pass` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avtorizaciya`
--

LOCK TABLES `avtorizaciya` WRITE;
/*!40000 ALTER TABLE `avtorizaciya` DISABLE KEYS */;
INSERT INTO `avtorizaciya` VALUES (1,'ad','$2b$10$bN7EXrzQK6Hke1OaMEAwbex1CCOyQ2D6BSM3T5/dIL2UR.EW8Zpc6',1),(2,'Vasa','$2b$10$aDWSDipBXmx5wjuwi4mJbu3vFCRQ5dkldPzjPS/aGodf1lpJO8VZa',0),(3,'Viktor','$2b$10$hmlYBVYAkl0l.Ts86YZleOgqpBLb9he7eO/QvH89BFI1O5yqb8q9O',1),(4,'Test','$2b$10$rw9bIMf0f17w0Esx0O6fE.Pjo3Kt9M8HmeoAmWGQchRz2R.xfTFxy',0),(5,'sosa','$2b$10$uF5r3Dc09MnCfAHqgSWxQuVZvT.I2/9BYV2xxyVb4u4svTVNWyz0m',0),(6,'Admin','$2b$10$Lr9v/8Fqx.c0I.MCVZ5BpORX6qjmzolMh/SXfB2g7EAK7S1l.bGtS',1),(8,'Vasek ','$2b$10$wh7Eip7fvWm28oFb0LTOP.P9Dd7Zt8ztuOMB5X5hxgGyHcqsJv4xm',0);
/*!40000 ALTER TABLE `avtorizaciya` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Opisanie` text COLLATE utf8mb4_unicode_ci,
  `Izobrazhenie` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Data_nachala` date NOT NULL,
  `Data_okonchaniya` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Скидка 20% на десерты','Акция действует по будням','sale.jpg','2026-04-01','2026-04-30'),(7,'фывс','фыс','','2026-05-07','2026-05-09'),(17,'ау','уца','1778588764003-Ð¡Ð½Ð¸Ð¼Ð¾Ðº ÑÐºÑÐ°Ð½Ð° 2026-05-11 144103.png','2026-05-01','2026-05-14');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategorii`
--

DROP TABLE IF EXISTS `kategorii`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategorii` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `nazvanie_kategorii` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategorii`
--

LOCK TABLES `kategorii` WRITE;
/*!40000 ALTER TABLE `kategorii` DISABLE KEYS */;
INSERT INTO `kategorii` VALUES (1,'Безалкогольные напитки'),(2,'Гарниры'),(3,'Десерты'),(4,'Детское меню'),(5,'Завтраки'),(6,'Закуски'),(7,'Кофе'),(8,'Курица'),(9,'Лимонады'),(10,'Мороженое'),(11,'Мясо'),(12,'Рыба'),(13,'Салаты'),(14,'Смузи'),(15,'Соусы'),(16,'Супы'),(17,'Чай');
/*!40000 ALTER TABLE `kategorii` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_kategorii` int NOT NULL,
  `Name_blyuda` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Opisanie` text COLLATE utf8mb4_unicode_ci,
  `Foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default.jpg',
  `Price` decimal(10,2) NOT NULL,
  `aktiv` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  KEY `idx_blyuda_kategoriya` (`ID_kategorii`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`ID_kategorii`) REFERENCES `kategorii` (`ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,1,'Вода минеральная 0,5 л','','default.jpg',80.00,1),(2,1,'Кока-Кола / Спрайт / Фанта 0,5 л','','default.jpg',100.00,1),(3,1,'Сок в стакане 200 мл','','default.jpg',90.00,1),(4,1,'Сок Добрый / Рич 1 л','','default.jpg',220.00,1),(5,1,'Морс ягодный 1 л','','default.jpg',380.00,1),(6,1,'Морс ягодный 200 мл','','default.jpg',90.00,1),(7,1,'Лимонад фирменный Махито','','default.jpg',260.00,1),(8,1,'Лимонад Арбуз','','arbuz.jpg',260.00,1),(9,1,'Милкшейк Клубничный','','default.jpg',290.00,1),(10,1,'Смузи фруктово-ягодный','','default.jpg',340.00,1),(11,2,'Картофель фри','','default.jpg',190.00,1),(12,2,'Картофельные дольки','','default.jpg',200.00,1),(13,2,'Картофель отварной','','default.jpg',130.00,1),(14,2,'Рис отварной','','default.jpg',130.00,1),(15,2,'Гречка','','default.jpg',130.00,1),(16,2,'Овощи-гриль','','default.jpg',250.00,1),(17,2,'Булгур с овощами','','default.jpg',180.00,1),(18,3,'Тирамису порционный','','default.jpg',280.00,1),(19,3,'Медовик порционный','','default.jpg',290.00,1),(20,3,'Чизкейк Нью-Йорк','','default.jpg',320.00,1),(21,3,'Эклер','','default.jpg',180.00,1),(22,3,'Профитроли 3 шт','','default.jpg',190.00,1),(23,3,'Панна-котта с ягодами','','default.jpg',260.00,1),(24,4,'Куриные наггетсы с картошкой фри','','default.jpg',290.00,1),(25,4,'Макароны с сосиской','','default.jpg',220.00,1),(26,4,'Мини-шашлычок куриный','','default.jpg',250.00,1),(27,5,'Шакшука с беконом','','default.jpg',340.00,1),(28,5,'Омлет с ветчиной и сыром','','default.jpg',280.00,1),(29,5,'Израильский завтрак','','default.jpg',420.00,1),(30,6,'Жульен с курицей и грибами','','default.jpg',340.00,1),(31,6,'Кольца кальмара в кляре','','default.jpg',390.00,1),(32,6,'Крылышки Баффало','','default.jpg',420.00,1),(33,6,'Фалафель (6 шт)','','default.jpg',320.00,1),(34,6,'Хумус с питой','','default.jpg',290.00,1),(35,6,'Фаршмак','','default.jpg',280.00,1),(36,6,'Сырные шарики','','default.jpg',350.00,1),(37,7,'Кофе Эспрессо','','default.jpg',150.00,1),(38,7,'Кофе Двойной Эспрессо','','default.jpg',190.00,1),(39,7,'Кофе Американо','','default.jpg',170.00,1),(40,7,'Кофе Капучино','','default.jpg',200.00,1),(41,7,'Кофе Капучино XXL','','default.jpg',280.00,1),(42,7,'Кофе Латте','','default.jpg',230.00,1),(43,7,'Кофе Латте с сиропом','','default.jpg',250.00,1),(44,7,'Кофе Флэт Уайт','','default.jpg',240.00,1),(45,7,'Кофе Раф','','default.jpg',280.00,1),(46,7,'Кофе Глясе','','default.jpg',290.00,1),(47,7,'Айс-кофе Капучино','','default.jpg',270.00,1),(48,7,'Айс-кофе Солёная карамель','','default.jpg',290.00,1),(49,7,'Айс-кофе Мохито','','default.jpg',280.00,1),(50,7,'Арабский кофе с кардамоном','','default.jpg',280.00,1),(51,7,'Кофе По-питерски','','default.jpg',260.00,1),(52,7,'Сироп (10 мл)','','default.jpg',40.00,1),(53,7,'Сироп (20 мл)','','default.jpg',70.00,1),(54,7,'Топинг','','default.jpg',50.00,1),(55,8,'Курица в кисло-сладком соусе с ананасом','','default.jpg',420.00,1),(56,8,'Курочка Карри','','default.jpg',410.00,1),(57,8,'Шницель куриный','','default.jpg',390.00,1),(58,8,'Люля-кебаб из курицы','','default.jpg',430.00,1),(59,8,'Куриный шашлык','','default.jpg',450.00,1),(60,9,'Лимонад Классический','','default.jpg',250.00,1),(61,9,'Лимонад Тархун','','default.jpg',260.00,1),(62,10,'Мороженое пломбир 100 г','','default.jpg',120.00,1),(63,10,'Мороженое с топингом','','default.jpg',180.00,1),(64,11,'Свинина По-азиатски','','default.jpg',490.00,1),(65,11,'Шашлык свиной','','default.jpg',520.00,1),(66,11,'Свиные рёбра Барбекю','','default.jpg',580.00,1),(67,11,'Эсик-флейш (говядина кисло-сладкая)','','default.jpg',540.00,1),(68,11,'Говядина По-мароккански с хумусом','','default.jpg',560.00,1),(69,12,'Палтус Дальневосточный с овощами','','default.jpg',620.00,1),(70,12,'Кета в маринаде','','default.jpg',480.00,1),(71,12,'Филе минтая с овощными крокетами','','default.jpg',390.00,1),(72,12,'Кальмары в соусе Том-Ям','','default.jpg',480.00,1),(73,13,'Салат Цезарь с курицей','','default.jpg',450.00,1),(74,13,'Салат Цезарь с креветками','','default.jpg',580.00,1),(75,13,'Салат Греческий','','salat_grek.jpg',410.00,1),(76,13,'Салат Теплый с печенью','','default.jpg',430.00,1),(77,13,'Салат Табуле','','default.jpg',360.00,1),(78,13,'Салат Нисуаз с тунцом','','default.jpg',520.00,1),(79,13,'Салат с телятиной','','default.jpg',540.00,1),(80,13,'Фаршмак с креветочными чипсами','','default.jpg',390.00,1),(81,13,'Салат Хумус с овощами','','default.jpg',350.00,1),(82,14,'Смузи Клубника-банан','','default.jpg',340.00,1),(83,14,'Смузи Манго-маракуйя','','default.jpg',360.00,1),(84,15,'Соус Тартар 50 г','','default.jpg',70.00,1),(85,15,'Майонез 50 г','','default.jpg',40.00,1),(86,15,'Кетчуп 50 г','','default.jpg',40.00,1),(87,15,'Чесночный соус 50 г','','default.jpg',60.00,1),(88,16,'Суп Том-Ям с морепродуктами','','default.jpg',480.00,1),(89,16,'Суп Том-Ям мини-порция','','default.jpg',280.00,1),(90,16,'Солянка мясная сборная','','default.jpg',420.00,1),(91,16,'Крем-суп из шампиньонов','','default.jpg',320.00,1),(92,16,'Уха из палтуса и кеты','','default.jpg',460.00,1),(93,16,'Харчо с говядиной','','default.jpg',390.00,1),(94,16,'Лагман','','default.jpg',410.00,1),(95,17,'Чай чёрный / зелёный 400 мл','','default.jpg',130.00,1),(96,17,'Чай облепиховый 1 л','','default.jpg',420.00,1),(97,17,'Чай имбирный 700 мл','','default.jpg',380.00,1),(98,17,'Чай молочный оолонг','','default.jpg',280.00,1),(99,17,'Чай Пряный апельсин','','default.jpg',260.00,1),(100,17,'Чай Таёжный','','default.jpg',290.00,1),(101,17,'Чай с чабрецом и мятой','','default.jpg',160.00,1),(102,17,'Мёд 20 г','','default.jpg',50.00,1),(103,17,'Лимон (долька)','','default.jpg',30.00,1),(112,11,'Ыыы','','1778320359752-17783203438688873526707064919123.jpg',656.00,1);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otzyvy`
--

DROP TABLE IF EXISTS `otzyvy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otzyvy` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `Otzyv` text COLLATE utf8mb4_unicode_ci,
  `Photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Grade` int NOT NULL,
  `ver` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `user_id_key_idx` (`id_user`),
  CONSTRAINT `user_id_key` FOREIGN KEY (`id_user`) REFERENCES `avtorizaciya` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otzyvy`
--

LOCK TABLES `otzyvy` WRITE;
/*!40000 ALTER TABLE `otzyvy` DISABLE KEYS */;
INSERT INTO `otzyvy` VALUES (1,1,'Очень вкусно!','',5,1),(2,4,'шикарно',NULL,4,1),(7,6,'что ',NULL,3,1),(9,6,'э','1778671899800-Ð¡Ð½Ð¸Ð¼Ð¾Ðº ÑÐºÑÐ°Ð½Ð° 2026-05-08 004132.png',3,1);
/*!40000 ALTER TABLE `otzyvy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_info`
--

DROP TABLE IF EXISTS `personal_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_info` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Adres` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FIO` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `use_id_idx` (`id_user`),
  CONSTRAINT `use_id` FOREIGN KEY (`id_user`) REFERENCES `avtorizaciya` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_info`
--

LOCK TABLES `personal_info` WRITE;
/*!40000 ALTER TABLE `personal_info` DISABLE KEYS */;
INSERT INTO `personal_info` VALUES (1,'ул. Пионерская, д. 15, кв. 3','89158237584','Иванов Иван Иванович',1),(2,'ул. Пушкина д.18. кв 1','+79148247584','Сусанин Игорь Васильевич',2),(3,'ул. Тест','+791589147733','Виктор ',3),(4,'fds','+80124832151','basd',4),(5,'фвыв','128974','Виктор иванович',5),(6,'','-','Администратор',6),(8,'Ул. Пушкина д15. Кв.2','891238565','Василий Федорович Сусанин',8);
/*!40000 ALTER TABLE `personal_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poziciya_v_zakaze`
--

DROP TABLE IF EXISTS `poziciya_v_zakaze`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poziciya_v_zakaze` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_zakaza` int NOT NULL,
  `ID_blyuda` int NOT NULL,
  `Kolichestvo` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Summa` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_poziciya_zakaz` (`ID_zakaza`),
  KEY `idx_poziciya_blyudo` (`ID_blyuda`),
  CONSTRAINT `poziciya_v_zakaze_ibfk_1` FOREIGN KEY (`ID_zakaza`) REFERENCES `zakaz` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `poziciya_v_zakaze_ibfk_2` FOREIGN KEY (`ID_blyuda`) REFERENCES `menu` (`ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poziciya_v_zakaze`
--

LOCK TABLES `poziciya_v_zakaze` WRITE;
/*!40000 ALTER TABLE `poziciya_v_zakaze` DISABLE KEYS */;
INSERT INTO `poziciya_v_zakaze` VALUES (4,9,8,1,260.00,260.00),(5,9,7,1,260.00,260.00),(6,10,2,1,100.00,100.00),(7,10,8,2,260.00,520.00),(8,11,8,1,260.00,260.00),(9,11,1,1,80.00,80.00),(10,12,1,1,80.00,80.00),(11,12,2,2,100.00,200.00),(12,13,112,2,656.00,1312.00),(13,14,22,1,87.40,87.40),(14,14,23,1,119.60,119.60),(15,15,8,1,260.00,260.00),(16,15,5,1,380.00,380.00),(17,16,8,3,260.00,780.00),(18,17,1,1,80.00,80.00),(19,18,1,1,80.00,80.00),(20,18,8,1,260.00,260.00),(21,18,29,1,420.00,420.00),(22,19,28,1,280.00,280.00),(23,19,27,1,340.00,340.00),(24,20,2,1,100.00,100.00),(25,20,8,1,260.00,260.00),(26,21,15,11,130.00,1430.00),(27,21,13,1,130.00,130.00);
/*!40000 ALTER TABLE `poziciya_v_zakaze` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zakaz`
--

DROP TABLE IF EXISTS `zakaz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zakaz` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `personal_id` int NOT NULL,
  `Summa_zakaza` decimal(10,2) NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Data` datetime NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `per_id_idx` (`personal_id`),
  CONSTRAINT `per_id` FOREIGN KEY (`personal_id`) REFERENCES `personal_info` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zakaz`
--

LOCK TABLES `zakaz` WRITE;
/*!40000 ALTER TABLE `zakaz` DISABLE KEYS */;
INSERT INTO `zakaz` VALUES (3,5,360.00,'выбор блюд-архив','2026-05-03 23:54:30'),(4,5,100.00,'выбор блюд-архив','2026-05-03 23:55:50'),(5,5,100.00,'выбор блюд-архив','2026-05-03 23:58:59'),(6,5,260.00,'выбор блюд-архив','2026-05-04 00:08:12'),(7,5,260.00,'выбор блюд-архив','2026-05-04 00:08:34'),(8,5,780.00,'выбор блюд-архив','2026-05-04 00:08:42'),(9,4,520.00,'выбор блюд-архив','2026-05-04 17:54:44'),(10,4,620.00,'выбор блюд-архив','2026-05-04 17:56:33'),(11,4,340.00,'выбор блюд-архив','2026-05-04 17:57:46'),(12,5,280.00,'выбор блюд-архив','2026-05-09 19:47:46'),(13,6,1312.00,'Новый-архив','2026-05-09 19:54:55'),(14,6,207.00,'Готов-архив','2026-05-11 19:50:49'),(15,6,640.00,'выбор блюд-архив','2026-05-13 21:13:42'),(16,6,780.00,'Новый-архив','2026-05-13 21:15:30'),(17,6,80.00,'Новый-архив','2026-05-13 21:56:15'),(18,8,760.00,'Новый-архив','2026-05-13 22:31:31'),(19,8,620.00,'Новый-архив','2026-05-13 22:32:30'),(20,6,360.00,'Новый','2026-05-13 23:52:05'),(21,8,1560.00,'Новый','2026-05-14 13:47:46');
/*!40000 ALTER TABLE `zakaz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'burekas_menu'
--

--
-- Dumping routines for database 'burekas_menu'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 20:30:35
