import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkAuth, selectAuth } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

import RouteGuard from "./layouts/RouteGuard";
import NotFound from "./components/NotFound";

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

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  return showSplash ? (
    <SplashScreen isExiting={!initialLoading} />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
