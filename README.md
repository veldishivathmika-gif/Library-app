# Book Library Management System (MERN)

A full-stack library app: React (Vite) frontend + Express/MongoDB (Mongoose) backend,
with signup/login, book CRUD, search, and Available/Issued status.

## Folder structure

```
library-app/
├── backend/      Express REST API
└── frontend/     React (Vite) UI
```

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or MongoDB Atlas) and a JWT_SECRET
npm run dev        # starts on http://localhost:5000
```

If you don't have MongoDB locally, create a free Atlas cluster at
https://www.mongodb.com/cloud/atlas, get its connection string, and paste it into MONGO_URI.

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL should point at the backend, e.g. http://localhost:5000/api
npm run dev        # starts on http://localhost:5173
```

Open http://localhost:5173, sign up, log in, and start adding books.

## 3. API reference

| Method | Route              | Auth? | Description                    |
|--------|--------------------|-------|---------------------------------|
| POST   | /api/auth/signup   | No    | Create account, returns JWT     |
| POST   | /api/auth/login    | No    | Log in, returns JWT             |
| GET    | /api/books?search=x| Yes   | List books, optional search     |
| GET    | /api/books/:id     | Yes   | Get one book                    |
| POST   | /api/books         | Yes   | Add a book                      |
| PUT    | /api/books/:id     | Yes   | Update a book (incl. status)    |
| DELETE | /api/books/:id     | Yes   | Delete a book                   |

Protected routes need a header: `Authorization: Bearer <token>`.

## 4. Deploy: Render (backend) + Netlify (frontend)

**Push to GitHub first** (`git init`, commit, push both folders as one repo).

### Backend on Render
1. New → Web Service → connect your repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Netlify URL,
   added after step below — you can update it later), `PORT` is set automatically by Render.
6. Deploy, then copy the resulting URL, e.g. `https://library-backend.onrender.com`.

### Frontend on Netlify
1. New site from Git → pick the repo.
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist` (or just `dist` if base directory is set)
5. Environment variable: `VITE_API_URL=https://library-backend.onrender.com/api`
6. Deploy, then copy the Netlify URL.

### Wire CORS
Go back to Render → your backend's environment variables → set
`CLIENT_ORIGIN=https://your-site.netlify.app` → redeploy the backend.

### Test the live app
Sign up → log in → add a book → search → edit → toggle status → delete.
