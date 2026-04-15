# 🍔 SwiftEats — Food Delivery Web App

SwiftEats is a full-stack food delivery web application inspired by platforms like Swiggy and Zomato. It allows users to explore restaurants, browse food items, and manage orders with a role-based system (User, Owner, Admin).

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login (JWT-based)
* Secure protected routes
* Token-based auto-login

### 👤 Role-Based Access

* **User** → Browse food & restaurants
* **Owner** → Add restaurants & food items
* **Admin** → Manage users (assign roles)

### 🍽️ Food & Restaurants

* View restaurants and menus
* Categorized food display
* Dynamic food listing from backend

### 🛒 Cart System

* Add/remove items
* Quantity management
* Total price calculation
* Simulated checkout

### 🔍 Search

* Search foods & restaurants
* Real-time results

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication

---

## 📁 Project Structure

```
QuickBite/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/quickbite.git
cd quickbite
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=8000
JWT_SECRET=your_secret_key
```

Run server:

```
node server.js
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔑 API Endpoints

### Auth

* `POST /api/v1/signup`
* `POST /api/v1/signin`
* `GET /api/v1/user`

### Foods

* `GET /api/v1/foods/home`
* `GET /api/v1/foods/home/categories`

### Restaurants

* `GET /api/v1/restaurants`
* `GET /api/v1/restaurants/:id/menu`

### Admin

* `PUT /api/v1/users/make-admin/:id`
* `PUT /api/v1/users/make-owner/:id`

---

## 🧠 Key Concepts Implemented

* JWT Authentication
* Role-based Authorization
* REST API design
* MySQL relationships (Foreign Keys)
* Global state management (Context API)
* Protected routes in React

---

## 📸 Future Improvements

* Payment integration (Razorpay/Stripe)
* Order tracking system
* Reviews & ratings
* Real-time notifications
* Deployment (Vercel + Render)

---

## 👨‍💻 Author

**Vaibhav Malkoti**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share feedback!
