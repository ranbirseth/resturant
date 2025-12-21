# Zink Zaika - Restaurant Management System

**Zink Zaika** is a comprehensive, full-stack web application designed to streamline restaurant operations. It features a modern, responsive customer-facing ordering platform and a powerful admin dashboard for real-time management of orders, menus, and users.

---

## 🚀 Live Demo & Repository

- **GitHub Repository**: [https://github.com/ranbirseth/resturant.git](https://github.com/yourusername/zink-zaika)
- **Live Demo**: [Link to Live Demo] *(Add link here)*

---

## 🛠️ Tech Stack

### Frontend (Client & Admin)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Hooks (Context API)
- **Routing**: React Router DOM
- **Real-time Communication**: Socket.IO Client
- **Charts**: Recharts (Admin Dashboard)
- **Animations**: Framer Motion

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time Communication**: Socket.IO
- **Environment Management**: Dotenv
- **CORS**: Cross-Origin Resource Sharing

---

## ✨ Features

### 🍽️ Customer Application (Client)
- **Interactive Menu**: Browse food items by category with search functionality.
- **Cart Management**: Add/remove items, customize quantity, and view total cost.
- **Order Placement**: Simple checkout process with dine-in or takeaway options.
- **Real-time Order Status**: Track order progress (Pending -> Preparing -> Ready).
- **Coupons**: Apply discount codes during checkout.

### ⚡ Admin Dashboard
- **Real-time Notifications**: Instant alerts for new orders via Socket.IO.
- **Order Management**: View, update status, and manage incoming orders.
- **Menu Management**: Add, edit, or delete food items and categories.
- **User Management**: View registered users and order history.
- **Coupon System**: Create and manage discount codes.
- **Analytics**: Visual insights into sales and order trends.

---

## 📂 Folder Structure

```
Zink_zaika/
├── client/                 # Customer-facing React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── AdminDashbord/          # Admin Control Panel React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js Express Backend
│   ├── config/             # Database connection
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/zink-zaika.git
cd Zink_zaika
```

### 2. Backend Setup (Server)
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zink_zaika
ADMIN_SECRET_CODE=ADMIN2024
```

Start the server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Admin Dashboard Setup
Open a new terminal, navigate to the admin directory, and install dependencies:
```bash
cd AdminDashbord
npm install
```

Start the Admin Dashboard:
```bash
npm run dev
# Dashboard will run on http://localhost:5174 (default Vite port)
```

### 4. Client Application Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the Client App:
```bash
npm run dev
# Client will run on http://localhost:5173 (default Vite port)
```

---

### 5. Dependency Installation Commands

#### 🔧 Backend (Server)
Navigate to the server directory:
```bash
cd server
```

Install production dependencies:
```bash
npm install express mongoose dotenv cors socket.io
```

Install development dependencies:
```bash
npm install --save-dev nodemon
```

**Or simply (recommended):**
```bash
npm install
```

---

#### 🖥️ Client Application (User Side)
Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install react react-dom react-router-dom axios lucide-react
```

Install development dependencies:
```bash
npm install --save-dev vite @vitejs/plugin-react tailwindcss postcss autoprefixer eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh @types/react @types/react-dom
```

**Or simply:**
```bash
npm install
```

---

#### 🧑‍💼 Admin Dashboard
Navigate to the admin directory:
```bash
cd AdminDashbord
```

Install dependencies:
```bash
npm install react react-dom react-router-dom axios lucide-react recharts framer-motion socket.io-client tailwindcss
```

Install development dependencies:
```bash
npm install --save-dev vite @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh @types/react @types/react-dom @eslint/js globals autoprefixer postcss
```

**Or simply:**
```bash
npm install
```

---

## 📜 Available Scripts

### Server
- `npm start`: Runs the server using Node.
- `npm run dev`: Runs the server using Nodemon (auto-restart).

### Client & Admin
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.

---

## 🔌 API Overview

The backend provides a RESTful API with the following main endpoints:

- **Auth**: `/api/auth` (User login/registration)
- **Admin**: `/api/admin` (Admin verification)
- **Items**: `/api/items` (CRUD for menu items)
- **Orders**: `/api/orders` (Place and manage orders)
- **Coupons**: `/api/coupons` (Validate and manage coupons)

---

## 🔐 Authentication Flow

- **Users**: Phone number based login. Creates a user record if one doesn't exist.
- **Admin**: Secured via a Secret Access Code (`ADMIN_SECRET_CODE`) defined in environment variables.

---

## ✅ Best Practices & Performance

- **Component-Based Architecture**: Reusable UI components.
- **Optimized Assets**: Using Vite for fast bundling and HMR.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Clean Code**: MVC pattern in backend and Context/Hooks pattern in frontend.
- **Error Handling**: Centralized error management in API.

---

## 🔮 Future Improvements

- [ ] Implement robust JWT authentication for Admins.
- [ ] Add payment gateway integration (Stripe/Razorpay).
- [ ] Enhance analytics with exportable reports.
- [ ] Add dark mode support for Client App.

---

## 🤝 Contribution

Contributions are welcome! Please fork the repository and create a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
