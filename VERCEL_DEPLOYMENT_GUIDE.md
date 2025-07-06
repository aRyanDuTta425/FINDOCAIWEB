# Production Environment Variables for Vercel

## Required for Core Functionality

### Database (Required for user authentication and document storage)
DATABASE_URL="postgresql://username:password@localhost:5432/findocai?schema=public"

### Authentication (Required for login/signup)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_URL="https://your-app-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"

## Optional for Enhanced Features

### File Storage (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

### AI Processing (Optional - for document analysis)
GROQ_API_KEY="your-groq-api-key"

## Instructions:
1. Go to https://vercel.com/aryan-duttas-projects/findocai/settings/environment-variables
2. Add each variable above with your actual values
3. Redeploy for changes to take effect

## Current Working Deployment:
https://findocai-bfpucrx9t-aryan-duttas-projects.vercel.app

This deployment shows your website is working correctly with the homepage, pricing, about, and contact pages all functional.
