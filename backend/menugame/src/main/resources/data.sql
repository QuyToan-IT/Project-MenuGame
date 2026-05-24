-- Tạm thời tắt kiểm tra khóa ngoại để tránh crash khi chạy lệnh DROP TABLE
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────────────────────────────────
-- 1. CẤU TRÚC VÀ DỮ LIỆU: BẢNG THỂ LOẠI (CATEGORIES)
-- ──────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categories` (`id`, `description`, `name`) VALUES 
(1, 'Thể loại game tập trung vào các thử thách thể chất, đòi hỏi phản xạ nhanh, sự phối hợp tay mắt và kỹ năng chiến đấu của người chơi.', 'Hành động'),
(2, 'Trò chơi đòi hỏi tư duy logic, khả năng quy hoạch tài nguyên và đưa ra các quyết định chiến lược để đánh bại đối thủ.', 'Chiến thuật'),
(3, 'Các tựa game đấu súng góc nhìn thứ nhất hoặc thứ ba, tập trung vào kỹ năng ngắm bắn, phản xạ và khả năng phối hợp đồng đội.', 'Bắn súng'),
(4, 'Người chơi hóa thân vào một nhân vật trong thế giới giả tưởng, thực hiện nhiệm vụ, tăng cấp và phát triển cốt truyện theo ý muốn.', 'Nhập vai'),
(5, 'Mô phỏng các môn thể thao thực tế như bóng đá, bóng rổ, đua xe, mang lại trải nghiệm thi đấu chân thực và kịch tính.', 'Thể thao'),
(6, 'Tập trung vào hành trình khám phá thế giới trò chơi, giải các câu đố và trải nghiệm cốt truyện sâu sắc.', 'Phiêu lưu'),
(7, 'Mang lại cảm giác hồi hộp, sợ hãi thông qua bầu không khí u tối, cốt truyện ly kỳ và các yếu tố bất ngờ.', 'Kinh dị'),
(8, 'Các phầm mềm hỗ trợ người dùng', 'Khác');


-- ──────────────────────────────────────────────────────────────────────────
-- 2. CẤU TRÚC VÀ DỮ LIỆU: BẢNG TRÒ CHƠI (GAMES)
-- ──────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `icon_url` varchar(500) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('OFFLINE','ONLINE','OTHERS') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `games` (`id`, `icon_url`, `name`, `type`) VALUES 
(1, 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/aeddf86348891bd4bc12509db175d0cccb8b8c02-837x469.jpg?accountingTag=LoL', 'Liên Minh Huyền Thoại', 'ONLINE'),
(15, 'https://cdn2.steamgriddb.com/icon/9e82757e9a1c12cb710ad680db11f6f1.png', 'Valorant', 'ONLINE'),
(16, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXVIF_Dk5lR8MrlpA8Pu8DuYW07dcF5sBpw&s', 'EA SPORTS FC Online', 'ONLINE'),
(17, 'https://psnobj.prod.dl.playstation.net/psnobj/NPWR34992_00/61830ea4-0722-4ad5-95cc-f313135de0b4.png', 'Black Myth: Wukong', 'OFFLINE'),
(18, 'https://cdn2.steamgriddb.com/icon/0cf3631c283b4879e297fc213535dc12.ico', 'Elden Ring', 'OFFLINE'),
(19, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNr7YaPhPM1Ef8GR54zrhntAerCh-F-YGEBw&s', 'Grand Theft Auto V', 'OFFLINE'),
(20, 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg', 'Discord', 'OTHERS'),
(21, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/3840px-Steam_icon_logo.svg.png?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=thumbnail', 'Steam', 'OTHERS'),
(22, 'https://i.pinimg.com/736x/92/35/9e/92359e1d35b2e7478b00cd82ee200d5f.jpg', 'Garena', 'OTHERS'),
(23, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Roblox_%282025%29_%28App_Icon%29.svg/960px-Roblox_%282025%29_%28App_Icon%29.svg.png', 'Roblox', 'ONLINE');


-- ──────────────────────────────────────────────────────────────────────────
-- 3. CẤU TRÚC VÀ DỮ LIỆU: BẢNG TRUNG GIAN LIÊN KẾT (GAME_CATEGORY)
-- ──────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `game_category`;
CREATE TABLE `game_category` (
  `category_id` bigint NOT NULL,
  `game_id` bigint NOT NULL,
  `category_order` int NOT NULL,
  PRIMARY KEY (`category_id`,`game_id`),
  KEY `FK4ly2sfxnn6bcxdtn072p4cn2x` (`game_id`),
  CONSTRAINT `FK4ly2sfxnn6bcxdtn072p4cn2x` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`),
  CONSTRAINT `FK9yhrugr15egaskau0qos43hot` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `game_category_chk_1` CHECK ((`category_order` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `game_category` (`category_id`, `game_id`, `category_order`) VALUES 
(1, 15, 1), (1, 17, 0), (1, 18, 1), (1, 19, 1), (1, 23, 1),
(2, 1, 0),  (2, 23, 6),
(3, 15, 0), (3, 23, 2),
(4, 17, 1), (4, 18, 0), (4, 19, 2), (4, 23, 0),
(5, 16, 0), (5, 23, 5),
(6, 17, 2), (6, 18, 2), (6, 19, 0), (6, 23, 3),
(7, 23, 4),
(8, 20, 0), (8, 21, 0), (8, 22, 0);


-- Bật lại cơ chế kiểm tra ràng buộc khóa ngoại như ban đầu
SET FOREIGN_KEY_CHECKS = 1;