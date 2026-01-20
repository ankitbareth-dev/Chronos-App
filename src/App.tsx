import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkAuth, selectAuth } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner";

import RouteGuard from "./layouts/RouteGuard";

const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const AuthPage = lazy(() => import("./features/auth/AuthPage"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const ProfilePage = lazy(() => import("./features/profile/ProfilePage"));
const MatrixDetailsPage = lazy(
  () => import("./features/matrix/MatrixDetailsPage"),
);

const App = () => {
  const dispatch = useAppDispatch();
  const { initialLoading } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return initialLoading ? (
    <Spinner />
  ) : (
    <Router>
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<RouteGuard requireAuth={false} />}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<LandingPage />} />
          </Route>

          <Route element={<RouteGuard requireAuth={true} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/matrix/:id"
              element={<MatrixDetailsPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
