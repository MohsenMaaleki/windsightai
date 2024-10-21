import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ContactUs from './components/ContactUs';
import RequestDemo from './components/RequestDemo';

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/request-demo" element={<RequestDemo />} />
          </Routes>
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;