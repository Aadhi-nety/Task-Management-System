# Task Management System

## Overview
Full-stack task management system to create, assign, and track tasks. Designed for team collaboration with frontend in React and backend in Node.js. Docker is used for easy setup.

---

## Features
- Task creation & management  
- User authentication (login & registration)  
- Responsive UI (desktop & mobile)  
- Docker support  

---

## Technologies
- Frontend: React, TypeScript, CSS  
- Backend: Node.js, Express  
- Database: (Specify your DB)  
- Containerization: Docker, Docker Compose  

---

## Setup & Run

### Prerequisites
- Install [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/install/)  
- Node.js & npm (optional if running without Docker)  

### Clone Repository
```bash
git clone https://github.com/Aadhi-nety/Task-Management-System.git
cd Task-Management-System
````
### Using Docker
````bash
docker-compose up --build
````
### Local Development (Without Docker)
````bash
# Install dependencies
cd frontend
npm install
cd ../backend
npm install

# Run frontend
cd ../frontend
npm start

# Run backend
cd ../backend
npm run dev
````
### Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Git Push Commands (All-in-One Clean Repo)
- If you face issues with large files like node_modules, follow these all-in-one commands:
````bash
# Step 1: Remove existing Git history (PowerShell)
Remove-Item -Recurse -Force .git

# Step 2: Initialize new Git repo
git init
git branch -M main

# Step 3: Create .gitignore to exclude large folders/files
echo "node_modules/" > .gitignore
echo ".next/" >> .gitignore
echo "dist/" >> .gitignore
echo "build/" >> .gitignore
echo ".env" >> .gitignore

# Step 4: Add all files and commit
git add .
git commit -m "Initial clean commit"

# Step 5: Add remote repository (SSH)
git remote add origin git@github.com:Aadhi-nety/Task-Management-System.git

# Step 6: Push to GitHub (force push)
git push -u origin main --force
````
- ⚠️ Important: Do NOT commit node_modules or other large files. They are ignored via .gitignore.
### Project Structure
- frontend/ → React app
- backend/ → Node.js server
- Dockerfile → Backend container config
- docker-compose.yml → Multi-container setup
- package.json → Node.js dependencies & scripts
