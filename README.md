# School CMS Dashboard

A role-based content management system built using React, Vite, Tailwind CSS, and JSON Server.

The application allows Teachers to upload educational content and Principals to review, approve, or reject submissions. Approved content is displayed on a live rotating screen.

---

# Features

## Authentication

* Role-based login system
* Teacher and Principal access
* Protected routes
* Persistent login using localStorage

---

## Teacher Features

* Teacher Dashboard
* Upload educational content
* Image preview before upload
* Schedule content with start/end time
* Rotation duration support
* View uploaded content
* Pagination support
* Live screen access

---

## Principal Features

* Principal Dashboard
* View all uploaded content
* Approve content
* Reject content with reason
* Search and filter content
* Pagination support
* Status management

---

## Live Screen

* Displays only approved active content
* Auto-rotating slides
* Rotation duration support
* Full-screen display mode

---

# Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Tailwind CSS
* React Hook Form
* Axios
* React Hot Toast

## Backend

* JSON Server

---

# Project Structure

```bash
src/
│
├── components/
├── context/
├── pages/
│   ├── auth/
│   ├── teacher/
│   ├── principal/
│   └── public/
│
├── routes/
├── services/
└── App.jsx
```

---

# Demo Credentials

## Teacher Login

```bash
Email: teacher@test.com
Password: 123456
```

## Principal Login

```bash
Email: principal@test.com
Password: 123456
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Frontend

```bash
npm run dev
```

---

## 4. Start JSON Server

```bash
json-server --watch db.json --port 5000
```

---

# API Base URL

```bash
http://localhost:5000
```

---

# Deployment

## Frontend

Deployed on Vercel

## Backend

JSON Server deployed on Render

---

# Implemented Functionalities

* Authentication flow
* Role-based routing
* CRUD operations
* Content scheduling
* Content approval workflow
* Search & filters
* Pagination
* Toast notifications
* Responsive sidebar
* Protected routes
* Dynamic live content rotation


---


# Author

Developed as part of assignment/project submission using React and JSON Server.
