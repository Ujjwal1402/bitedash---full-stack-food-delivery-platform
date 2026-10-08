# BiteDash Deployment Guide

## 1. Local Development
```bash
# Install dependencies
npm install

# Start development server (serves frontend + backend on port 3000)
npm run dev
```

## 2. Docker Compose (Full Stack with MySQL 8.0)
```bash
# Start MySQL and BiteDash App
docker-compose up --build

# Access BiteDash in browser:
http://localhost:3000
```

## 3. Production Build
```bash
npm run build
npm run start
```
