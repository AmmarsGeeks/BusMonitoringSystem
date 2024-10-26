import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useCurrentUser } from './containers/UserAuthProvider';
import Buses from './pages/bus/Buses';
import Login from './pages/login/Login';
import Notifications from './pages/notifications/Notifications';
import Enterance from './pages/enterance/Enterance';
import NotFound from './pages/notfound/NotFound';

export const WithoutAuthRoutes = [
  '/login',
];


const getRoutes = (isLogin) => {
  if (isLogin) {
      return [
        { path: '/', element: <Root /> },
        { path: 'buses', element: <Buses /> },
        { path: 'enterance', element: <Enterance /> },
        { path: 'notifications', element: <Notifications /> },
        { path: '*', element: <NotFound />  }, 
      ];
    
  }

  return [
    { path: 'login', element: <Login /> },
    { path: '*', element: <Navigate to="/login" /> }, 
  ];
};

function Router() {
  const { loading, user } = useCurrentUser();
  const isLogin = !!user;
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
        const isWithoutAuthRoute = WithoutAuthRoutes.some((route) => route === location.pathname);

        if (!isLogin && !isWithoutAuthRoute) {
        window.location.href = '/login';
        } else if (isLogin && isWithoutAuthRoute) {
        window.location.href = '/';
        }
    }, [isLogin, loading, location]);

  const routes = getRoutes(isLogin);

  if (loading) {
    return null; 
  }

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default React.memo(Router);