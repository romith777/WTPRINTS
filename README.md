# WTPRINTS 🛒

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

WTPRINTS is a high-performance, modern e-commerce platform engineered for speed, scalability, and seamless user experience. Built on a modern React (Vite) frontend, the platform leverages **Vercel Serverless Functions** and **MongoDB** to handle real-time product data without the overhead of a dedicated daemon server.

## ✨ Key Features

* **Serverless Backend Architecture:** Utilizes Vercel API routes (/api/products) coupled with the native MongoDB driver for secure, on-demand database querying, eliminating local server dependencies in production.
* **Algorithmic State Filtering:** Engineered a highly dynamic, multi-parameter filtering system allowing users to instantly sort and query products by Price Range, Brand, Size, and Category.
* **Smart Fallback Recommendations:** Implemented a cross-category suggestion engine that automatically surfaces relevant products when a user's strict filter criteria yield zero results.
* **Responsive Mobile-First UI:** Custom-built, CSS-driven responsive layouts including interactive Hamburger menus, collapsing sidebars, and fluid product grids optimized for all device viewports.
* **Global Context Management:** Utilizes React's useContext API to securely and efficiently manage global application states for the Shopping Cart, User Favorites, and Live Search Queries across the platform.

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, React Router DOM, Custom CSS3
* **Backend:** Node.js, Vercel Serverless Functions
* **Database:** MongoDB Atlas
* **Deployment & CI/CD:** Vercel, GitHub

## 🚀 Local Development Setup

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
\\\ash
git clone https://github.com/romith777/WTPRINTS.git
cd WTPRINTS
\\\

### 2. Install dependencies
\\\ash
npm install
\\\

### 3. Configure Environment Variables
Create a \.env.local\ file in the root of the project and add your MongoDB connection string.
\\\env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
\\\
*(Note: If no URI is provided, the serverless function will automatically return a mock fallback product to prevent application crashes).*

### 4. Start the development server
\\\ash
npm run dev
\\\
The application will launch locally at \http://localhost:5173\.

---
*Engineered by Pagadala Romith Chenna Kesav*
