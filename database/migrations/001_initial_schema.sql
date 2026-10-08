-- BiteDash Relational Database Migration
-- Version: 001_initial_schema.sql

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
  avatar_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
);

-- 2. Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(50) NOT NULL DEFAULT 'Home',
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  landmark VARCHAR(150) NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addresses_user_id (user_id)
);

-- 3. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NULL,
  banner_image VARCHAR(500) NULL,
  logo_image VARCHAR(500) NULL,
  cuisines VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 4.50,
  rating_count INT NOT NULL DEFAULT 0,
  cost_for_two INT NOT NULL DEFAULT 400,
  delivery_time_min INT NOT NULL DEFAULT 30,
  delivery_fee DECIMAL(6, 2) NOT NULL DEFAULT 40.00,
  min_order_amount DECIMAL(6, 2) NOT NULL DEFAULT 100.00,
  is_pure_veg BOOLEAN NOT NULL DEFAULT FALSE,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_restaurants_slug (slug),
  INDEX idx_restaurants_city (city),
  INDEX idx_restaurants_open (is_open)
);

-- 4. Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_categories_restaurant (restaurant_id)
);

-- 5. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  price DECIMAL(8, 2) NOT NULL,
  original_price DECIMAL(8, 2) NULL,
  image_url VARCHAR(500) NULL,
  is_veg BOOLEAN NOT NULL DEFAULT TRUE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  preparation_time_min INT NOT NULL DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE,
  INDEX idx_items_restaurant (restaurant_id),
  INDEX idx_items_category (category_id),
  INDEX idx_items_veg (is_veg)
);

-- 6. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(6, 2) NOT NULL,
  min_order_value DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  max_discount DECIMAL(8, 2) NULL,
  valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_to TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_coupons_code (code),
  INDEX idx_coupons_active (is_active)
);

-- 7. Delivery Partners Table
CREATE TABLE IF NOT EXISTS delivery_partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  vehicle_type VARCHAR(30) NOT NULL DEFAULT 'BIKE',
  vehicle_number VARCHAR(50) NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  current_latitude DECIMAL(10, 7) NULL,
  current_longitude DECIMAL(10, 7) NULL,
  total_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
  rating_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_delivery_online (is_online)
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(60) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  delivery_partner_id INT NULL,
  delivery_address_id INT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'PLACED',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(8, 2) NOT NULL,
  delivery_fee DECIMAL(8, 2) NOT NULL,
  discount_amount DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  coupon_code VARCHAR(50) NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  cancellation_reason VARCHAR(255) NULL,
  special_instructions TEXT NULL,
  estimated_delivery_time TIMESTAMP NULL,
  placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  preparing_at TIMESTAMP NULL,
  ready_at TIMESTAMP NULL,
  picked_up_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id),
  FOREIGN KEY (delivery_address_id) REFERENCES addresses(id),
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_restaurant (restaurant_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_delivery_partner (delivery_partner_id)
);

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  item_price DECIMAL(8, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(8, 2) NOT NULL,
  customizations TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  INDEX idx_order_items_order (order_id)
);

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  gateway_response TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_payments_order (order_id),
  INDEX idx_payments_status (payment_status)
);

-- 11. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  order_id INT NOT NULL,
  rating DECIMAL(2, 1) NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_reviews_restaurant (restaurant_id)
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'SYSTEM',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_unread (user_id, is_read)
);

-- 13. Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  order_id INT NULL,
  subject VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  message TEXT NOT NULL,
  resolution TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_tickets_user (user_id),
  INDEX idx_tickets_status (status)
);
