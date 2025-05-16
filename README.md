# CarValueAI

A React + Vite application for AI-powered car valuations in the Bulgarian market.

## Overview

CarValueAI helps clients get accurate valuations for used cars in the Bulgarian market by leveraging data from various sources like mobile.bg, cars.bg, and social media groups. The application offers tiered pricing plans with different features:

- **Regular Plan (€14.99)**: Current market value analysis with Bulgarian market data
- **Premium Plan (€29.99)**: Regular features plus historical trend analysis and future prediction
- **Business Plan**: Subscription-based service for dealerships and professional users

## Features

- Instant car valuations with AI-powered price estimation
- Optional VIN input for more precise valuations
- Detailed market analysis and historical trends
- Role-based authentication and admin panel
- Business client API for integration with other systems
- Multilingual support for Bulgarian and English

## Technologies Used

- Frontend: React, Vite, Tailwind CSS, shadcn/ui
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- Authentication: Custom authentication system
- Styling: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/carvalueai.git
   cd carvalueai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other configuration.

4. Run database migrations:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Deployment

The application can be deployed to any platform that supports Node.js applications with PostgreSQL.

## License

[MIT License](LICENSE)