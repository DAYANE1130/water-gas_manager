DROP SCHEMA IF EXISTS water_gas_manager;

CREATE DATABASE water_gas_manager;

USE water_gas_manager;

CREATE TABLE readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url LONGTEXT NOT NULL,
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    measure_datetime DATETIME NOT NULL,
    measure_type ENUM('WATER', 'GAS') NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    measure_uuid BIGINT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO readings (image_url, customer_code, measure_datetime, measure_type,confirmed, measure_uuid)
VALUES 
('http://example.com/image1.jpg', 'CUSTOMER001', '2023-10-01 08:30:00', 'WATER',0, 9876543210),
('http://example.com/image2.jpg', 'CUSTOMER002', '2023-10-02 09:45:00', 'GAS',1, 9876543211),
('http://example.com/image3.jpg', 'CUSTOMER003', '2023-10-03 10:00:00', 'WATER',0, 9876543212)