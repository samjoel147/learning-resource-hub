# Backend API Documentation

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file with required environment variables
3. Start MongoDB
4. Run server: `npm start` or `npm run dev`

## Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- role (String: 'student', 'teacher', 'admin')

### Resource
- title (String, required)
- description (String, required)
- content (String, required)
- category (String: 'notes', 'tutorial', 'code-snippet', 'video', 'document', 'other')
- tags (Array of Strings)
- author (ObjectId, ref: User)
- ratings (Array of {user, rating})
- averageRating (Number)
- views (Number)
- fileUrl (String, optional)
- isPublic (Boolean)

### Comment
- content (String, required)
- author (ObjectId, ref: User)
- resource (ObjectId, ref: Resource)
- parentComment (ObjectId, ref: Comment, optional for replies)
- likes (Array of ObjectIds, ref: User)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

