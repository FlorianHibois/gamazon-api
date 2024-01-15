-- DROP THE DATABASE FOR TESTS
DROP DATABASE IF EXISTS gamazon;

-- CREATING DATABASE
CREATE DATABASE IF NOT EXISTS gamazon;

-- USING DATABASE
USE gamazon;

-- CREATING TABLE FOR PERMISSIONS
CREATE TABLE IF NOT EXISTS permission
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    description       VARCHAR(50) NOT NULL,
    creation_date     DATETIME    NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL        NOT NULL DEFAULT 1
);

-- CREATING TABLE FOR USERS
CREATE TABLE IF NOT EXISTS user
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_permission     INT UNSIGNED,
    user_name         VARCHAR(50) UNIQUE NOT NULL,
    password          VARCHAR(255)       NOT NULL,
    image             TEXT,
    creation_date     DATETIME           NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL               NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_permission FOREIGN KEY (id_permission) REFERENCES permission (id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX ix_user_name (user_name)
);

-- CREATING TABLE FOR COMPANIES
CREATE TABLE IF NOT EXISTS company
(
    id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                  VARCHAR(50) NOT NULL,
    company_creation_date DATE,
    image                 TEXT,
    creation_date         DATETIME    NOT NULL DEFAULT NOW(),
    modification_date     DATETIME,
    active                BOOL        NOT NULL DEFAULT 1,
    INDEX ix_company_name (name)
);

-- CREATING TABLE FOR GAMES
CREATE TABLE IF NOT EXISTS classification
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(30) NOT NULL,
    image             TEXT,
    creation_date     DATETIME    NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL        NOT NULL DEFAULT 1
);

-- CREATING TABLE FOR GENRES
CREATE TABLE IF NOT EXISTS genre
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(50) NOT NULL,
    creation_date     DATETIME    NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL        NOT NULL DEFAULT 1
);

-- CREATING TABLE FOR PLATFORMS
CREATE TABLE IF NOT EXISTS platform
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(30) NOT NULL,
    image             TEXT,
    creation_date     DATETIME    NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL        NOT NULL DEFAULT 1
);

