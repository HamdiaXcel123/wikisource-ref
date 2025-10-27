# WikiSourceRef

A community-driven reference verification platform for Wikipedia editors and Wikimedia contributors. This platform enables crowdsourcing and curation of credible, country-based reference databases to support better citation practices on Wikipedia.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Quick Start Guide](#quick-start-guide)
- [Detailed Setup Guide](#detailed-setup-guide)
- [Wikimedia OAuth Setup](#wikimedia-oauth-setup)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Points & Gamification](#points--gamification)
- [Database Schema](#database-schema)
- [Deployment Guide](#deployment-guide)
- [Error Handling](#error-handling)
- [Known Issues & Limitations](#known-issues--limitations)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

WikiSourceRef helps the Wikipedia community maintain high-quality sources by:
- Allowing contributors to submit references for verification
- Enabling country-based verifiers to review and validate sources
- Providing a public directory of verified references
- Gamifying contributions with points and badges
- Supporting Wikimedia OAuth for seamless authentication

---

## Core Features

### 1. Reference Submission Form
Contributors can submit references with:
- **URL or PDF upload** - Submit web sources or upload PDF documents
- **DOI (Digital Object Identifier)** - For academic papers and journals
- **Media type classification** - Article, book, journal, website, video, podcast, or other
- **Country of origin selection** - Categorize sources by country
- **Source category**:
  - 📗 **Primary source** - Firsthand/original data
  - 📘 **Secondary source** - Reporting or analysis
  - 🚫 **Potentially unreliable** - Questionable editorial standards
- **Authors and publication date** - Comprehensive metadata
- **Optional Wikipedia article link** - Link to related Wikipedia articles

### 2. Verification Dashboard (Country Admins)
Country-based verifiers can:
- Review pending submissions for their country
- Mark sources as "Credible" or "Unreliable"
- Add verification notes
- Earn points for verification activities

### 3. Public Reference Directory
A searchable and filterable directory featuring:
- **Advanced filters** - By country, category, reliability, or media type
- **Detailed source information**:
  - Title, publisher, and URL/DOI
  - Country and reliability category
  - Verification date and verifier
  - Authors and publication date
- **API endpoints** - For external tool integration

### 4. Gamification & Community Metrics
- Points system for contributions and verifications
- Badge awards for milestones
- Country-based leaderboards
- User profiles with activity history

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI (shadcn/ui)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **State Management**: React Context API
- **Notifications**: Sonner (toast notifications)

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - Local (JWT-based)
  - Wikimedia OAuth 2.0
- **Session Management**: Express Session
- **Security**: Helmet, CORS, Rate Limiting (100 req/15min)
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

---

## Quick Start Guide

Get WikiSourceRef running locally in under 10 minutes!

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+ (or MongoDB Atlas account)
- Git

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd wikisource-ref

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../wikimake-frontend
npm install
```

### Step 2: Database Setup (2 minutes)

#### Option A: MongoDB Atlas (Recommended)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create database user
4. Get connection string

#### Option B: Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Connection string
mongodb://localhost:27017/wikisource-ref
```

### Step 3: Backend Configuration (2 minutes)

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your settings
```

**Minimal .env configuration:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=any-random-string-for-development
JWT_REFRESH_SECRET=another-random-string
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=session-secret-string
```

**Generate secrets quickly:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Frontend Configuration (1 minute)

```bash
cd ../wikimake-frontend

# Copy environment template
cp .env.example .env
```

**Frontend .env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd wikimake-frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### Step 6: Test the Application (2 minutes)

1. **Open Browser:** Navigate to `http://localhost:5173`
2. **Create Account:** Click "Get Started" and register
3. **Submit a Reference:** Fill in the submission form
4. **View Directory:** Browse submitted references

---

## Detailed Setup Guide

### MongoDB Installation

#### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will run as a Windows service automatically

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh

# You should see the MongoDB shell
# Type 'exit' to quit
```

### Backend Setup Details

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Complete Environment Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/wikisource-ref

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_SECRET=your-session-secret

# Wikimedia OAuth (Optional - for OAuth login)
WIKIMEDIA_CONSUMER_KEY=your-wikimedia-consumer-key
WIKIMEDIA_CONSUMER_SECRET=your-wikimedia-consumer-secret
WIKIMEDIA_CALLBACK_URL=http://localhost:5000/api/auth/wikimedia/callback

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Setup Details

```bash
# Navigate to frontend directory
cd wikimake-frontend

# Install dependencies
npm install

# Install TypeScript types (if needed)
npm install --save-dev @types/react @types/react-dom

# Create environment file
cp .env.example .env
```

**Frontend Environment:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Testing the Full Stack

#### Create a Test User

**Using the Frontend:**
1. Go to http://localhost:5173
2. Click "Login / Register"
3. Go to the "Register" tab
4. Fill in the form and create account

**Using API (curl):**
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

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Submit a Reference

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

### Creating Admin and Verifier Users

By default, all registered users are "contributors". To create admin or verifier users:

**Using MongoDB Shell:**
```bash
# Open MongoDB shell
mongosh

# Switch to the database
use wikisource-ref

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

---

## Wikimedia OAuth Setup

To enable Wikimedia OAuth login:

### Step 1: Register OAuth Consumer

1. Visit [Wikimedia OAuth Registration](https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration)
2. Log in with your Wikimedia account
3. Click "Propose an OAuth 2.0 client"
4. Fill in details:
   - **Application name**: WikiSourceRef
   - **Application description**: Community-driven reference verification platform
   - **OAuth "callback" URL**: `http://localhost:5000/api/auth/wikimedia/callback` (for development)
   - **Applicable grants**: 
     - Basic rights
     - View your email address (optional)

### Step 2: Save Credentials

1. Copy **Consumer Key** (Client ID)
2. Copy **Consumer Secret** (Client Secret)
3. Add to backend `.env` file:

```env
WIKIMEDIA_CONSUMER_KEY=your-consumer-key
WIKIMEDIA_CONSUMER_SECRET=your-consumer-secret
WIKIMEDIA_CALLBACK_URL=http://localhost:5000/api/auth/wikimedia/callback
```

### Step 3: Restart Backend

```bash
# Stop the backend (Ctrl+C)
npm run dev
```

### Step 4: Test OAuth

1. Go to login page
2. Click "Login with Wikimedia"
3. Authorize the application
4. Select your country

---

## API Documentation

### Authentication Endpoints

#### Local Authentication

**Register New User**
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "country": "string"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "accessToken": "string",
  "refreshToken": "string",
  "user": { ... }
}
```

**Logout**
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Get Current User**
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Refresh Access Token**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```

**Update Profile**
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "string",
  "country": "string"
}
```

**Change Password**
```
PUT /api/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}
```

#### Wikimedia OAuth

**Initiate OAuth Flow**
```
GET /api/auth/wikimedia
```

**OAuth Callback Handler**
```
GET /api/auth/wikimedia/callback?code=...&state=...
```

**Complete OAuth Setup**
```
POST /api/auth/wikimedia/setup
Content-Type: application/json

{
  "country": "string"
}
```

### Submission Endpoints

**Create Submission**
```
POST /api/submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "string",
  "doi": "string (optional)",
  "title": "string",
  "publisher": "string",
  "country": "string",
  "category": "primary|secondary|unreliable",
  "mediaType": "article|book|journal|website|pdf|video|podcast|other",
  "authors": ["string"],
  "publicationDate": "date (optional)",
  "wikipediaArticle": "string (optional)"
}
```

**Get All Submissions**
```
GET /api/submissions?country=Ghana&status=approved&category=secondary
```

**Get Single Submission**
```
GET /api/submissions/:id
```

**Get User's Submissions**
```
GET /api/submissions/my/submissions
Authorization: Bearer <token>
```

**Update Submission**
```
PUT /api/submissions/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Delete Submission**
```
DELETE /api/submissions/:id
Authorization: Bearer <token>
```

**Verify Submission (Verifier/Admin)**
```
PUT /api/submissions/:id/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved|rejected",
  "verifierNotes": "string (optional)"
}
```

**Get Pending Submissions for Country**
```
GET /api/submissions/pending/country
Authorization: Bearer <token>
```

**Get Submission Statistics**
```
GET /api/submissions/stats
```

### User Endpoints

**Get All Users (Admin)**
```
GET /api/users
Authorization: Bearer <token>
```

**Get User Profile**
```
GET /api/users/:id
```

**Get Leaderboard**
```
GET /api/users/leaderboard?country=Ghana
```

**Award Badge (Admin)**
```
POST /api/users/:id/badge
Authorization: Bearer <token>
Content-Type: application/json

{
  "badgeName": "string"
}
```

**Update User Role (Admin)**
```
PUT /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "contributor|verifier|admin"
}
```

**Deactivate User (Admin)**
```
PUT /api/users/:id/deactivate
Authorization: Bearer <token>
```

**Activate User (Admin)**
```
PUT /api/users/:id/activate
Authorization: Bearer <token>
```

---

## User Roles & Permissions

### Contributor (Default)
**Permissions:**
- Submit references for verification
- Update/delete own pending submissions
- View public directory
- View own profile
- Earn points and badges

### Verifier
**Permissions:**
- All contributor permissions
- Verify submissions for their country
- View pending submissions for their country
- Add verification notes
- Earn 5 points per verification

### Admin
**Permissions:**
- All verifier permissions
- Manage all users
- Award badges
- Update user roles
- Deactivate/activate users
- Delete any submission
- View all statistics
- Review submissions from all countries

---

## Points & Gamification

### Point System

**Earning Points:**
- **Submit reference**: +10 points
- **Reference approved**: +25 points (additional bonus)
- **Verify submission**: +5 points

### Badge System

Badges are awarded automatically based on achievements:

- **First Steps**: Submit first reference
- **Contributor**: 10 verified submissions
- **Expert**: 50 verified submissions
- **Guardian**: Verify 25 references
- **Country Champion**: Top contributor in country
- **Global Leader**: Top 10 globally

### Leaderboards

- **Global Leaderboard**: Top contributors worldwide
- **Country Leaderboard**: Top contributors per country
- **Recent Activity**: Trending contributors

---

## Database Schema

### User Collection

```javascript
{
  username: String (unique, required),
  email: String (unique, optional for OAuth),
  password: String (hashed, optional for OAuth),
  country: String (required),
  role: String (enum: 'contributor', 'verifier', 'admin'),
  points: Number (default: 0),
  badges: Array,
  isActive: Boolean (default: true),
  
  // OAuth fields
  wikimediaId: String (unique, sparse),
  wikimediaUsername: String,
  authProvider: String (enum: 'local', 'wikimedia'),
  
  // Token management
  refreshTokens: Array,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Submission Collection

```javascript
{
  url: String,
  doi: String (optional),
  title: String (required),
  publisher: String (required),
  country: String (required),
  category: String (enum: 'primary', 'secondary', 'unreliable'),
  status: String (enum: 'pending', 'approved', 'rejected'),
  
  // Metadata
  mediaType: String (enum: 'article', 'book', 'journal', 'website', 'pdf', 'video', 'podcast', 'other'),
  authors: Array,
  publicationDate: Date,
  accessDate: Date,
  language: String (default: 'en'),
  
  // References
  submitter: ObjectId (ref: 'User'),
  verifier: ObjectId (ref: 'User'),
  
  // Verification
  verifierNotes: String,
  verifiedAt: Date,
  
  // File upload
  fileType: String,
  fileName: String,
  
  // Additional
  wikipediaArticle: String,
  reliabilityScore: Number,
  wikidataId: String,
  tags: Array,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## Deployment Guide

### Backend Deployment

#### Option 1: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend directory
cd backend

# Initialize Railway project
railway init

# Deploy
railway up
```

**Configure Environment Variables in Railway Dashboard:**
- Add all variables from `.env.example`
- Set `NODE_ENV=production`
- Use production MongoDB URI

#### Option 2: Heroku

```bash
# Create Heroku app
heroku create wikisource-ref-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

#### Option 3: DigitalOcean App Platform

1. Connect your GitHub repository
2. Select the `backend` directory
3. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
4. Add environment variables
5. Deploy

### Frontend Deployment

#### Option 1: Netlify (Recommended)

**Create `netlify.toml` in `wikimake-frontend/`:**
```toml
[build]
  base = "wikimake-frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deploy:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd wikimake-frontend

# Build
npm run build

# Deploy
netlify deploy --prod
```

**Set Environment Variables in Netlify:**
- `VITE_API_URL` = your backend URL

#### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd wikimake-frontend
vercel --prod
```

**Configure Environment:**
- Add `VITE_API_URL` in Vercel dashboard

#### Option 3: Cloudflare Pages

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `wikimake-frontend`
3. Add `VITE_API_URL` environment variable

### Database Setup (Production)

#### MongoDB Atlas

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Configure network access: Add `0.0.0.0/0` or specific IPs
3. Create database user with strong password
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/wikisource-ref?retryWrites=true&w=majority
   ```

### Security Considerations

**Production Checklist:**
- [ ] Use HTTPS for both frontend and backend
- [ ] Generate strong JWT secrets (64+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for production frontend domain
- [ ] Use production MongoDB with authentication
- [ ] Rotate secrets regularly
- [ ] Enable rate limiting
- [ ] Set secure session cookies
- [ ] Update Wikimedia OAuth callback URL to production URL

**Generate Secure Secrets:**
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 64
```

---

## Error Handling

### Toast Notifications

All forms display errors using toast notifications for better user experience.

#### Login Form Errors

**Client-side Validation:**
- Empty username or password: "Please enter both username and password"

**Backend Errors:**
- Invalid credentials: "Invalid credentials"
- Network errors: "Network error: Unable to connect to server. Please check your connection."

**Success:**
- "Login successful!"

#### Registration Form Errors

**Client-side Validation:**
- Empty username: "Please enter a username"
- Empty email: "Please enter an email address"
- Empty password: "Please enter a password"
- Short password: "Password must be at least 6 characters long"
- No country selected: "Please select a country"

**Success:**
- "Registration successful!"

#### Submission Form Errors

**Client-side Validation:**
- Not logged in: "Please login to submit references" (redirects to auth)
- Empty title: "Please enter a title for the reference"
- Empty publisher: "Please enter the publisher name"
- Empty URL: "Please enter a URL"
- Invalid URL format: "Please enter a valid URL (must start with http:// or https://)"
- No PDF uploaded: "Please upload a PDF file"
- No country selected: "Please select a country for this reference"
- File too large: "File size must be less than 10MB"
- Invalid file type: "Only PDF files are allowed"

**Success:**
- "Reference submitted successfully! (+10 points)"

### API Error Format

**Validation Errors:**
```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Email is already in use" },
    { "field": "username", "message": "Username must be at least 3 characters" }
  ]
}
```

**Single Error:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Known Issues & Limitations

### Critical Issues

#### 1. Wikimedia OAuth Callback Error
**Status:** Not Working  
**Description:** OAuth authentication flow completes successfully and users can authenticate with their Wikimedia account, but the callback handler fails to properly redirect users back to the frontend with authentication tokens.

**Current Behavior:**
- User clicks "Login with Wikimedia"
- Successfully authenticates on Wikimedia
- Callback receives user data
- Error occurs during token response or redirect

**Affected Files:**
- `backend/src/controllers/authController.js` - `wikimediaCallback` function
- `backend/src/routes/authRoutes.js` - OAuth callback route
- `backend/src/config/passport.js` - Passport OAuth2 strategy

**Workaround:** Use local authentication (email/password) instead of OAuth.

**To Fix:** 
- Review the `sendTokenResponse` function in OAuth callback
- Ensure proper redirect to frontend with tokens
- Check session handling and cookie configuration for OAuth flow

---

### Pages Not Fully Implemented

#### 2. Settings Page
**Status:** Frontend Complete, Backend Working, Integration Issues  
**Description:** The settings page UI is fully implemented with notification preferences, privacy controls, and account settings, but some features may not persist correctly.

**What Works:**
- Settings retrieval (`GET /api/settings`)
- Settings update (`PUT /api/settings`)
- Settings reset (`POST /api/settings/reset`)

**What Needs Work:**
- Two-factor authentication (UI only, no backend implementation)
- Email notification sending (settings save but emails not sent)
- Session timeout enforcement
- Account deletion functionality (button present but not connected)

**Affected Files:**
- `frontend/src/pages/Settings.tsx`
- `backend/src/controllers/settingsController.js`
- `backend/src/models/UserSettings.js`

---

#### 3. Analytics Page
**Status:** Partially Implemented  
**Description:** Analytics dashboard displays user statistics and performance metrics, but some advanced analytics features are incomplete.

**What Works:**
- User submission statistics
- Approval rates
- Points and badges display
- Basic dashboard metrics

**What Needs Work:**
- Submission trends visualization (data fetched but charts not rendered)
- Country statistics display
- Category distribution charts
- Time-period filtering may not update correctly
- Export functionality not implemented

**Affected Files:**
- `frontend/src/pages/Analytics.tsx`
- `backend/src/controllers/analyticsController.js`

---

#### 4. Notifications System
**Status:** Backend Complete, Frontend Complete, Email Delivery Not Implemented  
**Description:** In-app notifications work correctly, but email notifications are not sent.

**What Works:**
- Creating notifications
- Marking as read/unread
- Deleting notifications
- Notification count badge

**What Needs Work:**
- Email delivery service integration (SendGrid, AWS SES, etc.)
- Push notifications
- Real-time notification updates (WebSocket/SSE)
- Notification grouping and batching

**Affected Files:**
- `frontend/src/pages/Notifications.tsx`
- `backend/src/controllers/notificationController.js`

---

#### 5. Bookmarks Feature
**Status:** Fully Implemented, Minor Issues  
**Description:** Bookmarks functionality is complete but could benefit from additional features.

**What Works:**
- Adding/removing bookmarks
- Organizing into folders
- Adding notes and tags
- Filtering by folder

**What Needs Work:**
- Bulk operations (delete multiple, move multiple)
- Search within bookmarks
- Export bookmarks
- Share bookmarks with other users

**Affected Files:**
- `frontend/src/pages/Bookmarks.tsx`
- `backend/src/controllers/bookmarkController.js`

---

#### 6. Activity Feed
**Status:** Fully Implemented  
**Description:** Activity feed is working correctly for both personal and community activities.

**Known Limitations:**
- No real-time updates (requires page refresh)
- Limited activity types tracked
- No activity filtering by date range

**Affected Files:**
- `frontend/src/pages/ActivityFeed.tsx`
- `backend/src/controllers/activityController.js`

---

#### 7. Help Page
**Status:** Static Content Only  
**Description:** Help page displays FAQ and guides but lacks interactive features.

**What Needs Work:**
- Search functionality within help content
- Video tutorials (placeholders only)
- Interactive guides
- Contact support form
- Live chat integration

**Affected Files:**
- `frontend/src/pages/Help.tsx`

---

### Backend Features Not Implemented

#### 8. File Upload for PDF References
**Status:** Partially Implemented  
**Description:** Frontend has UI for PDF upload, but backend file handling is incomplete.

**What Needs Work:**
- File storage configuration (local vs cloud)
- File validation and virus scanning
- PDF text extraction for searchability
- File size limits enforcement
- Cleanup of orphaned files

**Affected Files:**
- `backend/src/controllers/submissionController.js`
- `backend/src/routes/submissionRoutes.js`

---

#### 9. Email Service Integration
**Status:** Not Implemented  
**Description:** No email service is configured for sending notifications, password resets, or verification emails.

**What Needs Work:**
- Email service provider integration (SendGrid, AWS SES, Mailgun)
- Email templates
- Password reset flow
- Email verification for new accounts
- Weekly digest emails

---

#### 10. Advanced Search & Filtering
**Status:** Basic Implementation Only  
**Description:** Public directory has basic filtering, but advanced search features are missing.

**What Needs Work:**
- Full-text search across submissions
- Advanced filter combinations
- Search by DOI, ISBN, or other identifiers
- Saved search queries
- Search result export

**Affected Files:**
- `frontend/src/pages/PublicDirectory.tsx`
- `backend/src/controllers/submissionController.js`

---

### Security & Performance Issues

#### 11. Rate Limiting
**Status:** Basic Implementation  
**Description:** Rate limiting is configured globally but not fine-tuned per endpoint.

**What Needs Work:**
- Per-endpoint rate limits
- User-based rate limiting (different limits for different roles)
- Rate limit bypass for trusted IPs
- Better rate limit error messages

**Affected Files:**
- `backend/src/server.js`

---

#### 12. Input Validation
**Status:** Partially Implemented  
**Description:** Basic validation exists but could be more comprehensive.

**What Needs Work:**
- URL validation and sanitization
- DOI format validation
- File type validation
- XSS protection in user-generated content
- SQL injection prevention (using Mongoose helps, but review needed)

**Affected Files:**
- `backend/src/middleware/validator.js`

---

### Features Mentioned in Documentation But Not Implemented

#### 13. Wikidata Integration
**Status:** Not Implemented  
**Description:** README mentions Wikidata integration for publisher verification, but this is not implemented.

**Affected Files:**
- None (needs to be created)

---

#### 14. Public API with API Keys
**Status:** Not Implemented  
**Description:** No public API endpoint with API key authentication for external integrations.

**What Needs Work:**
- API key generation and management
- API key authentication middleware
- API documentation for external developers
- Rate limiting per API key

---

#### 15. Batch Submission Upload
**Status:** Not Implemented  
**Description:** No functionality to upload multiple submissions at once via CSV or JSON.

---

#### 16. Export Functionality
**Status:** Not Implemented  
**Description:** No export options for submissions, user data, or reports (CSV, JSON, PDF).

---

### Minor Issues & Enhancements Needed

#### 17. Dark Mode
**Status:** Partial Support  
**Description:** UI components have dark mode classes, but theme switching is not fully implemented.

---

#### 18. Mobile Responsiveness
**Status:** Mostly Responsive  
**Description:** Most pages are responsive, but some complex layouts may need adjustment for mobile devices.

---

#### 19. Accessibility
**Status:** Basic Compliance  
**Description:** Basic accessibility features present, but comprehensive WCAG 2.1 compliance not verified.

---

#### 20. Internationalization (i18n)
**Status:** Not Implemented  
**Description:** Application is English-only. Multi-language support is planned but not implemented.

---

## Contributing to Fix These Issues

Developers are welcome to work on any of these issues! Please:

1. Check the "Affected Files" section for each issue
2. Create a new branch for your fix
3. Test thoroughly before submitting a PR
4. Update this section when an issue is resolved
5. Add tests for new functionality

For major features (OAuth fix, email service, etc.), please open an issue first to discuss the implementation approach.

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed

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

#### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change the port in backend/.env
PORT=5001
```

#### CORS Errors

**Error:** `Access to fetch blocked by CORS`

**Solution:**
- Check `FRONTEND_URL` in backend `.env`
- Check `VITE_API_URL` in frontend `.env`
- Restart both servers

#### JWT Token Errors

**Error:** `Token is invalid or expired`

**Solution:**
- Tokens expire after 15 minutes by default
- Use the refresh token to get a new access token
- Or login again

#### Module Not Found

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Health Check

Test if backend is running:
```bash
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Database Inspection

```bash
# Connect to MongoDB
mongosh

# Switch to database
use wikisource-ref

# View collections
show collections

# View users
db.users.find().pretty()

# View submissions
db.submissions.find().pretty()
```

---

## Changelog

### Version 2.0.0 (Current) - Major Update

**Wikimedia OAuth Integration:**
- Added Passport.js with OAuth2 strategy
- Dual authentication support (local + Wikimedia)
- OAuth user country setup flow
- Seamless account linking

**Enhanced Submission Model:**
- Added DOI field for academic papers
- Media type classification (8 types)
- Authors array and publication date
- Reliability score and Wikidata integration
- Language and access date fields

**UI/UX Improvements:**
- Toast notifications for all forms
- Protected routes with authentication guards
- Visual feedback for logged-in users
- Enhanced submission form with metadata fields
- Submitter display in public directory

**Security Enhancements:**
- Session management for OAuth
- Secure cookie handling
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization

**Documentation:**
- Comprehensive README
- Complete API documentation
- Deployment guides for multiple platforms
- Troubleshooting guide

### Version 1.0.0 (Previous)

- Basic submission and verification system
- Local authentication with JWT
- Public directory with filtering
- Admin dashboard
- Gamification system (points and badges)

---

## Contributing

Contributions are welcome! Please follow these steps:

### Development Workflow

1. **Fork the repository**
2. **Create feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes:**
   - Edit files
   - Test locally
   - Commit frequently
4. **Test thoroughly:**
   - Test all affected features
   - Check console for errors
   - Verify API responses
5. **Submit PR:**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Style

- **Backend:** Follow existing Express patterns
- **Frontend:** Use TypeScript, React hooks, and functional components
- **Formatting:** Use consistent indentation (2 spaces)
- **Comments:** Add comments for complex logic

### Testing Checklist

- [ ] User can register and login
- [ ] Wikimedia OAuth working (if configured)
- [ ] User can submit references
- [ ] Verifier can review submissions
- [ ] Admin can manage users
- [ ] Points are awarded correctly
- [ ] Leaderboard displays correctly
- [ ] All forms show proper error messages

---

## License

MIT License

Copyright (c) 2025 WikiSourceRef

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Support

For issues, questions, or suggestions:
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check this README first
- **Wikimedia IRC**: #wikimedia-tech
- **Community**: Join Wikimedia community discussions

---

## Acknowledgments

- **Wikimedia Foundation** - For OAuth support and inspiration
- **Wikipedia Community** - For the mission to improve citation quality
- **shadcn/ui** - For beautiful UI components (MIT License)
- **All Contributors** - For making this platform better

---

## Future Enhancements

### Phase 2 (Planned)
- Public API with rate limiting and API keys
- Wikidata integration for publisher verification
- Advanced search with Elasticsearch
- Email notifications for verifiers
- Export functionality (CSV, JSON)
- Batch submission upload

### Phase 3 (Future)
- Machine learning for automatic reliability scoring
- Wikipedia gadget/userscript integration
- Multi-language support
- Mobile applications (iOS/Android)
- Browser extension for quick source checking

### Phase 4 (Long-term)
- Integration with Wikipedia citation templates
- Collaborative verification workflows
- Source quality analytics dashboard
- Real-time collaboration features
- Advanced analytics and reporting

---

**Built with ❤️ for the Wikipedia community**

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Maintained By:** WikiSourceRef Team

