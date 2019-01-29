DROP DATABASE IF EXISTS storefront;

CREATE DATABASE storefront;
USE storefront;

CREATE TABLE bamazon(
    id BIGINT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 6) DEFAULT 0.0,
    stock INT DEFAULT 0,
    PRIMARY KEY(id)
);
