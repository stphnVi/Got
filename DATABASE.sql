DROP DATABASE GOT;
CREATE DATABASE GOT;
USE GOT;

CREATE TABLE IF NOT EXISTS REPOSITORIO
(
id INT NOT NULL PRIMARY  KEY  AUTO_INCREMENT,
nombre VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS COMMITS
(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
rep_id INT NOT NULL,
FOREIGN KEY (rep_id) REFERENCES REPOSITORIO(id),
autor VARCHAR(128),
mensaje VARCHAR(255),
hora TIME
);

CREATE TABLE IF NOT EXISTS ARCHIVO(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
ruta VARCHAR(512) NOT NULL, 
commit_id INT NOT NULL,
FOREIGN KEY (commit_id) REFERENCES COMMITS(id),
huffman_code MEDIUMTEXT,
huffman_tree TEXT(655353)
);

-- Tabla de  cambios 
CREATE TABLE IF NOT EXISTS DIFF( 
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
commit_id INT,
FOREIGN KEY (commit_id) REFERENCES COMMITS(id),
archivo INT NOT NULL, 
FOREIGN KEY (archivo) REFERENCES ARCHIVO(id),
diff_output TEXT(65535) NOT NULL,
correctChecksum varchar(256)
);
