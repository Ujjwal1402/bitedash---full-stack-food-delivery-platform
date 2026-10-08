-- BiteDash Relational Database Seed Data
-- Version: 001_seed_data.sql

-- 1. Insert Users (password for all demo accounts: 'password123')
-- Bcrypt hash of 'password123': $2b$10$E5z7178uJcIq3z8f9rK7uOF2M7d1f5xN3m4p8y5r1a2b3c4d5e6f7 or dynamic verify
INSERT INTO users (id, name, email, password_hash, phone, role, avatar_url) VALUES
(1, 'Alex Mercer', 'customer@bitedash.com', '$2a$10$UdfaZcO7c/9n6p5iFhGzEubD5O3uQG8x1e7M5n6o7p8q9r0s1t2u3', '+1 555-0199', 'CUSTOMER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
(2, 'Chef Marco Rossi', 'partner@pizzaslice.com', '$2a$10$UdfaZcO7c/9n6p5iFhGzEubD5O3uQG8x1e7M5n6o7p8q9r0s1t2u3', '+1 555-0201', 'RESTAURANT', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'),
(3, 'Priya Sharma', 'partner@spicecraft.com', '$2a$10$UdfaZcO7c/9n6p5iFhGzEubD5O3uQG8x1e7M5n6o7p8q9r0s1t2u3', '+1 555-0202', 'RESTAURANT', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80'),
(4, 'Kenji Tanaka', 'partner@sushiko.com', '$2a$10$UdfaZcO7c/9n6p5iFhGzEubD5O3uQG8x1e7M5n6o7p8q9r0s1t2u3', '+1 555-0203', 'RESTAURANT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
(5, 'Carlos Mendez', 'delivery@bitedash.com', '$2a$10$UdfaZcO7c/9n6p5iFhGzEubD5O3uQG8x1e7M5n6o7p8q9r0s1t2u3', '+1 555-0301', 'DELIVERY', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'),
(6, 'Elena Rostova', 'admin@bitedash.com', '$2a$10$UdfaZcO7c/9n6p5iFhGzEubD5O3uQG8x1e7M5n6o7p8q9r0s1t2u3', '+1 555-0001', 'ADMIN', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80');

-- 2. Insert Addresses for Customer (User 1)
INSERT INTO addresses (id, user_id, label, address_line1, address_line2, city, state, postal_code, landmark, latitude, longitude, is_default) VALUES
(1, 1, 'Home', 'Penthouse 4B, Emerald Heights', '742 Evergreen Terrace', 'Metro City', 'CA', '90210', 'Opposite Central Park Gate 3', 37.7749, -122.4194, TRUE),
(2, 1, 'Work', 'Suite 1200, Tech Innovation Tower', '500 Market Street', 'Metro City', 'CA', '90211', 'Next to Metro Station', 37.7891, -122.4014, FALSE);

-- 3. Insert Delivery Partners (User 5)
INSERT INTO delivery_partners (id, user_id, vehicle_type, vehicle_number, license_number, is_online, current_latitude, current_longitude, total_earnings, rating, rating_count) VALUES
(1, 5, 'BIKE', 'CA-BD-9021', 'DL-9948201', TRUE, 37.7780, -122.4120, 1420.50, 4.90, 84);

-- 4. Insert Restaurants
INSERT INTO restaurants (id, user_id, name, slug, description, banner_image, logo_image, cuisines, rating, rating_count, cost_for_two, delivery_time_min, delivery_fee, min_order_amount, is_pure_veg, is_open, address, city, latitude, longitude) VALUES
(1, 2, 'Bella Napoli Pizzeria', 'bella-napoli-pizzeria', 'Authentic wood-fired Neapolitan pizzas, artisanal mozzarella, and handcrafted pasta.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80', 'Italian, Pizza, Fast Food', 4.80, 240, 450, 25, 35.00, 150.00, FALSE, TRUE, '12 Napoli Way, Little Italy', 'Metro City', 37.7760, -122.4180),
(2, 3, 'Spice Craft Indian Kitchen', 'spice-craft-indian-kitchen', 'Fragrant slow-cooked Dum Biryanis, rich Butter Chicken, crispy dosas and tandoor delicacies.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=200&q=80', 'Indian, Biryani, Mughlai, Curry', 4.90, 410, 500, 30, 40.00, 120.00, FALSE, TRUE, '88 Curry Square, Downtown', 'Metro City', 37.7790, -122.4150),
(3, 4, 'Sushi Ko Bar & Ramen', 'sushi-ko-bar-ramen', 'Premium sashimi, signature specialty maki rolls, and 18-hour tonkotsu ramen broth.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80', 'Japanese, Sushi, Asian, Ramen', 4.75, 185, 650, 35, 45.00, 200.00, FALSE, TRUE, '204 Sakura Blvd, Arts District', 'Metro City', 37.7810, -122.4130),
(4, 2, 'Green Garden Pure Veg', 'green-garden-pure-veg', '100% pure vegetarian culinary bliss: farm-fresh salads, paneer specialties, smoothie bowls, and gluten-free wraps.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80', 'Healthy, Pure Veg, Salads, Vegan', 4.70, 130, 350, 20, 25.00, 100.00, TRUE, TRUE, '45 Harmony Row, Midtown', 'Metro City', 37.7830, -122.4170);

-- 5. Insert Menu Categories
INSERT INTO menu_categories (id, restaurant_id, name, display_order, is_active) VALUES
(1, 1, 'Wood-Fired Pizzas', 1, TRUE),
(2, 1, 'Artisan Pastas & Sides', 2, TRUE),
(3, 1, 'Desserts & Beverages', 3, TRUE),
(4, 2, 'Hyderabadi Dum Biryani', 1, TRUE),
(5, 2, 'Curries & Tandoor', 2, TRUE),
(6, 2, 'Breads & Desserts', 3, TRUE),
(7, 3, 'Signature Rolls', 1, TRUE),
(8, 3, 'Ramen Bowls', 2, TRUE),
(9, 4, 'Healthy Bowls & Salads', 1, TRUE),
(10, 4, 'Paneer & Mains', 2, TRUE);

-- 6. Insert Menu Items
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, original_price, image_url, is_veg, is_available, is_best_seller, preparation_time_min) VALUES
-- Bella Napoli Pizzeria
(1, 1, 1, 'Margherita Burrata Special', 'San Marzano tomatoes, fresh creamy burrata, basil olive oil drizzle, on fermented sourdough crust.', 299.00, 349.00, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, TRUE, 15),
(2, 1, 1, 'Truffle Mushroom Pizza', 'Wild porcini & cremini mushrooms, fontina cheese, white truffle emulsion, fresh thyme.', 389.00, 429.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, TRUE, 18),
(3, 1, 1, 'Smoked Pepperoni Feast', 'Artisanal spicy pepperoni, roasted bell peppers, fresh mozzarella, hot honey glaze.', 399.00, 449.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 16),
(4, 1, 2, 'Penne Alla Vodka', 'Velvety slow-simmered tomato cream sauce, pecorino romano, touch of chili flakes.', 279.00, 319.00, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 14),
(5, 1, 3, 'Classic Italian Tiramisu', 'Savoiardi soaked in espresso, mascarpone cream, dark cocoa powder dusting.', 189.00, 219.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, TRUE, 5),

-- Spice Craft Indian Kitchen
(6, 2, 4, 'Royal Chicken Dum Biryani', 'Fragrant basmati rice layered with tender saffron-marinated chicken, caramelized onions, served with mirchi ka salan and raita.', 349.00, 399.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 20),
(7, 2, 4, 'Nizami Paneer Dum Biryani', 'Aromatic spiced basmati rice with succulent paneer cubes, saffron milk, mint leaves, and roasted cashews.', 299.00, 349.00, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, TRUE, 18),
(8, 2, 5, 'Old Delhi Butter Chicken', 'Charcoal-grilled chicken tikka in a decadent velvet tomato and butter gravy, spiked with kasuri methi.', 379.00, 429.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 16),
(9, 2, 5, 'Paneer Tikka Masala', 'Marinated cottage cheese roasted in tandoor and tossed in spicy bell pepper-onion gravy.', 329.00, 369.00, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 15),
(10, 2, 6, 'Garlic Butter Naan (2 pcs)', 'Fluffy clay oven leavened bread brushed with melted garlic butter and fresh cilantro.', 99.00, 119.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 10),

-- Sushi Ko Bar & Ramen
(11, 3, 7, 'Dragon Crunch Roll (8 pcs)', 'Tempura shrimp, cucumber, topped with avocado, spicy mayo, eel sauce, and crunchy tempura flakes.', 429.00, 489.00, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 18),
(12, 3, 7, 'Salmon Avocado Roll (8 pcs)', 'Fresh Atlantic salmon, ripe avocado, sushi rice, toasted sesame seeds.', 399.00, 449.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 15),
(13, 3, 8, 'Hakata Tonkotsu Ramen', '18-hour rich pork bone broth, springy ramen noodles, chashu pork, seasoned soft boiled egg, menma, and nori.', 389.00, 439.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 22),

-- Green Garden Pure Veg
(14, 4, 9, 'Avocado Quinoa Power Bowl', 'Organic tri-color quinoa, baby spinach, hass avocado, edamame, cherry tomatoes, citrus tahini dressing.', 289.00, 329.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, TRUE, 12),
(15, 4, 10, 'Palak Paneer with Brown Rice', 'Creamy spiced baby spinach puree with fresh organic cottage cheese, served with fragrant steamed brown rice.', 310.00, 350.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 15);

-- 7. Insert Coupons
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, is_active) VALUES
(1, 'WELCOME50', '50% OFF on your first 3 food deliveries on BiteDash', 'PERCENTAGE', 50.00, 199.00, 120.00, TRUE),
(2, 'BITELOVE', '20% OFF on all gourmet restaurants', 'PERCENTAGE', 20.00, 299.00, 150.00, TRUE),
(3, 'FEAST100', 'Flat ₹100 instant discount on orders above ₹499', 'FLAT', 100.00, 499.00, 100.00, TRUE);

-- 8. Insert Sample Orders
INSERT INTO orders (id, order_number, user_id, restaurant_id, delivery_partner_id, delivery_address_id, status, subtotal, tax_amount, delivery_fee, discount_amount, coupon_code, total_amount, payment_method, payment_status, special_instructions, placed_at, confirmed_at, preparing_at, ready_at, picked_up_at, delivered_at) VALUES
(1, 'ORD-20261005-001', 1, 1, 1, 1, 'DELIVERED', 688.00, 34.40, 35.00, 100.00, 'WELCOME50', 657.40, 'UPI', 'SUCCESS', 'Please ring doorbell and leave at doorstep.', '2026-10-04 19:30:00', '2026-10-04 19:32:00', '2026-10-04 19:35:00', '2026-10-04 19:48:00', '2026-10-04 19:52:00', '2026-10-04 20:14:00'),
(2, 'ORD-20261005-002', 1, 2, 1, 1, 'OUT_FOR_DELIVERY', 728.00, 36.40, 40.00, 0.00, NULL, 804.40, 'CARD', 'SUCCESS', 'Extra spicy biryani please!', '2026-10-05 11:30:00', '2026-10-05 11:32:00', '2026-10-05 11:36:00', '2026-10-05 11:50:00', '2026-10-05 11:54:00', NULL);

-- 9. Insert Order Items
INSERT INTO order_items (id, order_id, menu_item_id, item_name, item_price, quantity, subtotal, customizations) VALUES
(1, 1, 1, 'Margherita Burrata Special', 299.00, 1, 299.00, '{"crust": "Sourdough", "cheese": "Extra Burrata"}'),
(2, 1, 3, 'Smoked Pepperoni Feast', 399.00, 1, 399.00, '{"spice": "Hot Honey Drizzle"}'),
(3, 2, 6, 'Royal Chicken Dum Biryani', 349.00, 2, 698.00, '{"spice": "Extra Spicy"}');

-- 10. Insert Payments
INSERT INTO payments (id, order_id, user_id, amount, payment_method, payment_status, transaction_id, gateway_response) VALUES
(1, 1, 1, 657.40, 'UPI', 'SUCCESS', 'TXN_UPI_9824719241', '{"status": "captured", "bank_ref": "BITE-UPI-99214"}'),
(2, 2, 1, 804.40, 'CARD', 'SUCCESS', 'TXN_CRD_1029481923', '{"status": "captured", "last4": "4242", "brand": "Visa"}');

-- 11. Insert Reviews
INSERT INTO reviews (id, user_id, restaurant_id, order_id, rating, comment) VALUES
(1, 1, 1, 1, 5.0, 'Incredible wood-fired crust! The burrata was ultra-creamy and arrived piping hot.');

-- 12. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, link) VALUES
(1, 1, 'Order Out for Delivery! 🛵', 'Carlos is on the way with your Royal Dum Biryani from Spice Craft.', 'DELIVERY', FALSE, '/orders/2'),
(2, 1, 'Welcome to BiteDash! 🎉', 'Use coupon WELCOME50 on your first 3 food deliveries to save 50%.', 'PROMO', TRUE, '/coupons');

-- 13. Insert Support Tickets
INSERT INTO support_tickets (id, ticket_number, user_id, order_id, subject, category, priority, status, message) VALUES
(1, 'TCK-202610-001', 1, 1, 'Delivery Partner was exceptionally polite and fast', 'DELIVERY', 'LOW', 'RESOLVED', 'Just wanted to give praise to Carlos for delivering safely in the rain.');
