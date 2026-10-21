# 🎫 Complaint & Helpdesk Ticket System (PS8)
**MERN Stack Project | Roll Number Ending in 8**

A web-based Complaint and Helpdesk Management System built using the **MERN** stack (MongoDB, Express.js, React.js, and Node.js). This project implements the **40% core working vertical slice** of the assignment, focusing on user authentication, role-based protection, and complete end-to-end customer ticket management with business rule enforcement.

---

## 📌 Problem Statement Overview (PS8)

* **Domain:** Customer Support / Helpdesk
* **Target Users:** `Customer` and `Support/Admin`
* **Models:** `User`, `Department`, `Ticket`, `Comment`
* **Current Implementation Scope (~40%):**
  * Full user registration & login with role differentiation (`customer` and `admin`).
  * JWT-based authentication and route protection (`authHandler` and `ProtectedRoute`).
  * Creation of tickets with auto-generated readable Ticket IDs (e.g., `TKT-1001`).
  * Customer ticket dashboard ("My Tickets") with status filters, loading, error, and empty states.
  * Dynamic ticket detail page (`/tickets/:id`) using React Router `useParams`.
  * Shared reusable form component (`TicketForm.jsx`) for adding and editing tickets.
  * **Backend Business Rule Enforcement:** A customer can only edit or delete a ticket while its status is **Open**.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | Client-side SPA with React Router v6 |
| **Backend** | Node.js + Express.js | RESTful JSON API with MVC architecture |
| **Database** | MongoDB + Mongoose | Document database with schema validation |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs | Secure password hashing & stateless token auth |

---

## 📁 Project Architecture & Folder Structure

```text
assignment6/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic using mongoose
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile fetching
│   │   └── ticketController.js   # Ticket CRUD operations and business rule checks
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification (authHandler) & role authorization (allowRoles)
│   │   └── errorMiddleware.js    # JSON error handler and 404 route catcher
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   └── Ticket.js             # Ticket schema with readable ticketId & status enum
│   ├── routes/
│   │   ├── authRoutes.js         # Routes for /api/auth
│   │   └── ticketRoutes.js       # Routes for /api/tickets
│   ├── .env.example              # Template environment variables
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js        # Fetch helper functions for auth endpoints
│   │   │   └── ticketApi.js      # Fetch helper functions for ticket endpoints
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation bar with role badges and logout
│   │   │   ├── ProtectedRoute.jsx# Auth wrapper component using <Navigate>
│   │   │   └── TicketForm.jsx    # Shared form component for creating and editing tickets
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Login form with client/server validation
│   │   │   ├── RegisterPage.jsx  # Registration form with role selector
│   │   │   ├── TicketListPage.jsx# "My Tickets" list with loading, error, and empty states
│   │   │   ├── TicketDetailPage.jsx # Dynamic detail page with status & student extension area
│   │   │   ├── TicketCreatePage.jsx # New ticket creation page
│   │   │   ├── TicketEditPage.jsx   # Ticket edit page (with Open status guard)
│   │   │   └── NotFoundPage.jsx  # 404 fallback page
│   │   ├── App.css               # Clean, responsive CSS styling
│   │   ├── App.jsx               # Routes definition and user auth state
│   │   └── main.jsx              # React DOM entry point wrapped in BrowserRouter
│   ├── .env.example              # Template frontend environment variables
│   ├── index.html                # HTML entry template
│   ├── package.json              # Frontend dependencies and Vite scripts
│   └── vite.config.js            # Vite bundler configuration
│
└── README.md                     # Project documentation and setup guide
```

---

## 🚀 Getting Started & Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher installed)
* **MongoDB** (Local MongoDB server running on port `27017` or a free MongoDB Atlas cluster URI)

---

### 1. Setting Up the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: On macOS, port `5001` is used by default because port `5000` is reserved by macOS AirPlay Receiver.*

4. Start the backend server:
   ```bash
   npm run dev
   ```
   You should see:
   ```text
   Server running in development mode on port 5001
   MongoDB Connected: 127.0.0.1
   ```

---

### 2. Setting Up the Frontend

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `VITE_API_URL=http://localhost:5001/api` matches your backend port).*

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open your browser and visit: **`http://localhost:5173`**

---

## 📋 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`, `role`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Fetch profile of the logged-in user |

### Tickets (`/api/tickets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tickets` | Private | Raise a new ticket (auto-generates readable ID e.g. `TKT-1001`) |
| `GET` | `/api/tickets/my` | Private | List all tickets created by current customer |
| `GET` | `/api/tickets/:id` | Private | Fetch details of a single ticket |
| `PUT` | `/api/tickets/:id` | Private | Update ticket (**allowed only when status is 'Open'**) |
| `DELETE` | `/api/tickets/:id` | Private | Delete ticket (**allowed only when status is 'Open'**) |

---

## 🔒 Key Business Rules Implemented

1. **Role-Based Protection:** 
   Customers can access customer ticket routes, and unauthorized users are redirected to `/login` via `<ProtectedRoute>`.
2. **Auto-Generated Readable IDs:**
   Every ticket is automatically assigned a human-readable identifier (e.g. `TKT-1001`, `TKT-1002`) instead of only raw Mongo ObjectIDs.
3. **Open Status Lock Rule:**
   Customers can only edit (`PUT`) or delete (`DELETE`) a ticket when its status is **`Open`**. If a ticket status moves to `In Progress`, `Resolved`, or `Closed`, modifications are rejected by both frontend controls and backend validations with a `400 Bad Request`.

---

## 🎯 Next Steps: Remaining Features for You to Implement (60%)

This foundation is designed for you to independently extend and complete the assignment:

1. **Admin Ticket Management (`/admin/tickets`):**
   * Create an admin controller function to view all tickets in the system.
   * Add filters for `status`, `priority`, and `category`.
   * Add a status transition dropdown (`Open` → `In Progress` → `Resolved` → `Closed`).
2. **Department Management (`/admin/departments`):**
   * Create `backend/models/Department.js` (fields: `name`, `description`).
   * Add CRUD routes (`/api/departments`) restricted to `allowRoles('admin')`.
   * Allow support staff to assign tickets to a department (`ticket.assignedDepartment`).
3. **Ticket Comments Thread:**
   * Create `backend/models/Comment.js` (fields: `ticket`, `author`, `message`, `createdAt`).
   * Add routes `GET /api/comments/:ticketId` and `POST /api/comments/:ticketId`.
   * Render the discussion thread on `TicketDetailPage.jsx`.
4. **Reopening Rules:**
   * Allow a customer to reopen a `Resolved` ticket once (`reopenCount < 1`).
   * Keep `Closed` tickets strictly read-only.
5. **Admin Analytics Dashboard (`/admin/dashboard`):**
   * Create an aggregation endpoint calculating:
     * Total open vs. resolved count.
     * Priority-wise breakdown (Low, Medium, High).
     * Category-wise breakdown.
     * Average resolution time.
6. **Stretch Goal (SLA Tracking):**
   * Flag high-priority tickets open for more than 24 hours as `Overdue` on the dashboard.
