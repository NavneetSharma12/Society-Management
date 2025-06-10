import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check for token in cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

    if (!tokenCookie && !user) {
      // No token found and no user in state, redirect to login
      navigate('/login');
    } else if (tokenCookie && !user) {
      // Token exists but no user in state, try to fetch user data
      // You might want to add an API call here to validate the token and get user data
      navigate('/dashboard');
    }
  }, [navigate, user]);

  return <>{children}</>;
};

export default RouteGuard;