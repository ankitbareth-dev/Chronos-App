import { Navigate } from "react-router-dom";
import LandingPage from "../features/landingPage/LandingPage";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";

export const LandingPageWrapper: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
};
