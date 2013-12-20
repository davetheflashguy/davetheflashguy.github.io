CREATE TABLE custmoerkeys (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(50),
    accesskey VARCHAR(50),
    products VARCHAR(20),
    expires DATETIME DEFAULT NULL,
    notes TEXT 
);

CREATE TABLE solutions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    products VARCHAR(50),
    category VARCHAR(30),
    demo_url VARCHAR(50),
    slide_name VARCHAR(250),
    slide_type VARCHAR(15),
    video_name VARCHAR(250),
    video_type VARCHAR(15),
    notes TEXT
);

CREATE TABLE products (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
);

CREATE TABLE customer_products (
    customerkey_id INT, 
    product_id INT
);

CREATE TABLE solution_products (
    solution_id INT, 
    product_id INT
);
