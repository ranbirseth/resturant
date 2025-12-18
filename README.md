
# Zink Zaika - Restaurant Web Application

Zink Zaika is a comprehensive full-stack MERN (MongoDB, Express, React, Node.js) restaurant management system. It features a customer-facing ordering application, an advanced admin dashboard with analytics, and a robust backend API with coupon management, feedback system, and real-time order tracking.

## Project Structure

The project consists of three main applications:

-   **Client**: Customer-facing frontend application built with React and Vite
-   **AdminDashboard**: Administrative dashboard for restaurant management with analytics
-   **Server**: Backend API built with Node.js and Express

## Features

### Frontend (Client)
-   **User Authentication**: Secure login system with JWT token management
-   **Home/Menu**: Browse restaurant menu with category filters (Veg/Non-Veg)
-   **Search Functionality**: Real-time search across menu items
-   **Food Details**: Detailed view of menu items with images and descriptions
-   **Order Customization**: Add customizations to orders (toppings, spice level, etc.)
-   **Cart Management**: Full cart functionality with quantity adjustments
-   **Coupon System**: Apply and validate discount coupons at checkout
-   **Order Type Selection**: Choose between Dine-in (with table number) or Takeaway
-   **Real-time Order Tracking**: Server-synced countdown timer with order status polling
-   **Customer Feedback**: Star rating system with tags and comments post-order
-   **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Dashboard
-   **Dashboard Overview**: Real-time statistics and KPIs
    -   Total revenue with trend indicators
    -   Total orders, pending orders, completed orders
    -   Growth metrics and performance indicators
-   **Advanced Analytics**: Interactive charts and visualizations (Recharts)
    -   Revenue & orders trend (area charts)
    -   Peak order times analysis (bar charts)
    -   Top selling items (pie charts)
    -   Revenue breakdown by category
    -   Customer retention metrics
    -   Average order value tracking
-   **Menu Management**: Complete CRUD operations for food items
    -   Add/Edit/Delete menu items
    -   Upload product images
    -   Toggle item availability
    -   Category and pricing management
    -   Veg/Non-Veg classification
-   **Order Management**: Comprehensive order tracking and management
    -   View all orders with filtering
    -   Update order status (Pending → Preparing → Ready → Completed)
    -   View order details including customizations
    -   Table number tracking for dine-in orders
    -   Order timeline and history
-   **Coupon Management**: Create and manage discount coupons
    -   Percentage or flat discount types
    -   Minimum order amount requirements
    -   Active/Inactive status toggle
-   **User Management**: View and manage customer accounts
-   **Categories Management**: Organize menu items by categories
-   **Settings**: Configure restaurant settings and preferences
-   **Responsive UI**: Modern, glassmorphic design with smooth animations

### Backend (Server)
-   **RESTful API**: Comprehensive API for all operations
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JWT-based user authentication (`/api/auth`)
-   **Menu Items API**: Full CRUD operations for menu items (`/api/items`)
-   **Order Management API**: Order placement, tracking, and status updates (`/api/orders`)
-   **Coupon System API**: Coupon validation and management (`/api/coupons`)
-   **Feedback System API**: Customer feedback collection (`/api/feedback`)
-   **Enhanced Order Model**:
    -   Coupon support (code, discount amount, gross total)
    -   Table number for dine-in orders
    -   Item customizations array
    -   Feedback status tracking
    -   Configurable countdown timer

## Dependencies & Installation Commands

### Client Dependencies (Frontend)
Navigate to the `client` directory before running these commands.

-   **React & React DOM**: Core React libraries
    ```bash
    npm install react react-dom
    ```
-   **React Router DOM**: Client-side routing
    ```bash
    npm install react-router-dom
    ```
-   **Axios**: HTTP client for API requests
    ```bash
    npm install axios
    ```
-   **Lucide React**: Modern icon library
    ```bash
    npm install lucide-react
    ```
