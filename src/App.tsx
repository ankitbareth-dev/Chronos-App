import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "./app/hooks";

import Navbar from "./components/Navbar";

import { checkAuth, selectAuth } from "./features/auth/authSlice";
import { LandingPageWrapper } from "./components/LandingPageWrapper";

const AuthPage = lazy(() => import("./features/auth/AuthPage"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

function App() {
  const dispatch = useAppDispatch();
  const { initialLoading } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (initialLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-ui-bg">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="text-4xl text-brand-500 animate-spin" />
          <p className="text-ui-muted">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/" element={<LandingPageWrapper />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
