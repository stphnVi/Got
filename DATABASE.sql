DROP DATABASE GOT;
CREATE DATABASE GOT;
USE GOT;

CREATE TABLE IF NOT EXISTS REPOSITORIO
(
id INT NOT NULL PRIMARY  KEY  AUTO_INCREMENT,
nombre VARCHAR(128) NOT NULL UNIQUE,
head VARCHAR(64)
);
CREATE TABLE IF NOT EXISTS COMMITS
(
-- MD5 HASH
id VARCHAR(64) PRIMARY KEY,
rep_id INT NOT NULL,
FOREIGN KEY (rep_id) REFERENCES REPOSITORIO(id),
parent_commit VARCHAR(64),
autor VARCHAR(128),
mensaje VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS ARCHIVO(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
ruta VARCHAR(512) NOT NULL, 
commit_id VARCHAR(64) NOT NULL,
FOREIGN KEY (commit_id) REFERENCES COMMITS(id),
huffman_code MEDIUMTEXT,
huffman_table MEDIUMTEXT
);

-- Tabla de  cambios 
CREATE TABLE IF NOT EXISTS DIFF( 
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
commit_id VARCHAR(64),
FOREIGN KEY (commit_id) REFERENCES COMMITS(id),
archivo INT NOT NULL, 
FOREIGN KEY (archivo) REFERENCES ARCHIVO(id),
diff_output TEXT(65535) NOT NULL,
md5 varchar(64)
);
