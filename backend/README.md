# Employee Task Manager Backend

Standalone Node.js, Express, MongoDB, and JWT API for Employee Task Manager.

## Setup

```bash
npm install
npm run dev
```

The API runs on `http://localhost:3000` by default.

## Environment

Copy `.env` values into environment-specific configuration before deployment. Never hardcode MongoDB, JWT, or SMTP credentials.

## Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Upload Routes

- `POST /api/uploads/image` with multipart field `image` and a valid JWT
- `DELETE /api/uploads/image` with `{ "publicId": "..." }` and a valid JWT
