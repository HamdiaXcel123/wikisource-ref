# WikiSource Verifier - Complete Setup Guide

This guide will help you set up both the backend (Node.js/Express/MongoDB) and frontend (React/Vite) for the WikiSource Verifier platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## Project Structure

```
wikisource-ref/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   ├── .env.example        # Environment variables template
│   ├── .gitignore
│   └── package.json
│
├── wikimake-frontend/      # React/Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities & API client
│   │   └── main.tsx        # Entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── API_DOCUMENTATION.md    # Complete API documentation
├── REQUIREMENTS.TXT        # Project requirements
└── SETUP_GUIDE.md         # This file
```

---

## Part 1: Backend Setup

### Step 1: Install MongoDB

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will run as a Windows service automatically

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh

# You should see the MongoDB shell
# Type 'exit' to quit
```

### Step 3: Backend Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/wikisource-verifier

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-67890
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Important:** Change the JWT secrets to random, secure strings in production!

### Step 5: Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### Step 6: Test the Backend

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

---

## Part 2: Frontend Setup

### Step 1: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../wikimake-frontend

# Install dependencies
npm install

# Install missing TypeScript types
npm install --save-dev @types/react @types/react-dom
```

### Step 2: Configure Environment Variables

```bash
# Create environment file
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start the Frontend

```bash
# Development mode
npm run dev
```

You should see:
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Part 3: Testing the Full Stack

### 1. Create a Test User

**Option A: Using the Frontend**
1. Go to http://localhost:5173
2. Click "Login / Register"
3. Go to the "Register" tab
4. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Country: Select any country
5. Click "Create Account"

**Option B: Using API (curl)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "country": "Ghana"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

### 3. Submit a Reference

```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "url": "https://example.com/article",
    "title": "Test Article",
    "publisher": "Test Publisher",
    "country": "Ghana",
    "category": "secondary"
  }'
```

### 4. View Submissions

```bash
curl http://localhost:5000/api/submissions
```

---

## Part 4: Creating Admin and Verifier Users

By default, all registered users are "contributors". To create admin or verifier users:

### Method 1: Using MongoDB Shell

```bash
# Open MongoDB shell
mongosh

# Switch to the database
use wikisource-verifier

# Update a user's role to admin
db.users.updateOne(
  { username: "testuser" },
  { $set: { role: "admin" } }
)

# Update a user's role to verifier
db.users.updateOne(
  { username: "anotheruser" },
  { $set: { role: "verifier" } }
)

# Verify the update
db.users.find({ username: "testuser" })
```

### Method 2: Create Admin User Directly

```bash
mongosh

use wikisource-verifier

db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",  # You'll need to hash this
  country: "Ghana",
  role: "admin",
  points: 0,
  badges: [],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Part 5: User Roles & Permissions

### Contributor (Default)
- Submit references
- Update/delete own pending submissions
- View public directory
- View own profile

### Verifier
- All contributor permissions
- Verify submissions for their country
- View pending submissions for their country
- Earn 5 points per verification

### Admin
- All verifier permissions
- Manage all users
- Award badges
- Update user roles
- Deactivate/activate users
- Delete any submission
- View all statistics

---

## Part 6: Common Issues & Troubleshooting

### Issue: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: Check Services and start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change the port in backend/.env
PORT=5001
```

### Issue: CORS Errors

**Error:** `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS`

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Restart the backend server after changing `.env`

### Issue: JWT Token Errors

**Error:** `Token is invalid or expired`

**Solution:**
- Tokens expire after 15 minutes by default
- Use the refresh token to get a new access token
- Or login again

### Issue: TypeScript Errors in Frontend

**Error:** `Cannot find module 'react'`

**Solution:**
```bash
cd wikimake-frontend
npm install --save-dev @types/react @types/react-dom
```

---

## Part 7: Development Workflow

### Running Both Servers Simultaneously

**Option 1: Two Terminal Windows**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd wikimake-frontend
npm run dev
```

**Option 2: Using concurrently (from project root)**
```bash
# Install concurrently
npm install -g concurrently

# Run both
concurrently "cd backend && npm run dev" "cd wikimake-frontend && npm run dev"
```

### Making Code Changes

- **Backend changes:** Server auto-restarts with nodemon
- **Frontend changes:** Vite hot-reloads automatically
- **Environment variable changes:** Requires manual restart

---

## Part 8: Production Deployment

### Backend Deployment

1. **Set environment to production:**
```env
NODE_ENV=production
```

2. **Use a production MongoDB instance:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wikisource-verifier
```

3. **Generate secure JWT secrets:**
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Enable HTTPS and set secure cookies**

5. **Use a process manager like PM2:**
```bash
npm install -g pm2
pm2 start src/server.js --name wikisource-api
pm2 save
pm2 startup
```

### Frontend Deployment

1. **Build the frontend:**
```bash
cd wikimake-frontend
npm run build
```

2. **Deploy the `dist` folder to:**
   - Netlify
   - Vercel
   - GitHub Pages
   - Your own server with Nginx

3. **Update environment variables:**
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## Part 9: API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`.

Quick reference:

- **Authentication:** `/api/auth/*`
- **Submissions:** `/api/submissions/*`
- **Users:** `/api/users/*`

All authenticated endpoints require:
```
Authorization: Bearer <your_access_token>
```

---

## Part 10: Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  country: String,
  role: String (contributor|verifier|admin),
  points: Number,
  badges: Array,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Submissions Collection
```javascript
{
  url: String,
  title: String,
  publisher: String,
  country: String,
  category: String (primary|secondary|unreliable),
  status: String (pending|approved|rejected),
  submitter: ObjectId (ref: User),
  verifier: ObjectId (ref: User),
  wikipediaArticle: String,
  verifierNotes: String,
  verifiedAt: Date,
  fileType: String,
  fileName: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Support & Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Project Requirements:** See `REQUIREMENTS.TXT`
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express.js Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/

---

## Quick Start Summary

```bash
# 1. Start MongoDB
mongod  # or brew services start mongodb-community

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev

# 3. Setup Frontend (new terminal)
cd wikimake-frontend
npm install
npm install --save-dev @types/react @types/react-dom
cp .env.example .env
npm run dev

# 4. Open browser
# http://localhost:5173
```

---

## Next Steps

1. ✅ Complete backend and frontend setup
2. ✅ Create your first user account
3. ✅ Submit a test reference
4. ✅ Create an admin user via MongoDB
5. ✅ Test verification workflow
6. 📝 Customize the platform for your needs
7. 🚀 Deploy to production

Happy coding! 🎉
