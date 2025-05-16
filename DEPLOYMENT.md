# Deploying CarValueAI to Vercel

This guide will walk you through the process of deploying your CarValueAI application to Vercel.

## Prerequisites

- A GitHub account with your repository uploaded
- A Vercel account (you can sign up with your GitHub account)
- A PostgreSQL database (we recommend Neon, Supabase, or Railway)

## Step 1: Prepare Your Database

1. Set up a PostgreSQL database in your preferred service
2. Make sure your database is accessible from the internet
3. Keep the database connection string handy for the next steps

## Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Connect your GitHub account and select your CarValueAI repository
4. Configure the project settings:
   - Framework Preset: Vite
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random string for session encryption (e.g., generate using `openssl rand -base64 32`)
   - `OPENAI_API_KEY`: (Optional) Your OpenAI API key if you want to use AI features

6. Click "Deploy"

## Step 3: Verify Your Deployment

1. Once deployment is complete, Vercel will provide you with a URL
2. Visit the URL to ensure your application is working correctly
3. Try the following features to verify:
   - Homepage loading
   - Car valuation form
   - Login/registration
   - Admin panel access

## Step 4: Set Up a Custom Domain (Optional)

1. In your project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the instructions to configure DNS settings

## Troubleshooting

- **Database Connection Issues**: Ensure your database allows connections from Vercel's IP ranges
- **API Endpoints Not Working**: Check Vercel Functions logs in the project dashboard
- **Frontend Routes Not Working**: Verify the rewrites in your `vercel.json` file

## Vercel Serverless Limitations

- Function execution time is limited to 10 seconds in the free tier
- Memory usage is limited to 1.5GB
- If you need more resources, consider upgrading to a paid plan

## Monitoring and Logs

- Use the Vercel dashboard to monitor your application
- Check the "Functions" tab to see logs for your API endpoints
- Enable Vercel Analytics to track performance and usage

## Setting Up CI/CD

Vercel automatically sets up continuous deployment from your GitHub repository. Any push to your main branch will trigger a new deployment.

To set up preview deployments for pull requests:
1. Go to your project settings
2. Navigate to the "Git" tab
3. Enable "Preview Deployments"