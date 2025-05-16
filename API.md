# CarValueAI API Documentation

This document describes all the available API endpoints for the CarValueAI application.

## Authentication Endpoints

### Register a new user
- **URL**: `/api/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**: User object

### Login
- **URL**: `/api/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object

### Logout
- **URL**: `/api/logout`
- **Method**: `GET`
- **Response**: Success message

### Get current user
- **URL**: `/api/auth/user`
- **Method**: `GET`
- **Response**: User object

## Car Valuation Endpoints

### Request car valuation
- **URL**: `/api/quick-valuation`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "make": "BMW",
    "model": "X5",
    "year": 2019,
    "mileage": 45000,
    "condition": "excellent",
    "vin": "WBA7E4C33KGV35137" // Optional
  }
  ```
- **Response**: Valuation result

### Get valuation by ID
- **URL**: `/api/valuations/:id`
- **Method**: `GET`
- **Response**: Valuation object

### Get user valuations
- **URL**: `/api/valuations/user`
- **Method**: `GET`
- **Response**: Array of valuation objects

## Business Inquiries

### Submit contact inquiry
- **URL**: `/api/inquiries`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890", // Optional
    "message": "I'm interested in the business subscription plan."
  }
  ```
- **Response**: Inquiry object

## Admin Endpoints

All admin endpoints require admin authentication.

### Dashboard statistics
- **URL**: `/api/admin/dashboard`
- **Method**: `GET`
- **Response**: Dashboard statistics object

### Users management
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Response**: Array of user objects

### User details
- **URL**: `/api/admin/users/:id`
- **Method**: `GET`
- **Response**: User object

### Update user
- **URL**: `/api/admin/users/:id`
- **Method**: `PATCH`
- **Body**: User update object
- **Response**: Updated user object

### Generate API key for user
- **URL**: `/api/admin/users/:id/api-key`
- **Method**: `POST`
- **Response**: API key string

### All inquiries
- **URL**: `/api/admin/inquiries`
- **Method**: `GET`
- **Response**: Array of inquiry objects

### Update inquiry
- **URL**: `/api/admin/inquiries/:id`
- **Method**: `PATCH`
- **Body**: Inquiry update object
- **Response**: Updated inquiry object

### All payments
- **URL**: `/api/admin/payments`
- **Method**: `GET`
- **Response**: Array of payment objects

### All valuations
- **URL**: `/api/admin/valuations`
- **Method**: `GET`
- **Response**: Array of valuation objects

## Business Subscription Endpoints

### Create business subscription
- **URL**: `/api/subscriptions`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "plan": "small",
    "monthlyQuota": 50,
    "paymentFrequency": "monthly",
    "amount": 199.99
  }
  ```
- **Response**: Subscription object

### Get user's active subscription
- **URL**: `/api/subscriptions/user`
- **Method**: `GET`
- **Response**: Subscription object

## API Usage (For Business Clients)

Business clients can use their API key to access valuation services programmatically.

### API Valuation
- **URL**: `/api/valuation`
- **Method**: `POST`
- **Headers**:
  ```
  X-API-Key: your-api-key
  ```
- **Body**:
  ```json
  {
    "make": "BMW",
    "model": "X5",
    "year": 2019,
    "mileage": 45000,
    "condition": "excellent",
    "vin": "WBA7E4C33KGV35137",
    "clientEmail": "client@example.com" // Optional, for business users to track their client
  }
  ```
- **Response**: Valuation result