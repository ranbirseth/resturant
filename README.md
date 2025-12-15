
# Zink Zaika - Restaurant Web Application

Zink Zaika is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for restaurants. It provides a seamless digital ordering experience for customers, featuring a modern UI, real-time order tracking (countdown), and comprehensive menu management.

## Project Structure

The project is divided into two main parts:

-   **Client**: The frontend application built with React and Vite.
-   **Server**: The backend API built with Node.js and Express.

## Features

### Frontend (Client)
-   **User Authentication**: Secure login page for users.
-   **Home/Menu**: Browse the restaurant menu with categories.
-   **Food Details**: View detailed information about specific food items.
-   **Customization**: Customize orders (e.g., toppings, variations).
-   **Cart Management**: Add items to cart and review orders.
-   **Order Type Selection**: Choose between Dine-in or Takeaway.
-   **Order Confirmation**: Visual countdown timer for order preparation.
-   **Responsive Design**: Built with Tailwind CSS for a mobile-first experience.

### Backend (Server)
-   **RESTful API**: Serves data for authentication, menu items, and orders.
-   **Database**: Uses Mongoose for object modeling with MongoDB.
-   **Authentication Routes**: Handle user login and registration (`/api/auth`).
-   **Item Routes**: Manage menu items (`/api/items`).
-   **Order Routes**: Handle order placement and status (`/api/orders`).

## Dependencies & Installation Commands

### Client Dependencies (Frontend)
Navigate to the `client` directory before running these commands.

-   **React & React DOM**: Core React libraries.
    ```bash
    npm install react react-dom
    ```
-   **React Router DOM**: For handling routing in the application.
    ```bash
    npm install react-router-dom
    ```
-   **Axios**: For making HTTP requests to the backend API.
    ```bash
    npm install axios
    ```
-   **Lucide React**: For icons used throughout the UI.
    ```bash
    npm install lucide-react
    ```
-   **Tailwind CSS**: Utility-first CSS framework (Development Dependency).
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    ```
-   **Vite**: Frontend build tool and development server (Development Dependency).
    ```bash
    npm install -D vite
    ```

### Server Dependencies (Backend)
Navigate to the `server` directory before running these commands.

-   **Express**: Fast, unopinionated web framework for Node.js.
    ```bash
    npm install express
    ```
-   **Mongoose**: MongoDB object modeling (ODM) tool.
    ```bash
    npm install mongoose
    ```
-   **Cors**: Middleware to enable Cross-Origin Resource Sharing.
    ```bash
    npm install cors
    ```
-   **Dotenv**: Module to load environment variables from a `.env` file.
    ```bash
    npm install dotenv
    ```
-   **Nodemon**: Utility that monitors for changes and restarts the server (Development Dependency).
    ```bash
    npm install -D nodemon
    ```

## Quick Start (Install All)

To install all dependencies at once for the entire project:

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

## Running the Project

### Start the Backend Server
```bash
cd server
npm start
# OR for development (with auto-reload)
npm run dev
```
The server usually runs on `http://localhost:5000`.

### Start the Frontend Application
```bash
cd client
npm run dev
```
The application will typically be accessible at `http://localhost:5173`.

## Working Flow

1.  **Authentication**:
    *   **Login**: Users start at the `/login` page. They enter credentials which are sent to `POST /api/auth/login`.
    *   **Token**: On success, a JWT token is received and stored (e.g., in localStorage) for subsequent potential private route access.

2.  **Menu Browsing**:
    *   **Home**: Authenticated users are redirected to `/home`.
    *   **Fetching**: The frontend fetches menu items via `GET /api/items`.
    *   **Display**: Items are displayed in a responsive grid/list with images, names, and prices.

3.  **Order Customization**:
    *   **Details**: Clicking an item navigates to `/food/:id`.
    *   **Customize**: Users can select options (size, toppings) at `/customize/:id` (if applicable) or directly add to cart.

4.  **Cart Management**:
    *   **Review**: The Cart page (`/cart`) displays selected items, quantities, and total price.
    *   **Update**: Users can increase/decrease quantities or remove items.

5.  **Checkout Process**:
    *   **Order Type**: Users proceed to `/order-type` to select "Dine-in" or "Takeaway".
    *   **Submission**: The final order object is constructed and sent to `POST /api/orders`.

6.  **Post-Order Tracking**:
    *   **Confirmation**: Upon successful submission, the user is routed to `/countdown`.
    *   **Status**: This page shows a confirmation message and a countdown timer indicating when the food will be ready.

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

### Menu Items

#### Get All Items
```http
GET /api/items
```
Returns a list of all available menu items.

#### Seed Items
```http
POST /api/items/seed
```
Populates the database with initial sample data.

### Orders

#### Create Order
```http
POST /api/orders
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `items` | `array` | **Required**. Array of cart items |
| `totalAmount` | `number` | **Required**. Total cost of the order |
| `orderType` | `string` | **Required**. "dine-in" or "takeaway" |

#### Get Order by ID
```http
GET /api/orders/:id
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. The ID of the order to fetch |

