# WTPRINTS: Full-Stack E-Commerce Website  
**Live Demo:** https://wtf-murex-pi.vercel.app/  

**WTPRINTS** is a full-stack e-commerce platform built using **HTML, CSS, JavaScript (Frontend)** and **Node.js with Express & MongoDB (Backend)**.  
It enables users to browse products, manage their cart, authenticate securely, and complete purchases using **Razorpay Payment Gateway** — forming a scalable foundation for a branded clothing store.

---

## Features  

- **Product Catalog** – Browse branded clothing with descriptions and pricing  
- **Cart System** – Add, remove, and update items with persistent storage  
- **User Authentication** – Secure signup and login with encrypted passwords  
- **Razorpay Payment Integration** – Secure checkout with server-side order creation and payment verification  
- **Order Management** – Orders stored in MongoDB after successful payment verification  
- **Database Integration** – MongoDB stores users, products, carts, and orders  
- **RESTful API Architecture** – Clean separation between frontend and backend  
- **Responsive Design** – Works seamlessly on desktop and mobile  
- **CORS Enabled** – Secure frontend-backend communication  

---

## How It Works  

### Frontend  
Built with **HTML, CSS, and JavaScript**, it provides a dynamic and responsive shopping interface.  
Users can browse products, manage their cart, and initiate checkout.

### Backend  
Powered by **Node.js** and **Express**, the backend:  

- Authenticates users  
- Validates cart items and calculates total amount  
- Creates Razorpay orders securely on the server  
- Verifies payment signature after successful transaction  
- Stores confirmed orders in MongoDB  

### Database  
Uses **MongoDB** with **Mongoose** for storing:  

- Users  
- Products  
- Cart data  
- Orders (with payment status)  

---

## Razorpay Payment Flow  

1. User clicks **Checkout** from the cart page.  
2. Frontend sends cart details to backend.  
3. Backend validates products and creates a **Razorpay Order** using secret keys.  
4. Frontend opens Razorpay Checkout with the generated order ID.  
5. After payment, Razorpay returns:  
   - `razorpay_order_id`  
   - `razorpay_payment_id`  
   - `razorpay_signature`  
6. Backend verifies the signature using `crypto` to ensure payment authenticity.  
7. If verification succeeds:  
   - Order is saved in MongoDB  
   - Payment status marked as **Paid**  

---

## Tech Stack  

**Frontend:** HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Payments:** Razorpay  
**Security:** bcrypt, dotenv, CORS, crypto  

---

## Environment Variables  

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLIENT_URL=http://localhost:3000
```

**Important:**  
- Never expose `RAZORPAY_KEY_SECRET` to the frontend.  
- Only `RAZORPAY_KEY_ID` is used on the client side.  

---

## Installation & Setup  

1. Clone the repository  

```bash
git clone https://github.com/your-username/WTF.git
cd WTF
```

2. Install backend dependencies  

```bash
cd server
npm install
```

3. Add environment variables  

4. Start the backend server  

```bash
npm run dev
```

5. Run frontend using live server or deploy static files  

---

## API Endpoints (Example Structure)  

- `POST /api/auth/register` – Register new user  
- `POST /api/auth/login` – Login user  
- `GET /api/products` – Fetch all products  
- `POST /api/cart` – Add item to cart  
- `POST /api/payment/create-order` – Create Razorpay order  
- `POST /api/payment/verify` – Verify Razorpay payment signature  
- `GET /api/orders` – Get user orders  

---

## Data Models Overview  

### User  
- name  
- email  
- password (hashed)  
- createdAt  

### Product  
- name  
- description  
- price  
- image  
- stock  

### Order  
- userId  
- items  
- totalAmount  
- paymentId  
- orderId  
- paymentStatus  
- createdAt  

---

## Security Note  

- Passwords are hashed using **bcrypt**  
- Razorpay signature verification ensures secure payments  
- Environment variables protect sensitive credentials  
- Backend validates cart pricing before creating payment orders  

This project is a prototype and suitable for demonstration purposes. Additional production-grade security (rate limiting, HTTPS enforcement, logging, monitoring, etc.) can be implemented for deployment at scale.

---

## Future Improvements  

- Order tracking system  
- Admin dashboard for product and order management  
- Invoice generation  
- Email confirmation after successful payment  
- Product filtering and advanced search  
- Performance optimization and scalability enhancements  

---

## License  

This project is licensed under the **MIT License**.
