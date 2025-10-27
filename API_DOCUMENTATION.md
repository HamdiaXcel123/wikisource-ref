# WikiSource Ref API Documentation

## Table of Contents
- [Authentication Endpoints](#authentication-endpoints)
- [Submission Endpoints](#submission-endpoints)
- [User Endpoints](#user-endpoints)
- [Activity Endpoints](#activity-endpoints)
- [Analytics Endpoints](#analytics-endpoints)
- [Bookmark Endpoints](#bookmark-endpoints)
- [Notification Endpoints](#notification-endpoints)
- [Settings Endpoints](#settings-endpoints)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)
- [User Roles](#user-roles)
- [Gamification System](#gamification-system)
- [Setup Instructions](#setup-instructions)

---

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

Tokens are also sent as HTTP-only cookies for enhanced security.

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "country": "Ghana"
}
```

**Response (201):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "country": "Ghana",
    "role": "contributor",
    "points": 0,
    "badges": [],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

**Validation Rules:**
- Username: 3-30 characters, alphanumeric and underscores only
- Email: Valid email format
- Password: Minimum 6 characters
- Country: Required

---

### Login
**POST** `/auth/login`

Authenticate a user and receive tokens.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "country": "Ghana",
    "role": "contributor",
    "points": 150,
    "badges": [],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

---

### Logout
**POST** `/auth/logout`

Logout the current user (clears cookies).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "country": "Ghana",
    "role": "contributor",
    "points": 150,
    "badges": [],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "country": "Ghana",
    "role": "contributor",
    "points": 150,
    "badges": [],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

---

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "country": "Nigeria"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "newemail@example.com",
    "country": "Nigeria",
    "role": "contributor",
    "points": 150,
    "badges": [],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

---

### Change Password
**PUT** `/auth/password`

Change user password (local auth only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

**Note:** OAuth users cannot change passwords through this endpoint.

---

### Wikimedia OAuth Login
**GET** `/auth/wikimedia`

Initiate Wikimedia OAuth 2.0 authentication flow.

**Response:** Redirects to Wikimedia OAuth authorization page

---

### Wikimedia OAuth Callback
**GET** `/auth/wikimedia/callback`

OAuth callback endpoint (handled automatically by Passport).

**Response:** 
- Success: Redirects to frontend with tokens
- New user without country: Redirects to setup page
- Error: Redirects to frontend with error parameter

---

### Complete Wikimedia Setup
**POST** `/auth/wikimedia/setup`

Complete OAuth setup by providing country information.

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "country": "Ghana"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "wikimediauser",
    "wikimediaUsername": "wikimediauser",
    "authProvider": "wikimedia",
    "country": "Ghana",
    "role": "contributor",
    "points": 0,
    "badges": [],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  }
}
```

---

## Submission Endpoints

### Create Submission
**POST** `/submissions`

Submit a new reference for verification.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "doi": "10.1234/example.2024",
  "title": "Climate Change Report 2024",
  "publisher": "Ghana Environmental Agency",
  "mediaType": "article",
  "authors": ["John Doe", "Jane Smith"],
  "publicationDate": "2024-01-15",
  "country": "Ghana",
  "category": "secondary",
  "wikipediaArticle": "https://en.wikipedia.org/wiki/Climate_change",
  "fileType": "url",
  "language": "en"
}
```

**Optional Fields:**
- `doi`: Digital Object Identifier
- `mediaType`: article, book, journal, website, pdf, video, podcast, other
- `authors`: Array of author names
- `publicationDate`: ISO date string
- `wikipediaArticle`: Wikipedia article URL
- `fileName`: For PDF uploads
- `wikidataId`: Wikidata identifier
- `language`: ISO language code (default: en)

**Response (201):**
```json
{
  "success": true,
  "submission": {
    "id": "507f1f77bcf86cd799439012",
    "url": "https://example.com/article",
    "title": "Climate Change Report 2024",
    "publisher": "Ghana Environmental Agency",
    "country": "Ghana",
    "category": "secondary",
    "status": "pending",
    "submitter": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "country": "Ghana"
    },
    "wikipediaArticle": "https://en.wikipedia.org/wiki/Climate_change",
    "fileType": "url",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Points Awarded:** 10 points for submission

---

### Get All Submissions
**GET** `/submissions`

Get all submissions with optional filters.

**Query Parameters:**
- `country` (optional): Filter by country
- `category` (optional): Filter by category (primary, secondary, unreliable)
- `status` (optional): Filter by status (pending, approved, rejected)
- `search` (optional): Search in title and publisher
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Example:**
```
GET /submissions?country=Ghana&status=approved&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "submissions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "url": "https://example.com/article",
      "title": "Climate Change Report 2024",
      "publisher": "Ghana Environmental Agency",
      "country": "Ghana",
      "category": "secondary",
      "status": "approved",
      "submitter": {
        "id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "country": "Ghana"
      },
      "verifier": {
        "id": "507f1f77bcf86cd799439013",
        "username": "janeverifier",
        "country": "Ghana"
      },
      "verifierNotes": "Credible government source",
      "verifiedAt": "2025-01-16T14:20:00.000Z",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-16T14:20:00.000Z"
    }
  ]
}
```

---

### Get Single Submission
**GET** `/submissions/:id`

Get detailed information about a specific submission.

**Response (200):**
```json
{
  "success": true,
  "submission": {
    "id": "507f1f77bcf86cd799439012",
    "url": "https://example.com/article",
    "title": "Climate Change Report 2024",
    "publisher": "Ghana Environmental Agency",
    "country": "Ghana",
    "category": "secondary",
    "status": "approved",
    "submitter": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "country": "Ghana",
      "role": "contributor",
      "points": 150,
      "badges": []
    },
    "verifier": {
      "id": "507f1f77bcf86cd799439013",
      "username": "janeverifier",
      "country": "Ghana",
      "role": "verifier"
    },
    "wikipediaArticle": "https://en.wikipedia.org/wiki/Climate_change",
    "verifierNotes": "Credible government source",
    "verifiedAt": "2025-01-16T14:20:00.000Z",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-16T14:20:00.000Z"
  }
}
```

---

### Get My Submissions
**GET** `/submissions/my/submissions`

Get all submissions created by the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "page": 1,
  "pages": 1,
  "submissions": [ ... ]
}
```

---

### Update Submission
**PUT** `/submissions/:id`

Update a pending submission (only by submitter).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "publisher": "Updated Publisher",
  "category": "primary",
  "wikipediaArticle": "https://en.wikipedia.org/wiki/New_article"
}
```

**Response (200):**
```json
{
  "success": true,
  "submission": { ... }
}
```

**Note:** Can only update submissions with status "pending"

---

### Delete Submission
**DELETE** `/submissions/:id`

Delete a submission (submitter or admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Submission deleted successfully"
}
```

---

### Verify Submission
**PUT** `/submissions/:id/verify`

Verify or reject a submission (verifier/admin only).

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** verifier, admin

**Request Body:**
```json
{
  "status": "approved",
  "verifierNotes": "Credible government source with proper citations"
}
```

**Response (200):**
```json
{
  "success": true,
  "submission": {
    "id": "507f1f77bcf86cd799439012",
    "status": "approved",
    "verifier": {
      "id": "507f1f77bcf86cd799439013",
      "username": "janeverifier",
      "country": "Ghana"
    },
    "verifierNotes": "Credible government source with proper citations",
    "verifiedAt": "2025-01-16T14:20:00.000Z",
    ...
  }
}
```

**Points Awarded:**
- Submitter: 25 points (if approved)
- Verifier: 5 points

---

### Get Pending Submissions for Country
**GET** `/submissions/pending/country`

Get pending submissions for the verifier's country.

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** verifier, admin

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 10,
  "page": 1,
  "pages": 1,
  "submissions": [ ... ]
}
```

---

### Get Submission Statistics
**GET** `/submissions/stats`

Get statistics about submissions.

**Query Parameters:**
- `country` (optional): Filter by country

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total": 500,
    "pending": 50,
    "approved": 400,
    "rejected": 50,
    "primary": 100,
    "secondary": 350,
    "unreliable": 50
  },
  "topCountries": [
    {
      "_id": "Ghana",
      "count": 150
    },
    {
      "_id": "Nigeria",
      "count": 120
    }
  ]
}
```

---

## User Endpoints

### Get User Profile
**GET** `/users/:id`

Get a user's public profile and statistics.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "country": "Ghana",
    "role": "contributor",
    "points": 150,
    "badges": [
      {
        "name": "First Submission",
        "icon": "🎯",
        "earnedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "joinDate": "2025-01-15T10:30:00.000Z",
    "isActive": true
  },
  "stats": {
    "total": 15,
    "approved": 12,
    "pending": 2,
    "rejected": 1
  }
}
```

---

### Get Leaderboard
**GET** `/users/leaderboard`

Get top users by points.

**Query Parameters:**
- `country` (optional): Filter by country
- `limit` (optional, default: 20): Number of users to return

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "country": "Ghana",
      "role": "contributor",
      "points": 500,
      "badges": [ ... ],
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get All Users (Admin)
**GET** `/users`

Get all users with filters (admin only).

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** admin

**Query Parameters:**
- `role` (optional): Filter by role
- `country` (optional): Filter by country
- `search` (optional): Search username or email
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "total": 250,
  "page": 1,
  "pages": 13,
  "users": [ ... ]
}
```

---

### Award Badge (Admin)
**POST** `/users/:id/badge`

Award a badge to a user (admin only).

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** admin

**Request Body:**
```json
{
  "name": "Top Contributor",
  "icon": "🏆"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### Update User Role (Admin)
**PUT** `/users/:id/role`

Update a user's role (admin only).

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** admin

**Request Body:**
```json
{
  "role": "verifier"
}
```

**Valid Roles:** contributor, verifier, admin

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### Deactivate User (Admin)
**PUT** `/users/:id/deactivate`

Deactivate a user account (admin only).

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** admin

**Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": { ... }
}
```

---

### Activate User (Admin)
**PUT** `/users/:id/activate`

Activate a user account (admin only).

**Headers:** `Authorization: Bearer <token>`

**Roles Required:** admin

**Response (200):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": { ... }
}
```

---

## Activity Endpoints

### Get User Activities
**GET** `/activities`

Get activity history for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `type` (optional): Filter by activity type

**Activity Types:**
- `submission_created`
- `submission_verified`
- `badge_earned`
- `role_changed`
- `profile_updated`
- `login`
- `logout`

**Response (200):**
```json
{
  "success": true,
  "activities": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user": "507f1f77bcf86cd799439011",
      "type": "submission_created",
      "description": "Created a new submission",
      "metadata": {
        "submissionId": "507f1f77bcf86cd799439012"
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 3
  }
}
```

**Note:** Activities are automatically deleted after 180 days.

---

### Get Community Activities
**GET** `/activities/community`

Get public activity feed from all users.

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `type` (optional): Filter by activity type

**Response (200):**
```json
{
  "success": true,
  "activities": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "country": "Ghana",
        "role": "contributor",
        "badges": []
      },
      "type": "submission_created",
      "description": "Created a new submission",
      "metadata": {},
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 200,
    "page": 1,
    "pages": 10
  }
}
```

---

## Analytics Endpoints

### Get Dashboard Statistics
**GET** `/analytics/dashboard`

Get comprehensive dashboard statistics for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "user": {
      "submissions": 15,
      "approved": 12,
      "pending": 2,
      "points": 150,
      "badges": 3,
      "recentActivity": 8
    },
    "global": {
      "totalSubmissions": 500,
      "pendingVerification": 50,
      "totalUsers": 250,
      "totalVerifiers": 25
    }
  }
}
```

**Note:** Global stats are only available for verifiers and admins.

---

### Get Submission Trends
**GET** `/analytics/trends`

Get submission trends over time.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional, default: 30d): Time period (7d, 30d, 90d)

**Response (200):**
```json
{
  "success": true,
  "trends": [
    {
      "_id": {
        "date": "2025-01-15",
        "status": "approved"
      },
      "count": 12
    },
    {
      "_id": {
        "date": "2025-01-15",
        "status": "pending"
      },
      "count": 5
    }
  ]
}
```

---

### Get Category Distribution
**GET** `/analytics/categories`

Get distribution of submissions by category.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "distribution": [
    {
      "_id": "secondary",
      "count": 350
    },
    {
      "_id": "primary",
      "count": 100
    },
    {
      "_id": "unreliable",
      "count": 50
    }
  ]
}
```

---

### Get Country Statistics
**GET** `/analytics/countries`

Get submission statistics by country (top 20).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "countryStats": [
    {
      "_id": "Ghana",
      "total": 150,
      "approved": 120,
      "pending": 20,
      "rejected": 10
    },
    {
      "_id": "Nigeria",
      "total": 120,
      "approved": 100,
      "pending": 15,
      "rejected": 5
    }
  ]
}
```

---

### Get User Performance
**GET** `/analytics/performance/:userId?`

Get performance metrics for a user. If no userId is provided, returns data for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "performance": {
    "submissions": 15,
    "verifications": 8,
    "activities": 45,
    "approvalRate": 80.00
  }
}
```

---

## Bookmark Endpoints

### Get Bookmarks
**GET** `/bookmarks`

Get all bookmarks for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `folder` (optional): Filter by folder name

**Response (200):**
```json
{
  "success": true,
  "bookmarks": [
    {
      "id": "507f1f77bcf86cd799439015",
      "user": "507f1f77bcf86cd799439011",
      "submission": {
        "id": "507f1f77bcf86cd799439012",
        "title": "Climate Change Report 2024",
        "url": "https://example.com/article",
        "submitter": {
          "username": "johndoe",
          "country": "Ghana"
        }
      },
      "notes": "Important reference for my research",
      "tags": ["climate", "research"],
      "folder": "research",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "folders": ["default", "research", "favorites"],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 2
  }
}
```

---

### Add Bookmark
**POST** `/bookmarks`

Bookmark a submission.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "submissionId": "507f1f77bcf86cd799439012",
  "notes": "Important reference for my research",
  "tags": ["climate", "research"],
  "folder": "research"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Bookmark added",
  "bookmark": {
    "id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "submission": { ... },
    "notes": "Important reference for my research",
    "tags": ["climate", "research"],
    "folder": "research",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Update Bookmark
**PUT** `/bookmarks/:id`

Update a bookmark's notes, tags, or folder.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notes": "Updated notes",
  "tags": ["climate", "research", "important"],
  "folder": "favorites"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Bookmark updated",
  "bookmark": { ... }
}
```

---

### Delete Bookmark
**DELETE** `/bookmarks/:id`

Remove a bookmark.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Bookmark removed"
}
```

---

### Check Bookmark Status
**GET** `/bookmarks/check/:submissionId`

Check if a submission is bookmarked by the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "bookmarked": true,
  "bookmark": {
    "id": "507f1f77bcf86cd799439015",
    "notes": "Important reference",
    "tags": ["climate"],
    "folder": "research"
  }
}
```

---

## Notification Endpoints

### Get Notifications
**GET** `/notifications`

Get notifications for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `unreadOnly` (optional, default: false): Show only unread notifications

**Response (200):**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "507f1f77bcf86cd799439016",
      "user": "507f1f77bcf86cd799439011",
      "type": "submission_approved",
      "title": "Submission Approved",
      "message": "Your submission 'Climate Change Report 2024' has been approved!",
      "link": "/submissions/507f1f77bcf86cd799439012",
      "read": false,
      "metadata": {
        "submissionId": "507f1f77bcf86cd799439012",
        "points": 25
      },
      "createdAt": "2025-01-16T14:20:00.000Z"
    }
  ],
  "pagination": {
    "total": 30,
    "page": 1,
    "pages": 2
  },
  "unreadCount": 5
}
```

**Notification Types:**
- `submission_approved`
- `submission_rejected`
- `badge_earned`
- `new_verifier`
- `points_earned`
- `comment_reply`
- `system_announcement`
- `verification_request`

**Note:** Notifications are automatically deleted after 90 days.

---

### Mark Notification as Read
**PUT** `/notifications/:id/read`

Mark a specific notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "notification": {
    "id": "507f1f77bcf86cd799439016",
    "read": true,
    ...
  }
}
```

---

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

Mark all notifications as read for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### Delete Notification
**DELETE** `/notifications/:id`

Delete a notification.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Settings Endpoints

### Get User Settings
**GET** `/settings`

Get settings for the authenticated user. Creates default settings if none exist.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "settings": {
    "id": "507f1f77bcf86cd799439017",
    "user": "507f1f77bcf86cd799439011",
    "notifications": {
      "email": {
        "enabled": true,
        "submissionApproved": true,
        "submissionRejected": true,
        "badgeEarned": true,
        "weeklyDigest": true
      },
      "push": {
        "enabled": false,
        "submissionApproved": true,
        "submissionRejected": true,
        "badgeEarned": true
      },
      "inApp": {
        "enabled": true,
        "submissionApproved": true,
        "submissionRejected": true,
        "badgeEarned": true,
        "verificationRequest": true
      }
    },
    "privacy": {
      "profileVisibility": "public",
      "showEmail": false,
      "showCountry": true,
      "showBadges": true,
      "showActivity": true,
      "allowMessages": true
    },
    "display": {
      "theme": "system",
      "language": "en",
      "itemsPerPage": 20,
      "compactMode": false
    },
    "account": {
      "twoFactorEnabled": false,
      "sessionTimeout": 30,
      "autoLogout": false
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Update User Settings
**PUT** `/settings`

Update user settings. Only provided fields will be updated (deep merge).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notifications": {
    "email": {
      "weeklyDigest": false
    }
  },
  "display": {
    "theme": "dark",
    "itemsPerPage": 50
  },
  "privacy": {
    "profileVisibility": "community"
  }
}
```

**Valid Values:**
- `privacy.profileVisibility`: public, community, private
- `display.theme`: light, dark, system
- `display.itemsPerPage`: 10-100
- `account.sessionTimeout`: 5-1440 (minutes)

**Response (200):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": { ... }
}
```

---

### Reset Settings
**POST** `/settings/reset`

Reset all settings to default values.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Settings reset to default",
  "settings": { ... }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'contributor' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

The API implements rate limiting:
- **100 requests per 15 minutes** per IP address
- Applies to all `/api/*` endpoints

---

## User Roles

### Contributor (Default)
- Submit references
- Update/delete own pending submissions
- View public directory

### Verifier
- All contributor permissions
- Verify submissions for their country
- View pending submissions for their country

### Admin
- All verifier permissions
- Manage all users
- Award badges
- Update user roles
- Deactivate/activate users
- Delete any submission

---

## Gamification System

### Points System
- **Submit reference:** 10 points
- **Reference approved:** 25 points (additional)
- **Verify submission:** 5 points

### Badges
Admins can award custom badges to users for achievements.

---

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wikisource-ref
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

5. Start MongoDB:
```bash
mongod
```

6. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

---

## Testing the API

### Using cURL

**Register:**
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

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Create Submission:**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "url": "https://example.com/article",
    "title": "Test Article",
    "publisher": "Test Publisher",
    "country": "Ghana",
    "category": "secondary"
  }'
```

---

## Support

For issues or questions, please open an issue on the GitHub repository.
