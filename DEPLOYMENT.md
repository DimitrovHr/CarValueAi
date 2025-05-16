# Deploying CarValueAI

This guide explains how to deploy the CarValueAI application to production.

## Application Architecture

CarValueAI consists of two parts:
- **Frontend**: React + Vite application
- **Backend**: Express API server with PostgreSQL database

For the best deployment experience, these should be deployed separately.

## Option 1: Frontend on Vercel, Backend on a separate service

### Step 1: Deploy the Backend (Express API)

The backend can be deployed to services like:
- [Railway](https://railway.app)
- [Render](https://render.com)
- [Heroku](https://heroku.com)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

#### Required Environment Variables for Backend
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string for securing sessions
- `OPENAI_API_KEY`: (Optional) For AI-powered valuation features

#### Backend Deployment Steps:
1. Create a new project on your chosen platform
2. Connect to this GitHub repository
3. Set the required environment variables
4. Set the build command to `npm install && npm run build`
5. Set the start command to `npm run start`
6. Deploy and note the URL of your API (e.g., https://carvalueai-api.railway.app)

### Step 2: Deploy the Frontend to Vercel

1. Create a new project on [Vercel](https://vercel.com)
2. Connect to this GitHub repository
3. Set the following environment variables:
   - `VITE_API_URL`: The URL of your backend API
4. Set the build command to `npm run build`
5. Set the output directory to `dist`
6. Deploy your application

## Option 2: Combined Deployment (Advanced)

For platforms that support both frontend and backend in a single service (like Heroku, Railway, or Render):

1. Deploy the entire repository
2. Set the required environment variables (as listed above)
3. Set the build command to `npm install && npm run build`
4. Set the start command to `npm run start:prod`

## Testing Your Deployment

After deploying, verify that:

1. The frontend loads correctly
2. You can register and login
3. Car valuations work properly
4. Admin dashboard is accessible to admin users
5. Payments and inquiries are functioning

## Troubleshooting

### CORS Issues
If you see CORS errors in the browser console, ensure the backend has the correct CORS configuration for your frontend domain.

### Database Connection Issues
Verify that your `DATABASE_URL` is correctly set and the database is accessible from your backend service.

### Authentication Problems
If login/registration doesn't work, check that `SESSION_SECRET` is set and that cookies are being properly handled between the frontend and backend.