<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=My%20Portfolio&fontSize=50&animation=fadeIn&fontAlignY=38&desc=Full-Stack%20Developer%20Portfolio&descAlignY=51&descAlign=62" />

  <p align="center">
    A stunning, full-stack personal portfolio built to showcase my skills, projects, and experiences.
    <br />
    <a href="#features"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Pubudugunawardhana/my_portfolio">View Demo</a>
    ·
    <a href="https://github.com/Pubudugunawardhana/my_portfolio/issues">Report Bug</a>
    ·
    <a href="https://github.com/Pubudugunawardhana/my_portfolio/issues">Request Feature</a>
  </p>
  
  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </div>
</div>

---

## 🌟 About The Project

This is a modern, responsive, and highly interactive full-stack portfolio website. It features a beautifully designed frontend built with **React** and **Tailwind CSS**, enhanced with smooth animations via **Framer Motion**. 

The portfolio isn't just static—it includes a robust **Node.js/Express** backend and an integrated **Admin Dashboard** allowing for real-time updates to projects, skills, certifications, and more without touching the code!

### ✨ Key Features

**🚀 Frontend Experience**
- **Dynamic UI/UX:** Smooth scrolling, dark/light mode toggle, and highly responsive design.
- **Framer Motion Animations:** Eye-catching entrance and scroll animations.
- **Interactive Sections:** Hero, About, Skills, Projects, Certifications, Blogs, and a "Fun Zone" featuring a Memory Game.
- **Real-time Analytics:** Built-in page view tracking.

**🔒 Admin Dashboard**
- **Secure Authentication:** JWT-based protected routes for admin access.
- **Content Management System (CMS):** Add, edit, or delete projects, skills, and certifications on the fly.
- **Messages Management:** View and manage contact form submissions directly from the dashboard.
- **Analytics Overview:** Monitor portfolio traffic and visitor engagement.

---

## 🛠️ Tech Stack

### Frontend
* **React 19** - UI Library
* **Vite** - Build Tool
* **Tailwind CSS** - Styling
* **Framer Motion** - Animations
* **Lucide React & React Icons** - Iconography
* **Recharts** - Data Visualization
* **Firebase** - Backend as a Service integrations

### Backend
* **Node.js & Express.js** - Server & API Framework
* **MongoDB & Mongoose** - Database & ODM
* **JSON Web Tokens (JWT)** - Authentication
* **Bcrypt.js** - Password Hashing

---

## 📂 Project Structure

```bash
my_portfolio/
├── frontend/             # React/Vite Frontend
│   ├── src/
│   │   ├── components/   # UI Components & Admin Dashboard
│   │   ├── services/     # API and Firebase services
│   │   ├── hooks/        # Custom React Hooks
│   │   └── App.jsx       # Main App Routing
│   └── package.json
└── backend/              # Node/Express API
    ├── models/           # Mongoose Database Models
    ├── routes/           # Express API Routes (Auth, Projects, Skills, etc.)
    ├── middleware/       # JWT Auth Middleware
    └── server.js         # Entry Point
```

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB (Local instance or MongoDB Atlas URI)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Pubudugunawardhana/my_portfolio.git
   cd my_portfolio
   ```

2. **Setup the Backend**
   ```sh
   cd backend
   npm install
   ```
   * Create a `.env` file in the `backend` directory and add your environment variables:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_key
     ```
   * Start the backend server:
     ```sh
     npm run dev # or node server.js
     ```

3. **Setup the Frontend**
   ```sh
   cd ../frontend
   npm install
   ```
   * Create a `.env` file in the `frontend` directory if required for API URLs or Firebase config.
   * Start the frontend development server:
     ```sh
     npm run dev
     ```

4. **Access the Application**
   * Frontend: `http://localhost:5173`
   * Backend API: `http://localhost:5000`
   * Admin Login: `http://localhost:5173/login`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Pubudugunawardhana/my_portfolio/issues).

---

## 📬 Contact

**Pubudu Gunawardhana**
- GitHub: [@Pubudugunawardhana](https://github.com/Pubudugunawardhana)

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" />
</p>
