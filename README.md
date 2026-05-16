CyberX – Developer Setup Guide

 Project Structure


CyberX/
├── frontend/          → User website (React + Vite) 
├── backend/           → User auth API (Node.js)
├── admin-frontend/    → Admin panel (React + Vite) 
├── admin-backend/     → Admin API (Node.js) 
└── bot-backend/       → AI Chatbot (Python Flask) 


---

Requirements

- Node.js v18+
- Python 3.10+
- PostgreSQL
- WSL (for PostgreSQL on Windows)

---

## 1. Database Setup

Start PostgreSQL in WSL:
sudo service postgresql start


Create the database:
sudo -u postgres psql
CREATE DATABASE cyberx;
\q

> Tables are created automatically when you start the backend servers.


## 2. Backend Setup
npm install


Create `.env` file inside `backend/` folder:
fill everything there

Start the backend:
node server.js


## 3. Frontend Setup
npm install


Create `.env` file inside `frontend/` folder:
fill the required details

Start the frontend:
npm run dev


## 4. Admin Backend Setup

npm install


Create `.env` file inside `admin-backend/` folder:
fill the requirements

Start the admin backend:
node server.js


> On first run, a default admin account is created automatically.
> Default credentials: admin@cyberx.com / admin123
> Change these immediately after first login (see below).


## 5. Admin Frontend Setup

npm install


Create `.env` file inside `admin-frontend/` folder:
fill the requirments

Start the admin frontend:
npm run dev


## 6. Bot Backend Setup


pip install -r requirements.txt


Create `.env` file inside `bot-backend/` folder:
fill the requirements

Get a free Gemini API key from: https://aistudio.google.com

Start the chatbot:
python app.py


## Running Everything Together

Open 5 terminals and run:

 Terminal 
 1.`sudo service postgresql start` (WSL) 
 2.`cd backend && node server.js` 
 3.`cd frontend && npm run dev`
 4.`cd admin-backend && node server.js` 
 5.`cd admin-frontend && npm run dev` 
 6.`cd bot-backend && python app.py` 


## Changing Super Admin Credentials

Passwords in the database are never stored as plain text. 
They are stored as a hash like this: $2b$10$QJ.LZnXbPrmG08/fQGw9Ee5HDr0WC5Z02nenJ4n3BOvV5HjU/x14e
So you can't just type a new password directly in the database.

**Step 1 — Generate hashed password (in terminal):**

  cd admin-backend
node -e "import('bcrypt').then(b => b.default.hash('yournewpassword', 10).then(h => console.log(h)))"
  **This converts your plain password → into a hash that the database understands**

**Step 2 — Update in database (in WSL):**
sudo -u postgres psql -d cyberx
```sql
UPDATE admins SET
  name     = 'Your Name',
  email    = 'your@email.com',
  password = 'paste_hashed_password_here'
WHERE id = 1;

**Step 3 — Verify:**
SELECT id, name, email FROM admins;
\q

**Step 4 — Restart admin backend:**
node server.js


