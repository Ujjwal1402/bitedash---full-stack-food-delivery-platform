# BiteDash Relational Database Design

## Entity Relationship Overview
The database adheres to 3NF relational modeling with explicit foreign keys, cascades, indexes, and constraints.

### Core Tables
1. **users**: Primary user account records for Customer, Restaurant Partner, Delivery Partner, and Platform Admin.
   - `id` (PK), `email` (Unique Index), `password_hash`, `phone`, `role`, `avatar_url`, `created_at`.
2. **addresses**: Multiple delivery locations per customer.
   - `id` (PK), `user_id` (FK -> users.id), `label`, `address_line1`, `city`, `state`, `postal_code`, `is_default`.
3. **restaurants**: Registered food partners.
   - `id` (PK), `user_id` (FK -> users.id), `name`, `slug` (Unique), `cuisines`, `rating`, `delivery_time_min`, `delivery_fee`, `min_order_amount`, `is_pure_veg`, `is_open`.
4. **menu_categories**: Category hierarchy within a restaurant.
   - `id` (PK), `restaurant_id` (FK -> restaurants.id), `name`, `display_order`, `is_active`.
5. **menu_items**: Specific dishes offered.
   - `id` (PK), `restaurant_id` (FK), `category_id` (FK), `name`, `price`, `image_url`, `is_veg`, `is_available`, `is_best_seller`.
6. **coupons**: Promo code vouchers.
   - `id` (PK), `code` (Unique), `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `is_active`.
7. **delivery_partners**: Fleet partner details.
   - `id` (PK), `user_id` (FK), `vehicle_type`, `vehicle_number`, `is_online`, `total_earnings`, `rating`.
8. **orders**: Central transaction entity.
   - `id` (PK), `order_number` (Unique), `user_id` (FK), `restaurant_id` (FK), `delivery_partner_id` (FK Nullable), `delivery_address_id` (FK), `status`, `subtotal`, `tax_amount`, `delivery_fee`, `discount_amount`, `total_amount`, `payment_method`, `payment_status`.
9. **order_items**: Line items inside each order.
   - `id` (PK), `order_id` (FK -> orders.id ON DELETE CASCADE), `menu_item_id` (FK), `item_name`, `item_price`, `quantity`, `subtotal`, `customizations`.
10. **payments**: Financial ledger per order.
    - `id` (PK), `order_id` (FK), `user_id` (FK), `amount`, `payment_method`, `payment_status`, `transaction_id`.
11. **reviews**: Customer feedback.
    - `id` (PK), `user_id` (FK), `restaurant_id` (FK), `order_id` (FK), `rating`, `comment`.
12. **notifications**: Real-time order and system alerts.
    - `id` (PK), `user_id` (FK), `title`, `message`, `type`, `is_read`, `link`.
13. **support_tickets**: Customer support and inquiry tickets.
    - `id` (PK), `ticket_number` (Unique), `user_id` (FK), `order_id` (FK Nullable), `category`, `status`, `message`, `resolution`.

## Dialect Support
- **MySQL 8.0**: InnoDB engine, foreign keys, UTF8MB4 charset, full index optimization.
- **Unified Adapter**: Runs on MySQL in production/Docker, with zero-friction embedded SQLite fallback for local developer sandboxes.
