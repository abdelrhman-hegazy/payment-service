# Payment Service
A microservice that handles payment processing, transaction verification, and integration with payment gateways.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Overview
The Payment Service provides secure payment handling, transaction verification, and webhook support for other microservices.

## Features
- Stripe integration
- Token-based authentication
- Webhook verification
- Transaction history API

## Tech Stack
- Node.js / Express
- TypeScript
- MongoDB
- Docker
- JWT Authentication

## Setup
1. Clone the repository:
   ```bash
     git clone https://github.com/yourusername/payment-service.git
     cd payment-service
     npm install
     npm run build
     npm run start
   

## Environment Variables
Create a `.env` file with:
STRIPE_API_KEY=sk_test........
STRIPE_WEBHOOK_SECRET=pk_test.................
PORT=3000 


USER="user"
DATABASE="databaseName"
HOST="localhost"
PASSWORD="password"
PORTDB=5432

## Docker
Build and run with Docker:

```bash
docker pull bnhegazy/payment-service .
docker run -p 3000:3000 --env-file .env bnhegazy/payment-service
---
```
### API Endpoints**
Add endpoint documentation or link to Postman collection.

```md
## API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/payments/create | Create new payment |
| POST | /api/payments/webhook | Stripe webhook handler |





