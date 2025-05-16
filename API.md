# CarValueAI API Documentation

This document outlines the API endpoints available in the CarValueAI application after restructuring for Vercel serverless functions.

## Public Endpoints

### Authentication

#### Register
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
- **Response**: User object (without password)

#### Login
- **URL**: `/api/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with session information

### Car Valuations

#### Quick Valuation
- **URL**: `/api/quick-valuation`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "make": "BMW",
    "model": "530i",
    "year": 2019,
    "mileage": 85000,
    "condition": "good",
    "vin": "WBAJA5C52KBW51974" // Optional
  }
  ```
- **Response**: Valuation details including estimated value, confidence score, and market trend

### Inquiries

#### Submit Inquiry
- **URL**: `/api/inquiries`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+359 888 123 456", // Optional
    "message": "I'm interested in your business plan."
  }
  ```
- **Response**: Confirmation of inquiry submission

## Admin Endpoints

These endpoints require admin authentication:

### Dashboard

#### Get Dashboard Stats
- **URL**: `/api/admin/dashboard`
- **Method**: `GET`
- **Response**: Statistics including total users, valuations, payments, and revenue

### Users

#### Get All Users
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Response**: Array of user objects

### Valuations

#### Get All Valuations
- **URL**: `/api/admin/valuations`
- **Method**: `GET`
- **Response**: Array of valuation objects

### Payments

#### Get All Payments
- **URL**: `/api/admin/payments`
- **Method**: `GET`
- **Response**: Array of payment objects

### Inquiries

#### Get All Inquiries
- **URL**: `/api/admin/inquiries`
- **Method**: `GET`
- **Response**: Array of inquiry objects

## Environment Variables

The following environment variables must be set in Vercel:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `OPENAI_API_KEY`: (Optional) API key for OpenAI integration if enhanced valuation is enabled