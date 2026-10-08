# BiteDash Architecture Documentation

## Overview
BiteDash is a production-grade full-stack food delivery platform built with clean, modular architecture. It provides specialized workflows and role-based access control (RBAC) across four primary user personas:
1. **Customer**: Restaurant discovery, smart search, AI food sommelier recommendations, customizable cart, real-time checkout, order tracking, review system, and ticket support.
2. **Restaurant Partner**: Incoming live order acceptance, preparation timeline tracking, menu categorization & items CRUD, availability toggling, and business performance metrics.
3. **Delivery Partner**: Available delivery queue, order acceptance, live navigation timeline, pickup & drop status updates, and payout/earnings summary.
4. **Platform Admin**: Platform-wide metrics, system orders, user management, restaurant approval/toggling, payments, refunds, and support ticket management.

## System Design
```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA Frontend                       │
│    (Context Store, Modular Components, Tailwind, Lucide)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js Backend                       │
│  ├── Middlewares: Auth (JWT), RBAC, Rate-Limiting, Error    │
│  ├── Controller Layer: Request unpacking & response formatting│
│  ├── Service Layer: Business logic, pricing, order lifecycle │
│  └── Repository Layer: Data access & SQL query abstraction  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐ ┌─────────────▼───────────────┐
│       Relational DB         │ │      Google Gemini AI       │
│  MySQL 8.0 (Production) /   │ │  Isolated in backend/       │
│  SQLite fallback (Dev)      │ │  integrations/gemini/       │
└─────────────────────────────┘ └─────────────────────────────┘
```

## Directory Structure
- `shared/`: Cross-cutting TypeScript interfaces, request validators, and platform constants.
- `backend/`:
  - `config/`: Environment configuration and unified DatabaseManager.
  - `middleware/`: JWT verification, role-based authorization, rate-limiting, error handling.
  - `integrations/gemini/`: Google GenAI TypeScript SDK wrapper for dish discovery and support assistance.
  - `modules/`: Feature-sliced modules (Auth, Users, Restaurants, Menu, Orders, Payments, Delivery, Addresses, Coupons, Notifications, Reviews, Support, Admin).
- `frontend/src/`:
  - `components/`: UI building blocks (common, layout, auth, restaurant, cart, checkout, order, delivery, notifications, support).
  - `pages/`: Role-specific screens (Customer, Restaurant, Delivery, Admin).
  - `services/`: API client communicating with backend endpoints.
  - `store/`: Authentication and Cart state management.
