<div align="center">

# ⏳ Chronos

**Visualize your time, master your life.**

[![React](https://img.shields.io/badge/React-20232A-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

Chronos is an intuitive time-tracking application frontend that transforms your schedule into a visual matrix. It features a highly responsive UI, real-time state management, and dynamic visualizations.

</div>

---

## 🌟 Features

- **📅 Dynamic Matrix Generation**
  - Generates grid layouts based on API data (Date range, intervals).
  - Supports custom intervals (15, 30, 60 mins).
- **🎨 Smart Category System**
  - Create, Edit, and Delete color-coded categories.
  - Reactive list updates with toast notifications.
- **🖱️ Interactive Grid Experience**
  - Optimistic UI filling (changes appear instantly).
  - Toggle functionality (Click to fill, Click again to unfill).
  - Real-time "Unsaved changes" detection and persistence.
- **📊 Live Analytics**
  - Real-time stats calculation as you interact with the grid.
  - Visualizes completion percentage and category distribution.
- **⚡ Performance Optimized**
  - Code splitting using `React.lazy` and `LazyOnView` for faster initial load.
  - Derived state pattern using `useMemo` to prevent unnecessary re-renders.
- **📱 Fully Responsive**
  - Mobile-first design with sticky headers and scrollable grid containers.

---

## 🛠️ Tech Stack

- **React 18** with Hooks (`useEffect`, `useMemo`, `useLayoutEffect`)
- **Redux Toolkit** for global state management (Auth, Matrix, Cells, Categories)
- **React Router v6** for client-side routing
- **Tailwind CSS** with custom design tokens for styling
- **React Icons** for iconography
- **Zod** (Validation schemas import)

---

## ⚙️ Installation

**Prerequisites:**

- Node.js installed.
- Backend API running (ensure backend server is available).

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/chronos.git
    cd chronos
    ```

2.  **Navigate to Client and Install Dependencies**

    ```bash
    cd client
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the `client` root directory:

    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4.  **Start the Development Server**

    ```bash
    npm run dev
    ```

    The application will open at `http://localhost:3000` (or your configured port).

---

## 📖 Usage Guide

1.  **Authentication**
    - Sign up or log in to access your dashboard.
2.  **Create a Matrix**
    - Navigate to the Dashboard and click "New Matrix".
    - Define the time range and interval.
3.  **Manage Categories**
    - Go to Matrix Details.
    - Add/Select categories to define your activities.
4.  **Fill the Grid**
    - Select a category to enable the grid.
    - Click cells to fill them.
    - Click filled cells to toggle (unfill) them.
    - Click "Save Changes" to persist data to the API.
5.  **View Stats**
    - Observe the statistics cards update in real-time as you fill the grid.

---

---

## 🗺️ Roadmap

- [ ] Dark Mode
- [ ] Data Export (CSV/PDF)
- [ ] Search & Filter Matrices
- [ ] Mobile App (React Native)

---

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">
  <sub>Built with ❤️ by Ankit Bareth</sub>
</div>
