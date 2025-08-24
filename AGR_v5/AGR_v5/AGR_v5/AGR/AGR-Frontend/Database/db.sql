CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  peso INT NOT NULL
);

INSERT INTO usuarios (nombre, peso) VALUES
('Toro', 400),
('La gordita', 300),
('Homero', 200);