import mysql from 'mysql2/promise';
import { logger } from './logger';

export const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'RiceMySQLPass2026!',
  database: process.env.MYSQL_DATABASE || 'rice_ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const initMySQLTables = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    logger.info('[MySQL] Connected successfully to MySQL Database on port 3306');

    // Create Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        images JSON,
        characteristics JSON,
        packaging_options JSON,
        is_featured TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_code VARCHAR(50) NOT NULL UNIQUE,
        user_email VARCHAR(255),
        total_weight_kg DECIMAL(10,2) NOT NULL,
        subtotal_vnd DECIMAL(15,2) NOT NULL,
        total_vnd DECIMAL(15,2) NOT NULL,
        order_status VARCHAR(50) DEFAULT 'PENDING',
        payment_method VARCHAR(50) DEFAULT 'COD',
        shipping_address JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    connection.release();
    logger.info('[MySQL] Tables verified/created successfully (products, orders)');
  } catch (error) {
    logger.warn('[MySQL] Could not connect to MySQL. (Make sure docker container rice_mysql is running if using MySQL)');
  }
};
