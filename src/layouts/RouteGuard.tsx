import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";

type RouteGuardProps = {
  requireAuth: boolean;
};

const RouteGuard: React.FC<RouteGuardProps> = ({ requireAuth }) => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
export default RouteGuard;
