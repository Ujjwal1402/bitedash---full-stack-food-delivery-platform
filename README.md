# BiteDash - Full-Stack Food Delivery Platform

BiteDash is a production-ready, full-stack food ordering and delivery ecosystem built with React, Node.js, Express, MySQL, and Google Gemini AI.

## Key Highlights
- **Multi-Role Portal Access**:
  - **Customer**: Dynamic restaurant listings, dietary filters, AI food discovery, cart customization, saved addresses, instant checkout, live order timeline, driver tracking, reviews, tickets.
  - **Restaurant Partner**: Order acceptance queue, preparation statuses, menu management, item availability switch, sales analytics.
  - **Delivery Partner**: Real-time available orders pool, pickup/drop navigation simulation, delivery status transitions, earnings summary.
  - **Admin**: Platform KPIs, GMV calculation, users and restaurants moderation, orders and payments ledger.
- **Relational Database**: MySQL 8.0 with relational foreign keys, indexes, transactions, schema migrations, and seed data.
- **Layered Backend**: Controller → Service → Repository pattern with JWT auth, role-based access control, rate limiting, and centralized error handling.
- **Google Gemini AI**: Food Sommelier for natural language craving discovery and intelligent customer support assistance.

## Demo Accounts (Password for all: `password123`)
- **Customer**: `customer@bitedash.com`
- **Restaurant Partner**: `partner@pizzaslice.com` (Chef Marco) or `partner@spicecraft.com` (Priya)
- **Delivery Partner**: `delivery@bitedash.com` (Carlos)
- **Admin**: `admin@bitedash.com` (Elena)

## Running the Application
```bash
npm run dev
# Open http://localhost:3000
```