-- CREATING TABLE FOR GAMES
CREATE TABLE IF NOT EXISTS game
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_prequel        INT UNSIGNED,
    id_sequel         INT UNSIGNED,
    id_classification INT UNSIGNED,
    name              VARCHAR(100) NOT NULL,
    release_date      DATE,
    image             TEXT,
    creation_date     DATETIME     NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL         NOT NULL DEFAULT 1,
    CONSTRAINT fk_game_classification FOREIGN KEY (id_classification) REFERENCES classification (id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_game_prequel FOREIGN KEY (id_prequel) REFERENCES game (id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_game_sequel FOREIGN KEY (id_sequel) REFERENCES game (id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- CREATING TABLE FOR RATINGS BETWEEN USERS AND GAMES
CREATE TABLE IF NOT EXISTS rating
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_game           INT UNSIGNED,
    id_user           INT UNSIGNED,
    rate              DECIMAL(4, 2) NOT NULL,
    message           TEXT          NOT NULL,
    creation_date     DATETIME      NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL          NOT NULL DEFAULT 1,
    CONSTRAINT UNIQUE uc_game_user (id_game, id_user),
    CONSTRAINT fk_rating_game FOREIGN KEY (id_game) REFERENCES game (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_rating_user FOREIGN KEY (id_user) REFERENCES user (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREATING TABLE FOR FAVORITES BETWEEN USERS AND GAMES
CREATE TABLE IF NOT EXISTS favorite
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_game           INT UNSIGNED,
    id_user           INT UNSIGNED,
    creation_date     DATETIME NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL     NOT NULL DEFAULT 1,
    CONSTRAINT UNIQUE uc_game_user (id_game, id_user),
    CONSTRAINT fk_favorite_game FOREIGN KEY (id_game) REFERENCES game (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_favorite_user FOREIGN KEY (id_user) REFERENCES user (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREATING TABLE FOR FAVORITES BETWEEN USERS AND GAMES
CREATE TABLE IF NOT EXISTS game_company
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_game           INT UNSIGNED,
    id_company        INT UNSIGNED,
    is_developer      BOOL,
    is_editor         BOOL,
    creation_date     DATETIME NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL     NOT NULL DEFAULT 1,
    CONSTRAINT fk_editor_game FOREIGN KEY (id_game) REFERENCES game (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_editor_company FOREIGN KEY (id_company) REFERENCES company (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREATING TABLE FOR GAME GENRES BETWEEN GAMES AND GENRES
CREATE TABLE IF NOT EXISTS game_genre
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_game           INT UNSIGNED,
    id_genre          INT UNSIGNED,
    creation_date     DATETIME NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOLEAN  NOT NULL DEFAULT 1,
    CONSTRAINT fk_game_genre_game FOREIGN KEY (id_game) REFERENCES game (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_game_genre_genre FOREIGN KEY (id_genre) REFERENCES genre (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREATING TABLE FOR FAVORITES BETWEEN PLATFORMS AND GAMES
CREATE TABLE IF NOT EXISTS game_platform
(
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_game           INT UNSIGNED,
    id_platform       INT UNSIGNED,
    creation_date     DATETIME NOT NULL DEFAULT NOW(),
    modification_date DATETIME,
    active            BOOL     NOT NULL DEFAULT 1,
    CONSTRAINT fk_game FOREIGN KEY (id_game) REFERENCES game (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_platform FOREIGN KEY (id_platform) REFERENCES platform (id) ON UPDATE CASCADE ON DELETE CASCADE
);


/*
 DATA INSERTION
 */

-- INSERTING SOME DATA TO BEGIN WITH
INSERT INTO permission
    (description, modification_date)
VALUES ('Administrator', NOW()),
       ('Moderator', NOW()),
       ('User', NOW());

--
INSERT INTO user
    (id_permission, user_name, password, image, modification_date, active)
VALUES (1, 'admin', '$2b$10$afRlx8Ao19st0We/8/FR6ONSQDYsFpTebqhZ.lDGfGiGPrvvrr1Gi', NULL, NOW(), TRUE),
       (2, 'test', '$2b$10$scwLnDny150hvz5ojUqqe.v7PcPq/7r3eMyuAmLUzZ6SGoaDCMLOe', NULL, NOW(), TRUE),
       (3, 'mod', '$2b$10$11wOc9V0YSXTEDu0pLPmVej2679jfTGGBfJbpIWeAXka0WV/emnw6', NULL, NOW(), TRUE);

--
INSERT INTO platform
    (name, image, modification_date)
VALUES ('PC', NULL, NOW()),
       ('Xbox', NULL, NOW()),
       ('Xbox 360', NULL, NOW()),
       ('Xbox One', NULL, NOW()),
       ('Xbox One X/S', NULL, NOW()),
       ('Xbox One Series X/S', NULL, NOW()),
       ('Playstation', NULL, NOW()),
       ('Playstation 2', NULL, NOW()),
       ('Playstation 3', NULL, NOW()),
       ('Playstation 4', NULL, NOW()),
       ('Playstation 4 Pro', NULL, NOW()),
       ('Playstation 5', NULL, NOW()),
       ('Nintendo Switch', NULL, NOW()),
       ('Gamecube', NULL, NOW()),
       ('Wii', NULL, NOW()),
       ('Wii U', NULL, NOW());

--
INSERT INTO classification
    (name, image, modification_date)
VALUES ('PEGI 3', NULL, NOW()),
       ('PEGI 7', NULL, NOW()),
       ('PEGI 12', NULL, NOW()),
       ('PEGI 16', NULL, NOW()),
       ('PEGI 18', NULL, NOW());

--
INSERT INTO genre
    (name, modification_date)
VALUES ('RPG', NOW()),
       ('MMORPG', NOW()),
       ('Hack\'n\'Slash', NOW()),
       ('Open-world', NOW()),
       ('Action', NOW()),
       ('Adventure', NOW()),
       ('JRPG', NOW()),
       ('STR', NOW()),
       ('Puzzle', NOW());

--
INSERT INTO company
    (name, company_creation_date, image, modification_date)
VALUES ('Konami', '2001-02-24', NULL, NOW()),
       ('Nintendo', '1850-05-12', NULL, NOW()),
       ('Blizzard', '1990-12-09', NULL, NOW()),
       ('Activision', '2000-06-30', NULL, NOW()),
       ('CD Projekt Red', '2020-12-01', NULL, NOW()),
       ('Rockstar Games', '1996-03-07', NULL, NOW()),
       ('Rockstar North', '2012-12-04', NULL, NOW()),
       ('Niantic', '2001-02-24', NULL, NOW()),
       ('Bethesda', '1992-10-01', NULL, NOW());

--
INSERT INTO game
    (id_classification, name, release_date, image, modification_date)
VALUES (5, 'Metal Gear Solid', '1998-05-07', NULL, NOW()),
       (5, 'Metal Gear Solid 2: Sons of Liberty', '2001-05-07', NULL, NOW()),
       (1, 'Metal Gear Solid 3: Snake Eater', '2004-05-07', NULL, NOW()),
       (5, 'Metal Gear Solid 4: Guns of the Patriots', '2008-05-07', NULL, NOW());

--
INSERT INTO game_genre
    (id_game, id_genre, modification_date)
VALUES (1, 5, NOW()),
       (1, 6, NOW()),
       (2, 5, NOW()),
       (2, 6, NOW()),
       (3, 5, NOW()),
       (3, 6, NOW()),
       (4, 5, NOW()),
       (4, 6, NOW());

--
INSERT INTO rating
    (id_game, id_user, rate, modification_date)
VALUES (1, 1, 2.00, NOW()),
       (2, 1, 3.00, NOW()),
       (3, 1, 5.00, NOW()),
       (4, 1, 1.00, NOW()),
       (1, 2, 2.00, NOW()),
       (3, 3, 5.00, NOW()),
       (4, 2, 3.00, NOW());

--
INSERT INTO favorite
    (id_game, id_user, modification_date)
VALUES (1, 1, NOW()),
       (1, 2, NOW()),
       (1, 3, NOW()),
       (2, 1, NOW()),
       (2, 2, NOW()),
       (3, 3, NOW());

--
INSERT INTO game_company
    (id_game, id_company, is_developer, is_editor, modification_date)
VALUES (1, 1, TRUE, TRUE, NOW()),
       (2, 1, TRUE, TRUE, NOW()),
       (3, 1, TRUE, TRUE, NOW()),
       (4, 1, TRUE, TRUE, NOW());

--
INSERT INTO game_platform
    (id_game, id_platform, modification_date)
VALUES (1, 8, NOW()),
       (1, 14, NOW()),
       (2, 1, NOW()),
       (2, 2, NOW()),
       (2, 8, NOW()),
       (3, 8, NOW()),
       (4, 9, NOW());

-- UPDATING THE GAME TO APPLY THE ID FOR THE RECURSIVE LINKS (UNABLE TO DO IT IN THE INITIALIZATION INSERT INTO)
UPDATE game
SET id_prequel = NULL,
    id_sequel  = 2
WHERE id = 1;
UPDATE game
SET id_prequel = 1,
    id_sequel  = 3
WHERE id = 2;
UPDATE game
SET id_prequel = 2,
    id_sequel  = 4
WHERE id = 3;
UPDATE game
SET id_prequel = 3,
    id_sequel  = NULL
WHERE id = 4;
