# ArtCommission API Documentation

Base URL: `http://localhost:8000`

## Authentication Endpoints

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user (artist or client)
- **Request Body**:
```json
{
    "email": "string",
    "password": "string",
    "role": "string (artist/client)",
    "fullName": "string"
}
```
- **Success Response (201)**:
```json
{
    "message": "Registration successful",
    "token": "string",
    "user": {
        "userId": "string",
        "email": "string",
        "role": "string",
        "fullName": "string",
        "createdAt": "timestamp"
    }
}
```
- **Error Response (400)**:
```json
{
    "error": "Email already registered"
}
```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Login existing user
- **Request Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
- **Success Response (200)**:
```json
{
    "message": "Login successful",
    "token": "string",
    "user": {
        "userId": "string",
        "email": "string",
        "role": "string",
        "fullName": "string"
    }
}
```
- **Error Response (401)**:
```json
{
    "error": "Invalid credentials"
}
```

### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Description**: Get current user information
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Success Response (200)**:
```json
{
    "user": {
        "userId": "string",
        "email": "string",
        "role": "string",
        "fullName": "string"
    }
}
```
- **Error Response (401)**:
```json
{
    "error": "Invalid authentication credentials"
}
```

## Portfolio Endpoints

### Get All Artists
- **URL**: `/portfolio/artists`
- **Method**: `GET`
- **Description**: Get list of all artists with their portfolios
- **Success Response (200)**:
```json
{
    "artists": [
        {
            "id": "string",
            "fullName": "string",
            "email": "string",
            "role": "artist",
            "portfolios": [
                {
                    "id": "string",
                    "title": "string",
                    "description": "string",
                    "category": "string",
                    "price": "number",
                    "imageUrl": "string"
                }
            ]
        }
    ]
}
```

### Get Artist Portfolio
- **URL**: `/portfolio/:artistId`
- **Method**: `GET`
- **Description**: Get specific artist's portfolio
- **URL Parameters**: `artistId=[string]`
- **Success Response (200)**:
```json
{
    "portfolios": [
        {
            "id": "string",
            "title": "string",
            "description": "string",
            "category": "string",
            "price": "number",
            "imageUrl": "string",
            "createdAt": "timestamp"
        }
    ]
}
```

### Add Portfolio Item
- **URL**: `/portfolio`
- **Method**: `POST`
- **Description**: Add new portfolio item (Artist only)
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Request Body**:
```json
{
    "title": "string",
    "description": "string",
    "category": "string",
    "price": "number",
    "imageUrl": "string (optional)"
}
```
- **Success Response (201)**:
```json
{
    "portfolio": {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "price": "number",
        "imageUrl": "string",
        "createdAt": "timestamp"
    }
}
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Error Responses
Common error responses include:
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

## Rate Limiting
- Maximum 100 requests per minute per IP address
- Rate limit headers are included in responses

## Data Types
- **timestamp**: ISO 8601 format (e.g., "2024-03-21T15:30:00Z")
- **category**: One of: ["digital-art", "illustration", "character-design", "concept-art"]

## Testing the API
You can test the API using:
1. Postman
2. cURL commands
3. Frontend application

Example cURL command for login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```