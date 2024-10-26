import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css';
import { Root } from './pages/root/Root';
import DashBoard from './pages/dashboard/DashBoard';
import NotFound from './pages/notfound/NotFound';
import Buses from './pages/bus/Buses';
import Enterance from './pages/enterance/Enterance';
import Notifications from './pages/notifications/Notifications';
import Login from './pages/login/Login';
import UserAuthProvider, { useCurrentUser } from './containers/UserAuthProvider';
import Notification from './pages/notification/Notification';

// Protect routes if the user is not logged in
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return null; // You can replace with a loading spinner if necessary
  }

  if (!user) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  return element;
};

// Redirect logged-in users trying to access login
const RedirectIfLoggedIn = ({ element }) => {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return null; // Loading state, spinner or fallback UI can be added here
  }

  if (user) {
    // If user is logged in, redirect them to dashboard
    return <Navigate to="/" />;
  }

  return element;
};

// Routes setup with login and protected routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Route - Redirects to dashboard if logged in */}
      <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />

      <Route path="/" element={<Root />}>
      <Route index element={<ProtectedRoute element={<DashBoard />} />} />
      <Route path="buses" element={<ProtectedRoute element={<Buses />} />} />
      <Route path="enterance" element={<ProtectedRoute element={<Enterance />} />} />
      <Route path="notifications" element={<ProtectedRoute element={<Notifications />} />} />
      
      {/* Public Route */}
      <Route path="login" element={<Login />} />

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Route>

     
    </>
  )
);

function App() {
  return (
    <UserAuthProvider>
      <RouterProvider router={router} />
      <Notification />
    </UserAuthProvider>
  );
}

export default App;
