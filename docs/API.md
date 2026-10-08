# BiteDash REST API Documentation

All endpoints return JSON in the consistent format:
`{ "success": true, "data": { ... }, "message": "optional" }` or
`{ "success": false, "error": "error message", "details": ... }`

## 1. Authentication (`/api/auth`)
- `POST /api/auth/signup`: Register new account (Customer, Partner, Delivery).
- `POST /api/auth/login`: Authenticate and receive JWT token.
- `GET /api/auth/me`: Get current authenticated user session.

## 2. Restaurants (`/api/restaurants`)
- `GET /api/restaurants`: List restaurants with filters (search, cuisine, is_pure_veg, sort).
- `GET /api/restaurants/:idOrSlug`: Fetch restaurant profile with categories and menu items.
- `GET /api/restaurants/partner/profile`: (Partner/Admin) Get restaurant managed by logged-in user.
- `PUT /api/restaurants/partner/profile`: (Partner/Admin) Update restaurant info.
- `GET /api/restaurants/partner/analytics`: (Partner/Admin) Get orders count, total revenue, active orders.

## 3. Menu (`/api/menu`)
- `GET /api/menu/search?q=...&veg=true`: Search across dishes.
- `POST /api/menu/ai-discover`: Gemini AI natural language food sommelier recommendation.
- `POST /api/menu/items`: (Partner/Admin) Create new dish.
- `PUT /api/menu/items/:id`: (Partner/Admin) Update dish.
- `PATCH /api/menu/items/:id/availability`: (Partner/Admin) Toggle in-stock/out-of-stock.
- `DELETE /api/menu/items/:id`: (Partner/Admin) Remove dish.
- `POST /api/menu/categories`: (Partner/Admin) Create menu category.

## 4. Orders (`/api/orders`)
- `POST /api/orders`: Place order (validates prices, discounts, delivery fee, taxes, transaction).
- `GET /api/orders/my-orders`: Retrieve customer order history.
- `GET /api/orders/restaurant-orders`: (Partner) Retrieve incoming and past orders.
- `GET /api/orders/:id`: Detailed order status, tracking, and item list.
- `PATCH /api/orders/:id/status`: Transition lifecycle (PLACED, CONFIRMED, PREPARING, READY_FOR_PICKUP, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED).

## 5. Payments (`/api/payments`)
- `GET /api/payments/order/:orderId`: View transaction details for an order.
- `POST /api/payments/process`: Realistic payment processing (UPI, Card, Net Banking, COD).

## 6. Delivery (`/api/delivery`)
- `GET /api/delivery/profile`: Partner profile and vehicle status.
- `PATCH /api/delivery/toggle-online`: Switch availability online/offline.
- `GET /api/delivery/available`: Available orders ready for delivery.
- `POST /api/delivery/accept/:orderId`: Accept delivery assignment.
- `GET /api/delivery/active`: Current active deliveries.
- `PATCH /api/delivery/:orderId/status`: Update status (PICKED_UP, OUT_FOR_DELIVERY, DELIVERED).
- `GET /api/delivery/history`: Completed deliveries and earnings.

## 7. Addresses (`/api/addresses`)
- `GET /api/addresses`: Customer saved delivery addresses.
- `POST /api/addresses`: Add new address.
- `PUT /api/addresses/:id`: Edit address.
- `DELETE /api/addresses/:id`: Delete address.
- `PATCH /api/addresses/:id/default`: Set default delivery location.

## 8. Coupons (`/api/coupons`)
- `GET /api/coupons`: List available discount codes.
- `POST /api/coupons/validate`: Check code eligibility against subtotal.

## 9. Reviews (`/api/reviews`)
- `GET /api/reviews/restaurant/:restaurantId`: Get verified customer reviews.
- `POST /api/reviews`: Post review for a delivered order.

## 10. Support (`/api/support`)
- `GET /api/support/my-tickets`: View customer tickets.
- `POST /api/support`: Submit issue ticket (powered with Gemini AI assistance).
- `GET /api/support`: (Admin) View all open tickets.
- `PATCH /api/support/:id`: (Admin) Update ticket status and resolution.

## 11. Admin (`/api/admin`)
- `GET /api/admin/stats`: Total users, GMV, orders, restaurants, active riders.
- `GET /api/admin/users`: List all platform users and toggle roles.
- `GET /api/admin/restaurants`: Toggle restaurant open/close status.
- `GET /api/admin/delivery-partners`: Partner fleet overview.
- `GET /api/admin/orders`: Platform-wide orders log.
- `GET /api/admin/payments`: Transaction log.
