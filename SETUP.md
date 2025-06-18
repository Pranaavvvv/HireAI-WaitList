# HireAI Waitlist Setup Guide

## Issues Resolved

### 1. API URL Configuration
The client now uses the correct server URL: `https://hireai-waitlist.onrender.com/api`

### 2. CORS Configuration
Updated server CORS to allow requests from:
- `https://hire-ai-wait-list.vercel.app` (production)
- `http://localhost:5173` (development)
- `http://localhost:3000` (development)

### 3. Authentication Flow
The admin dashboard requires authentication. Here's how to access it:

## Setup Instructions

### For Local Development

1. **Set Environment Variables**
   Create a `.env` file in the `client` directory:
   ```bash
   VITE_API_URL=https://hireai-waitlist.onrender.com/api
   ```

2. **Start the Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Access Admin Dashboard**
   - Go to `http://localhost:5173/admin/login`
   - You'll need admin credentials to log in
   - After login, you can access the dashboard at `/admin/dashboard`

### For Production (Vercel)

1. **Set Environment Variables in Vercel**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://hireai-waitlist.onrender.com/api`

2. **Redeploy**
   - The changes will be automatically deployed

## Admin Authentication

The `/api/waitlist/all` endpoint requires admin authentication. To access the admin dashboard:

1. **Login**: Go to `/admin/login`
2. **Credentials**: You need admin credentials (email/password)
3. **Token**: After successful login, a JWT token is stored in localStorage
4. **Access**: The dashboard will then be able to fetch waitlist data

## API Endpoints

### Public Endpoints (No Auth Required)
- `POST /api/waitlist/register` - Register for waitlist
- `POST /api/waitlist/verify` - Verify email
- `POST /api/waitlist/resend` - Resend verification
- `POST /api/admin/login` - Admin login

### Protected Endpoints (Auth Required)
- `GET /api/waitlist/all` - Get all waitlist users (admin only)
- `GET /api/analytics` - Get analytics data (admin only)
- `GET /api/analytics/export` - Export data (admin only)

## Troubleshooting

### 404 Errors
- Ensure you're logged in as admin before accessing protected endpoints
- Check that the API URL is correctly set

### CORS Errors
- The server now allows multiple origins
- If still getting CORS errors, check that your domain is in the allowed origins list

### Authentication Errors
- Clear localStorage and try logging in again
- Check that admin credentials are correct
- Ensure the JWT_SECRET is set on the server

## Server Status

The server is deployed at: `https://hireai-waitlist.onrender.com`

Health check endpoint: `https://hireai-waitlist.onrender.com/health` 