-   **Tailwind CSS**: Utility-first CSS framework (Development Dependency)
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    ```
-   **Vite**: Fast build tool and dev server (Development Dependency)
    ```bash
    npm install -D vite
    ```

### Admin Dashboard Dependencies
Navigate to the `AdminDashboard` directory before running these commands.

-   **React & React DOM**: Core React libraries
    ```bash
    npm install react react-dom
    ```
-   **React Router DOM**: Routing for admin pages
    ```bash
    npm install react-router-dom
    ```
-   **Axios**: HTTP client for API communication
    ```bash
    npm install axios
    ```
-   **Recharts**: Data visualization and charting library
    ```bash
    npm install recharts
    ```
-   **Framer Motion**: Animation library for smooth transitions
    ```bash
    npm install framer-motion
    ```
-   **Lucide React**: Icon library
    ```bash
    npm install lucide-react
    ```
-   **Tailwind CSS**: Styling framework
    ```bash
    npm install tailwindcss postcss autoprefixer
    ```
-   **Vite**: Build tool (Development Dependency)
    ```bash
    npm install -D vite
    ```

### Server Dependencies (Backend)
Navigate to the `server` directory before running these commands.

-   **Express**: Web framework for Node.js
    ```bash
    npm install express
    ```
-   **Mongoose**: MongoDB object modeling
    ```bash
    npm install mongoose
    ```
-   **Cors**: Cross-Origin Resource Sharing middleware
    ```bash
    npm install cors
    ```
-   **Dotenv**: Environment variable management
    ```bash
    npm install dotenv
    ```
-   **Nodemon**: Auto-restart development server (Development Dependency)
    ```bash
    npm install -D nodemon
    ```

## Quick Start (Install All)

To install all dependencies for the entire project:

1.  **Server Setup**:
    ```bash
    cd server
    npm install
    ```
    *Create a `.env` file in `server` with `MONGO_URI` and `PORT`.*

2.  **Client Setup**:
    ```bash
    cd ../client
    npm install
    ```

3.  **Admin Dashboard Setup**:
    ```bash
    cd ../AdminDashboard
    npm install
    ```

## Running the Project

### Start the Backend Server
```bash
cd server
npm start
# OR for development (with auto-reload)
npm run dev
```
The server runs on `http://localhost:5000` by default.

### Start the Client Application
```bash
cd client
npm run dev
```
Accessible at `http://localhost:5173`.

### Start the Admin Dashboard
```bash
cd AdminDashboard
npm run dev
```
Accessible at `http://localhost:5174` (or next available port).

## Working Flow

### Customer Journey

1.  **Authentication**:
    *   Users login at `/login` page
    *   Credentials sent to `POST /api/auth/login`
    *   JWT token stored in localStorage for session management

2.  **Menu Browsing**:
    *   Browse menu at `/home` with category filters (Veg/Non-Veg)
    *   Search functionality for quick item discovery
    *   Menu items fetched via `GET /api/items`

3.  **Order Customization**:
    *   View item details at `/food/:id`
    *   Add customizations at `/customize/:id`
    *   Select quantity and add to cart

4.  **Cart & Coupon**:
    *   Review cart at `/cart`
    *   Apply coupon codes for discounts
    *   Coupon validation via `POST /api/coupons/validate`
    *   View gross total, discount, and final amount

5.  **Checkout Process**:
    *   Select order type at `/order-type` (Dine-in or Takeaway)
    *   Enter table number for dine-in orders
    *   Submit order via `POST /api/orders`

6.  **Order Tracking**:
    *   Real-time countdown at `/countdown`
    *   Server-synced timer based on order creation time
    *   Status polling every 5 seconds for updates
    *   Visual progress bar showing preparation progress

7.  **Feedback Collection**:
    *   Feedback modal appears when order is completed
    *   5-star rating system with optional tags
    *   Submit feedback via `POST /api/feedback`
    *   Feedback status updated in order record

### Admin Workflow

1.  **Dashboard Monitoring**:
    *   View real-time statistics and KPIs
    *   Analyze trends with interactive charts
    *   Monitor peak order times and popular items

2.  **Menu Management**:
    *   Add new menu items with images and details
    *   Edit existing items (price, description, availability)
    *   Toggle item availability without deletion
    *   Organize items by categories

3.  **Order Processing**:
    *   View incoming orders in real-time
    *   Update order status through workflow
    *   View order details including customizations and table numbers
    *   Track order completion times

4.  **Coupon Management**:
    *   Create discount coupons (percentage or flat)
    *   Set minimum order requirements
    *   Activate/deactivate coupons as needed

## API Reference

### Authentication

#### Login User
```http
POST /api/auth/login
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | **Required**. User's email address |
| `password` | `string` | **Required**. User's password |

**Response**: JWT token and user data

---

### Menu Items

#### Get All Items
```http
GET /api/items
```
Returns array of all menu items with details.

#### Get Item by ID
```http
GET /api/items/:id
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. Item ID |

