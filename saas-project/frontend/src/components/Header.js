import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import { useUser } from '../UserContext';

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Heading as={RouterLink} to="/" color="blue.900" size="lg" fontWeight="extrabold">
          WindSightAI
        </Heading>
        <Flex align="center">
          <Button as={RouterLink} to="/contact" variant="ghost" color="white" mr={2}>
            Contact Us
          </Button>
          {user ? (
            <>
              <Text color="white" mr={4}>Welcome, {user.username}</Text>
              <Button 
                as={RouterLink} 
                to="/dashboard" 
                variant="solid" 
                colorScheme="blue" 
                mr={2}
              >
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline" color="white">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="ghost" color="white" mr={2}>
                Login
              </Button>
              <Button as={RouterLink} to="/request-demo" variant="solid" colorScheme="green">
                Request Demo
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;