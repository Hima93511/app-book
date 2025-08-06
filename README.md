# 🏥 MediBook - Medical Appointment Booking System

A modern, responsive **medical appointment booking platform** built with **React, TypeScript, TailwindCSS**, and a **role-based authentication system**. Designed for **patients** and **admins** with a clean, professional UI and a premium healthcare theme.

---

## 🚀 Features

### ✅ Core Features
- 🔐 **Role-Based Authentication**
  - Patient and Admin roles
  - Protected routes using `ProtectedRoute` component
- 📅 **Appointment Booking**
  - View available slots
  - Book appointments without conflicts
- 🏠 **Dashboard**
  - Patient Dashboard for appointments
  - Admin Dashboard for managing schedules
- 🖥️ **Responsive UI**
  - Optimized for **desktop & mobile**
  - Dark theme with **premium gradients**
- 🎨 **Custom Tailwind Design System**
  - Medical-grade gradients
  - Interactive hover effects
  - Smooth animations
  - Gradient text utilities

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI Styling:** TailwindCSS with custom design tokens
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Authentication:** Context-based role protection
- **Animations:** Tailwind + CSS keyframes

---

## 📂 Project Structure

src/
├── components/
│ ├── ui/
│ ├── Layout.tsx # Premium Header & Main layout
│
├── contexts/
│ └── AuthContext.tsx # Auth logic
│
├── routes/
│ └── ProtectedRoute.tsx # Role-based route protection
│
├── pages/
│ ├── Login.tsx
│ ├── Dashboard.tsx
│ ├── Admin.tsx
│
├── styles/
│ └── index.css # Tailwind custom theme
│
└── main.tsx

markdown
Copy
Edit

---

## 🔑 Protected Routes

- `ProtectedRoute` component restricts access based on:
  - **Authentication**
  - **User Role**
- Redirects users to:
  - `/login` if unauthenticated
  - `/admin` or `/dashboard` if role mismatch

Example:
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
🎨 Custom Design System
Premium Gradient Utilities

css
Copy
Edit
.bg-gradient-primary { background: var(--gradient-primary); }
.text-gradient-primary {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
Shadow Utilities

css
Copy
Edit
.shadow-glow { box-shadow: var(--shadow-glow); }
Animations: fadeIn, slideUp, glow

⚡ Getting Started
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/medibook.git
cd medibook
2️⃣ Install Dependencies
bash
Copy
Edit
npm install
3️⃣ Start Development Server
bash
Copy
Edit
npm run dev
✅ Build for Production
bash
Copy
Edit
npm run build
npm run preview
📷 Screenshots
Home Dashboard
(Add screenshot here)

Admin Panel
(Add screenshot here)

🛡️ License
This project is licensed under the MIT License.

🤝 Contributing
Contributions are welcome! Feel free to open issues and submit pull requests.

🌐 Live Demo
[🔗 Add your deployed link here]
