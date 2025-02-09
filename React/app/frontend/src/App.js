import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Layout } from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import Register from './pages/Register';
import theme from './theme';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
  },
  {
    path: "/dashboard",
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: "/contact",
    element: <Layout><ContactUs /></Layout>,
  },
  {
    path: "/register",
    element: <Layout><Register /></Layout>,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;