#### Create Item (Admin)
```http
POST /api/items
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | **Required**. Item name |
| `category` | `string` | **Required**. Category name |
| `price` | `number` | **Required**. Item price |
| `description` | `string` | Item description |
| `isVeg` | `boolean` | Vegetarian flag |
| `available` | `boolean` | Availability status |
| `image` | `string` | Image URL |

#### Update Item (Admin)
```http
PUT /api/items/:id
```
Same parameters as Create Item.

#### Delete Item (Admin)
```http
DELETE /api/items/:id
```

#### Seed Items
```http
POST /api/items/seed
```
Populates database with sample menu items.

---

### Orders

#### Create Order
```http
POST /api/orders
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | **Required**. User ID |
| `items` | `array` | **Required**. Array of order items with customizations |
| `totalAmount` | `number` | **Required**. Final payable amount |
| `grossTotal` | `number` | Subtotal before discount |
| `couponCode` | `string` | Applied coupon code |
| `discountAmount` | `number` | Discount amount |
| `orderType` | `string` | **Required**. "Dine-in" or "Takeaway" |
| `tableNumber` | `string` | Required if Dine-in |

**Items Array Structure**:
```json
{
  "itemId": "string",
  "name": "string",
  "quantity": "number",
  "price": "number",
  "customizations": ["string"]
}
```

#### Get All Orders
```http
GET /api/orders
```
Returns all orders (Admin).

#### Get Order by ID
```http
GET /api/orders/:id
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. Order ID |

#### Update Order Status
```http
PUT /api/orders/:id/status
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | `string` | Order status: "Pending", "Preparing", "Ready", "Completed" |
| `feedbackStatus` | `string` | Feedback status: "Pending", "Requested", "Submitted", "Skipped" |

---

### Coupons

#### Validate Coupon
```http
POST /api/coupons/validate
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `code` | `string` | **Required**. Coupon code |
| `cartTotal` | `number` | **Required**. Cart total amount |

**Response**:
```json
{
  "success": true,
  "code": "WELCOME10",
  "discountType": "PERCENT",
  "value": 10,
  "discountAmount": 50,
  "message": "Coupon applied successfully!"
}
```

#### Get All Active Coupons
```http
GET /api/coupons
```
Returns all active coupons.

#### Create Coupon (Admin)
```http
POST /api/coupons
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `code` | `string` | **Required**. Unique coupon code |
| `discountType` | `string` | **Required**. "PERCENT" or "FLAT" |
| `value` | `number` | **Required**. Discount value |
| `minOrderAmount` | `number` | **Required**. Minimum order amount |
| `isActive` | `boolean` | Active status |

#### Seed Coupons
```http
POST /api/coupons/seed
```
Populates database with sample coupons.

---

### Feedback

#### Submit Feedback
```http
POST /api/feedback
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `orderId` | `string` | **Required**. Order ID |
| `userId` | `string` | **Required**. User ID |
| `rating` | `number` | **Required**. Rating (1-5) |
| `message` | `string` | Feedback message |
| `tags` | `array` | Feedback tags (e.g., ["Great Food", "Fast Service"]) |

**Response**: Created feedback object and updates order feedbackStatus to "Submitted".

---

## Database Models

### User Model
- `email`, `password`, `name`
- Timestamps (createdAt, updatedAt)

### Item Model
- `name`, `category`, `price`, `description`
- `isVeg` (boolean), `available` (boolean)
- `image` (URL)
- Timestamps

### Order Model
- `userId` (ref: User)
- `items` (array with itemId, name, quantity, price, customizations)
- `totalAmount`, `grossTotal`, `discountAmount`
- `couponCode`, `orderType`, `tableNumber`
- `status` (Pending/Preparing/Ready/Completed)
- `feedbackStatus` (Pending/Requested/Submitted/Skipped)
- `completionConfig.countDownSeconds` (default: 900)
- Timestamps

### Coupon Model
- `code`, `discountType`, `value`
- `minOrderAmount`, `isActive`
- Timestamps

### Feedback Model
- `orderId` (ref: Order), `userId` (ref: User)
- `rating`, `message`, `tags`
- Timestamps

---

## Technologies Used

### Frontend
- React 18/19
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (Icons)
- Vite

### Admin Dashboard
- React 19
- Recharts (Data Visualization)
- Framer Motion (Animations)
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

---

## License

This project is for educational and demonstration purposes.

